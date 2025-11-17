use anyhow::{Result, bail};
use tracing::{info, warn};
use tlsn_core::VerifierOutput;

/// Validate that the connection was to a Plaid server or localhost (for testing)
pub fn validate_plaid_connection(output: &VerifierOutput) -> Result<()> {
    info!("🏦 Validating server connection...");

    // Check server identity
    let server_name = output.server_name.as_ref()
        .ok_or_else(|| anyhow::anyhow!("No server name provided"))?;

    // In alpha.12, ServerName has an as_str() method
    let name_str = server_name.as_str();

    // Accept Plaid domains or localhost for testing
    let is_valid = name_str.ends_with(".plaid.com") ||
        name_str == "production.plaid.com" ||
        name_str == "sandbox.plaid.com" ||
        name_str == "development.plaid.com" ||
        name_str == "localhost" ||
        name_str == "127.0.0.1";

    if !is_valid {
        warn!("❌ Server is not a valid Plaid or test domain: {}", name_str);
        bail!("Server must be a Plaid API endpoint or localhost for testing");
    }

    info!("✅ Confirmed valid server: {}", name_str);

    // // Validate we received commitments
    // if output.transcript_commitments.is_empty() {
    //     warn!("⚠️  No transcript commitments provided");
    //     bail!("Prover must commit to transcript data");
    // }

    info!("✅ {} transcript commitments received",
          output.transcript_commitments.len());

    // Optionally validate transcript content (if revealed)
    if let Some(transcript) = &output.transcript {
        let recv = String::from_utf8_lossy(transcript.received_unsafe());

        // Check for Plaid API response structure or generic JSON
        if recv.contains("\"accounts\"") {
            info!("✅ Detected balance API response structure");
        } else if recv.contains("HTTP/1.1") || recv.contains("HTTP/1.0") {
            info!("✅ Valid HTTP response received");
        } else {
            warn!("⚠️  Response doesn't look like expected API response");
        }
    }

    Ok(())
}

/// Analyze and log commitment details for debugging
#[allow(dead_code)]
pub fn analyze_commitments(output: &VerifierOutput) {
    info!("📊 Commitment Analysis:");
    info!("  Total commitments: {}", output.transcript_commitments.len());
    // Note: In alpha.12, transcript_commitments is just a Vec<u8>
    // For detailed analysis, we'd need to deserialize the commitment structure
}
