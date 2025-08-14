import { Wallet, hashMessage, verifyMessage } from "ethers";

export async function signMessageWithPrivateKey(privKey: string, message: string) {
  // privKey can be with or without 0x prefix
  const wallet = new Wallet(privKey);
  const signature = await wallet.signMessage(message); // EIP-191: "\x19Ethereum Signed Message:\n" + len + msg

  // optional helpers
  const digest = hashMessage(message);               // keccak256 of the prefixed message
  const recovered = verifyMessage(message, signature);

  return {
    address: wallet.address,
    message,
    digest,       
    signature,    
    recoveredOk: recovered.toLowerCase() === wallet.address.toLowerCase(),
  };
}

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}