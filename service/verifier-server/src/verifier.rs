use anyhow::{Result, Context};
use futures::{StreamExt, SinkExt};
use tokio_tungstenite::WebSocketStream;
use tokio_tungstenite::tungstenite::Message;
use tokio_util::compat::TokioAsyncReadCompatExt;
use tracing::{info, debug, warn};

use tlsn_common::config::ProtocolConfigValidator;
use tlsn_core::{VerifierOutput, VerifyConfig};
use tlsn_verifier::{Verifier, VerifierConfig};

use crate::attestation::sign_attestation;
use crate::plaid::validate_plaid_connection;

/// Maximum data sizes for Plaid API calls
const MAX_SENT_DATA: usize = 4096;      // 4KB for requests
const MAX_RECV_DATA: usize = 16384;     // 16KB for responses

pub async fn handle_verification<S>(
    ws_stream: WebSocketStream<S>,
    peer_addr: std::net::SocketAddr,
) -> Result<()>
where
    S: tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin + Send + 'static,
{
    info!("🔍 Starting verification for {}", peer_addr);

    // Create bidirectional channel for MPC protocol
    let (prover_stream, verifier_stream) = tokio::io::duplex(1 << 20); // 1MB buffer

    // Split WebSocket into read/write halves
    let (mut ws_write, mut ws_read) = ws_stream.split();

    // Split prover stream for forwarding
    let (mut prover_read, mut prover_write) = tokio::io::split(prover_stream);

    // Forward: WebSocket → Prover stream (writes)
    let ws_to_prover = tokio::spawn(async move {
        use tokio::io::AsyncWriteExt;
        while let Some(msg) = ws_read.next().await {
            match msg {
                Ok(Message::Binary(data)) => {
                    if let Err(e) = prover_write.write_all(&data).await {
                        warn!("Error forwarding to prover stream: {}", e);
                        break;
                    }
                }
                Ok(Message::Close(_)) => {
                    debug!("WebSocket closed by prover");
                    break;
                }
                Err(e) => {
                    warn!("WebSocket error: {}", e);
                    break;
                }
                _ => {}
            }
        }
    });

    // Forward: Prover stream (reads) → WebSocket
    let prover_to_ws = tokio::spawn(async move {
        use tokio::io::AsyncReadExt;
        let mut buf = vec![0u8; 8192];
        loop {
            match prover_read.read(&mut buf).await {
                Ok(0) => break, // EOF
                Ok(n) => {
                    if let Err(e) = ws_write.send(Message::Binary(buf[..n].to_vec())).await {
                        warn!("Error sending to WebSocket: {}", e);
                        break;
                    }
                }
                Err(e) => {
                    warn!("Error reading from prover stream: {}", e);
                    break;
                }
            }
        }
    });

    // Run verifier with verifier side of duplex stream
    let output = run_verifier(verifier_stream.compat()).await?;

    // Validate Plaid-specific requirements
    validate_plaid_connection(&output)?;

    // Sign attestation
    let attestation = sign_attestation(output).await?;

    info!("✅ Attestation signed");
    info!("   Attestation size: {} bytes", attestation.len());

    // Wait for forwarding tasks to complete
    let _ = tokio::join!(ws_to_prover, prover_to_ws);

    Ok(())
}

async fn run_verifier<T>(socket: T) -> Result<VerifierOutput>
where
    T: futures::AsyncRead + futures::AsyncWrite + Send + Sync + Unpin + 'static,
{
    info!("⚙️  Configuring verifier...");

    // Step 1: Create protocol config validator
    let config_validator = ProtocolConfigValidator::builder()
        .max_sent_data(MAX_SENT_DATA)
        .max_recv_data(MAX_RECV_DATA)
        .build()
        .context("Failed to build protocol config validator")?;

    info!("📋 Protocol limits: {}KB sent, {}KB recv",
          MAX_SENT_DATA / 1024, MAX_RECV_DATA / 1024);

    // Step 2: Create verifier config with default root store (Mozilla roots)
    let verifier_config = VerifierConfig::builder()
        .protocol_config_validator(config_validator)
        .build()
        .context("Failed to build verifier config")?;

    // Step 3: Create verifier instance
    let verifier = Verifier::new(verifier_config);
    info!("🔧 Verifier initialized");

    // Step 4: Run verification protocol
    info!("🚀 Starting MPC-TLS verification...");
    let output = verifier
        .verify(socket, &VerifyConfig::default())
        .await
        .context("Verification failed")?;

    info!("✅ MPC-TLS verification complete");

    // Step 5: Log what was verified
    if let Some(server_name) = &output.server_name {
        info!("🌐 Verified server: {:?}", server_name);
    }

    if let Some(transcript) = &output.transcript {
        info!("📊 Transcript: {} bytes sent, {} bytes received",
              transcript.sent_unsafe().len(),
              transcript.received_unsafe().len());
    }

    info!("🔐 Commitments: {} bytes of transcript commitments received",
          output.transcript_commitments.len());

    Ok(output)
}
