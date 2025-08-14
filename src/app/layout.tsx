"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@turnkey/react-wallet-kit/dist/styles.css";
import { TurnkeyLogoSVG } from "@/components/Svg";
import {
  CreateSubOrgParams,
  TurnkeyProvider,
  TurnkeyProviderConfig,
} from "@turnkey/react-wallet-kit";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const createSubOrgParams: CreateSubOrgParams = {
  subOrgName: "Interview Sub Org" + Date.now(),
  customWallet: {
    walletName: "Default Wallet",
    // Ethereum account
    walletAccounts: [
      {
        curve: "CURVE_SECP256K1",
        path: "m/44'/60'/0'/0/0",
        pathFormat: "PATH_FORMAT_BIP32",
        addressFormat: "ADDRESS_FORMAT_ETHEREUM",
      },
    ],
  },
};

const turnkeyConfig: TurnkeyProviderConfig = {
  organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  authProxyConfigId: process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID!,
  // Default to prod, not needed
  // apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  // authProxyUrl: process.env.NEXT_PUBLIC_AUTH_PROXY_URL!,
  auth: {
    createSuborgParams: {
      emailOtpAuth: createSubOrgParams,
      smsOtpAuth: createSubOrgParams,
      passkeyAuth: createSubOrgParams,
      walletAuth: createSubOrgParams,
      oauth: createSubOrgParams,
    },
  },
  ui: {
    darkMode: true,
    colors: {
      light: {
        primary: "#335bf9",
        modalBackground: "#f5f7fb",
      },
      dark: {
        primary: "#335bf9",
        modalBackground: "#0b0b0b",
      },
    },
  },

  // Disable external wallets
  walletConfig: {
    features: {
      auth: true,
      connecting: false,
    },
    chains: {},
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen justify-between flex flex-col relative`}
      >
        <TurnkeyProvider
          config={turnkeyConfig}
          callbacks={{
            onError: (error) => {
              console.error(error);
            },
          }}
        >
          <>
            <Navbar />
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
              {children}
            </div>
          </>
        </TurnkeyProvider>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center h-20 z-50">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://turnkey-0e7c1f5b-amir-wallet-kit-docs.mintlify.app/sdks/react/index" // TODO: Replace this with the real docs link when available
            target="_blank"
            rel="noopener noreferrer"
          >
            <TurnkeyLogoSVG className="w-6 h-6" />
            Turnkey{" "}
            <code className="bg-gray-900 rounded p-0.5 text-sm">
              react-wallet-kit
            </code>{" "}
            docs
          </a>
        </footer>
      </body>
    </html>
  );
}
