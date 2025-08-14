"use client";

import { AuthState, useTurnkey } from "@turnkey/react-wallet-kit";
import { EthereumSVG } from "@/components/Svg";
import { truncateAddress } from "@/utils";

export default function Home() {
  const { handleLogin, authState, wallets, session, httpClient } = useTurnkey();

  // ******************************
  // Some helper variables for you:

  // The first wallet in the suborg.
  // Wallets are fetched automatically when the user logs in. You can grab these wallets from the `useTurnkey` hook.
  const targetWallet = wallets[0];

  // The first wallet account of the first wallet.
  // A wallet account is a derrived address from the wallet's seedphrase.
  // This is an Ethereum account.
  const targetAccount = targetWallet?.accounts[0];

  // The organization ID of the suborg the user is logged into. Some functions will ask for an organization ID, so you can use this.
  const suborgId = session?.organizationId;

  // *****************************

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
              {targetWallet ? targetWallet.walletName : "No Wallet Connected"}
            </h1>
            <div className="flex items-center gap-2">
              <EthereumSVG className="w-6 h-6" />
              <span>
                {targetAccount
                  ? truncateAddress(targetAccount.address)
                  : "No Account Selected"}
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
