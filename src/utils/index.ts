import { decryptExportBundle, generateP256KeyPair } from "@turnkey/crypto";
import { Wallet, hashMessage, verifyMessage } from "ethers";

// This function signs a message with a private key using Ethers.js.
export async function signMessageWithPrivateKey(
  privateKey: string,
  message: string
) {
  // privKey can be with or without 0x prefix
  const wallet = new Wallet(privateKey);
  const signature = await wallet.signMessage(message); // EIP-191: "\x19Ethereum Signed Message:\n" + len + msg

  // optional helpers
  const digest = hashMessage(message); // keccak256 of the prefixed message
  const recovered = verifyMessage(message, signature);

  return {
    address: wallet.address,
    message,
    digest,
    signature,
    recoveredOk: recovered.toLowerCase() === wallet.address.toLowerCase(),
  };
}

// This function generates a P256 key pair for encrypting / decrypting purposes.
// This will return the publicKey, privateKey, and publicKeyUncompressed.
export async function handleGenerateKeypair() {
  return generateP256KeyPair();
}

// This function is used to export a wallet account from Turnkey, encrypting it with a P256 public key.
export async function handleExportWalletAccount(
  publicKeyUncompressed: string, // P256 public key in uncompressed format. Turnkey will encrypt the export bundle with this key.
  address: string, // The address of the wallet account to export
  httpClient: any // The Turnkey HTTP client instance
) {
  const res = await httpClient?.exportWalletAccount({
    address,
    targetPublicKey: publicKeyUncompressed,
  });
  if (res) {
    return res.exportBundle;
  } else {
    console.error("Failed to export wallet account");
    return null;
  }
}

// This function decrypts the export bundle (the bundle you get from handleExportWalletAccount) using the P256 private key and returns the decrypted private key of the wallet account.
export async function handleDecryptExportBundle(
  exportBundle: string,
  suborgId: string,
  privateKey: string // P256 private key used to decrypt the export bundle
) {
  return decryptExportBundle({
    exportBundle,
    organizationId: suborgId,
    embeddedKey: privateKey,
    returnMnemonic: false, // We are returning the private key directly, not the mnemonic
  });
}

// Just used for UI purposes to truncate an address for display.
// Example: "0x1234567890abcdef1234567890abcdef12345678 -> "0x1234...5678"
export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
