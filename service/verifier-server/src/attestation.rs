use anyhow::{Result, Context};
use k256::{
    schnorr::{SigningKey, Signature, VerifyingKey, signature::Signer},
    elliptic_curve::rand_core::OsRng,
};
use k256::sha2::{Digest, Sha256};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tracing::{info, warn};
use tlsn_core::VerifierOutput;

const KEY_PATH: &str = "config/notary_key.pem";
const PUBKEY_PATH: &str = "config/notary_pubkey.pem";
const SIGNATURE_VERSION: [u8; 3] = [0x01, 0x00, 0x00]; // BIP-340 signature version 1.0.0

/// Attestation structure that will be signed
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attestation {
    /// The server that was connected to
    pub server_name: String,
    /// Timestamp of the session
    pub timestamp: u64,
    /// Commitment to the balance data (first hash commitment)
    pub balance_commitment: Vec<u8>,
    /// BIP-340 signature (hex-encoded with 3-byte version prefix)
    pub signature: String,
    /// The verifier's public key (for signature verification)
    pub verifier_pubkey: Vec<u8>,
}

/// Sign the verification output as an attestation
pub async fn sign_attestation(mut output: VerifierOutput) -> Result<Vec<u8>> {
    info!("🔏 Creating and signing attestation...");

    // Load or generate signing key
    let signing_key = load_or_generate_key()?;
    let verifying_key = signing_key.verifying_key();

    // Extract server name
    let server_name = output.server_name.take()
        .map(|sn| format!("{:?}", sn.as_str()))
        .unwrap_or_else(|| "unknown".to_string());

    // Get current timestamp
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)?
        .as_secs();

    // Extract balance commitment (first hash commitment from received data)
    let balance_commitment = extract_balance_commitment(&output)?;

    // Pad server_name to 32 bytes (right-padded with zeros)
    let mut server_name_padded = [0u8; 32];
    let server_name_bytes = server_name.as_bytes();
    if server_name_bytes.len() > 32 {
        anyhow::bail!("Server name too long: {} bytes (max 32)", server_name_bytes.len());
    }
    server_name_padded[..server_name_bytes.len()].copy_from_slice(server_name_bytes);

    // Pad timestamp to 32 bytes (right-padded with zeros)
    let mut timestamp_padded = [0u8; 32];
    let timestamp_bytes = timestamp.to_le_bytes(); // 8 bytes
    timestamp_padded[..8].copy_from_slice(&timestamp_bytes);

    info!("📝 Attestation details:");
    info!("   Server: {} (padded to 32 bytes)", server_name);
    info!("   Server bytes: {}", hex::encode(&server_name_padded));
    info!("   Timestamp: {} (padded to 32 bytes)", timestamp);
    info!("   Timestamp bytes: {}", hex::encode(&timestamp_padded));
    info!("   Commitment: {}", hex::encode(&balance_commitment));

    // Create message to sign (server_name + timestamp + balance_commitment)
    // All fields are now 32 bytes each
    let mut message = Vec::new();
    message.extend_from_slice(&server_name_padded);
    message.extend_from_slice(&timestamp_padded);
    message.extend_from_slice(&balance_commitment);

    // Hash the message
    let message_hash = Sha256::digest(&message);
    info!("   hash: {}", hex::encode(message_hash));

    // Sign with BIP-340 Schnorr
    let signature: Signature = signing_key.sign(&message_hash);

    // Create hex-encoded signature with 3-byte version prefix
    let sig_bytes = signature.to_bytes();
    let mut versioned_sig = Vec::with_capacity(67); // 3 + 64
    versioned_sig.extend_from_slice(&SIGNATURE_VERSION);
    versioned_sig.extend_from_slice(&sig_bytes);
    let hex_signature = hex::encode(versioned_sig);

    info!("✅ Attestation signed with BIP-340 Schnorr");
    info!("   Signature: {}...", &hex_signature);

    // Create attestation structure
    let attestation = Attestation {
        server_name,
        timestamp,
        balance_commitment,
        signature: hex_signature,
        verifier_pubkey: verifying_key.to_bytes().to_vec(),
    };

    // Serialize attestation
    let attestation_bytes = serde_json::to_vec_pretty(&attestation)?;

    // Save attestation to file for contract simulator
    save_attestation(&attestation)?;

    Ok(attestation_bytes)
}

