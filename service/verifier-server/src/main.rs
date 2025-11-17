use anyhow::Result;
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tracing::{info, error};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

mod verifier;
mod attestation;
mod plaid;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let addr = "0.0.0.0:7047";
    let listener = TcpListener::bind(addr).await?;

    info!("🔐 AuditorZK Verifier Server");
    info!("================================");
    info!("📡 Listening on: {}", addr);
    info!("✅ Ready to verify TLS sessions from prover clients");
    info!("");

    loop {
        match listener.accept().await {
            Ok((stream, peer_addr)) => {
                info!("📥 New connection from: {}", peer_addr);

                tokio::spawn(async move {
                    if let Err(e) = handle_client(stream, peer_addr).await {
                        error!("❌ Error handling client {}: {}", peer_addr, e);
                    }
                });
            }
            Err(e) => {
                error!("❌ Failed to accept connection: {}", e);
            }
        }
    }
}

async fn handle_client(
    stream: tokio::net::TcpStream,
    peer_addr: std::net::SocketAddr,
) -> Result<()> {
    info!("🤝 Upgrading connection to WebSocket for {}", peer_addr);

    // Accept WebSocket connection
    let ws_stream = accept_async(stream).await?;
    info!("✅ WebSocket established with {}", peer_addr);

    // Handle verification
    verifier::handle_verification(ws_stream, peer_addr).await?;

    info!("✓ Verification complete for {}", peer_addr);
    Ok(())
}
