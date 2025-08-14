"use client";

import {
  AuthState,
  ClientState,
  useModal,
  useTurnkey,
  Wallet,
  WalletSource,
} from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v1WalletAccount } from "@turnkey/sdk-types";
import { EthereumSVG } from "@/components/Svg";
import { signMessageWithPrivateKey, truncateAddress } from "@/utils";
import { generateP256KeyPair, decryptExportBundle } from "@turnkey/crypto";

export default function Home() {
  const router = useRouter();
  const { handleLogin, clientState, authState, wallets, httpClient, session } = useTurnkey();
  const { pushPage } = useModal();

  const [activeAccount, setActiveAccount] = useState<
    v1WalletAccount | undefined
  >();
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const exportWalletAccount = async (address: string) => {
    const keyPair = generateP256KeyPair();
        const res = await httpClient?.exportWalletAccount({
          address,
          targetPublicKey: keyPair.publicKeyUncompressed,
        });
    if (res) {
      return {exportBundle: res.exportBundle, keyPair};
    } else {
      console.error("Failed to export wallet account");
      return null;
    }
  }

  useEffect(() => {
    if (
      authState === AuthState.Unauthenticated &&
      clientState === ClientState.Ready
    ) {
      handleLogin();
    }
  }, [clientState]);

  useEffect(() => {
    if (wallets.length > 0) {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.source === WalletSource.Embedded
      );

      if (embeddedWallet) {
        setActiveAccount(embeddedWallet.accounts[0]);
        setActiveWallet(embeddedWallet);

       exportWalletAccount(embeddedWallet.accounts[0].address).then((res) => {
        if (!res) {
          console.error("Failed to export wallet account");
          return;
        }
        decryptExportBundle({exportBundle: res.exportBundle, organizationId: session?.organizationId!, embeddedKey: res.keyPair.privateKey, returnMnemonic: false}).then((privateKey) => {
          console.log("Decrypted Private Key:", privateKey);
          signMessageWithPrivateKey(privateKey, "Hello, Turnkey!").then((signature) => {
            console.log("Signature:", signature);
            pushPage({
              key: "Sign Message",
              content: (
                <div className="flex flex-col items-center gap-4">
                  <p>Message: Hello, Turnkey!</p>
                  <p>Signature: {signature.signature}</p>
                </div>
              ),
            });
          });
        });
      });
      }
    }
  }, [wallets]);


  return (
    <>
      {authState === AuthState.Unauthenticated ? (
        <div className="font-sans flex items-center justify-center h-full w-full">
          <main className="flex flex-col gap-[32px] items-center sm:items-start w-full h-full">
            <button
              className="min-h-[calc(100vh-5rem)] w-full flex-1"
              onClick={() => handleLogin()}
            >
              Press anywhere to login
            </button>
          </main>
        </div>
      ) : (
        <div className="font-sans flex flex-col items-center justify-center gap-6 bg-neutral-800 p-6 rounded-lg">
          <div className="flex items-center justify-between w-full">
            <h1>
              {activeWallet ? activeWallet.walletName : "No Wallet Connected"}
            </h1>
            <div className="flex items-center gap-2">
              <EthereumSVG className="w-6 h-6" />
              <span>
                {activeAccount ? truncateAddress(activeAccount.address) : "No Account Selected"}
              </span>
            </div>
          </div>
          <button className="w-full py-2 bg-primary-dark rounded-lg">
            Sign
          </button>
        </div>
      )}
    </>
  );
}