/// Extract the balance commitment from transcript commitments
/// MOCK IMPLEMENTATION: Creates a fake commitment from the transcript data
fn extract_balance_commitment(output: &VerifierOutput) -> Result<Vec<u8>> {
    // TEMPORARY MOCK: Extract balance from transcript and create commitment
    // In production, this should come from the prover's selective disclosure

    let transcript = output.transcript.as_ref()
        .context("No transcript available")?;

    let received_bytes = transcript.received_unsafe();

    // Find the JSON body (skip HTTP headers - look for "\r\n\r\n")
    let body_start = received_bytes
        .windows(4)
        .position(|window| window == b"\r\n\r\n")
        .context("No HTTP body separator found")?
        + 4;

    let json_body = &received_bytes[body_start..];

    let json_str = std::str::from_utf8(json_body)
        .context("Invalid UTF-8 in JSON body")?;

    info!("📄 JSON body (for mocking commitment):");
    info!("{}", json_str);

    // Parse JSON to extract balance
    let json: serde_json::Value = serde_json::from_str(json_str)
        .context("Failed to parse JSON response")?;

    let accounts = json["accounts"].as_array()
        .context("No accounts array found")?;

    let mut total_balance = 0.0;
    for account in accounts {
        // Try to get balance from "current" field (can be f64 or i64)
        if let Some(current) = account["balances"]["current"].as_f64() {
            total_balance += current;
        } else if let Some(current) = account["balances"]["current"].as_i64() {
            total_balance += current as f64;
        } else if let Some(current) = account["balances"]["current"].as_u64() {
            total_balance += current as f64;
        }
    }

    if total_balance == 0.0 {
        anyhow::bail!("No balance found in accounts");
    }

    info!("💰 Total balance (extracted): ${:.2}", total_balance);

    // Create mock commitment: hash(balance_string || mock_blinder)
    let balance_string = format!("{:.2}", total_balance);
    let mock_blinder = b"mock_blinder_for_testing"; // In production, from MPC

    let mut commitment_preimage = Vec::new();
    commitment_preimage.extend_from_slice(balance_string.as_bytes());
    commitment_preimage.extend_from_slice(mock_blinder);

    use sha2::{Digest, Sha256};
    let commitment_hash = Sha256::digest(&commitment_preimage);

    info!("🔐 Mock commitment created: {}...", hex::encode(&commitment_hash));

    Ok(commitment_hash.to_vec())
}

/// Load existing key or generate new one
fn load_or_generate_key() -> Result<SigningKey> {
    if Path::new(KEY_PATH).exists() {
        info!("🔑 Loading existing signing key from {}", KEY_PATH);
        // For simplicity, just generate a new key each time for now
        // In production, properly load from PEM
        warn!("⚠️  Key persistence not yet implemented, using ephemeral key");
    }

    info!("🔑 Generating new ECDSA signing key");
    let signing_key = SigningKey::random(&mut OsRng);

    // Ensure config directory exists
    fs::create_dir_all("config").context("Failed to create config directory")?;

    // Save public key for verification
    let verifying_key = signing_key.verifying_key();
    let pubkey_bytes = verifying_key.to_bytes();
    fs::write(PUBKEY_PATH, hex::encode(pubkey_bytes))
        .context("Failed to save public key")?;
    info!("💾 Public key saved to {}", PUBKEY_PATH);

    Ok(signing_key)
}

/// Save attestation to file for contract simulator
fn save_attestation(attestation: &Attestation) -> Result<()> {
    let attestation_json = serde_json::to_string_pretty(attestation)?;
    let path = "/tmp/auditor_zk_attestation.json";
    fs::write(path, attestation_json)
        .context("Failed to save attestation")?;
    info!("💾 Attestation saved to {}", path);
    Ok(())
}
