"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  NightlyWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ToastProvider } from "./toast";
import { COOKIE_RPC } from "@/lib/constants";

/** Wallet + connection context. Client-only; mounted via dynamic import with ssr:false. */
export default function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = COOKIE_RPC;

  // Wallets must be memoized or the adapter reconnects every render.
  const wallets = useMemo(
    () => [
      new NightlyWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const autoConnect = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("walletAutoConnect") === "true";
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletModalProvider>
          <ToastProvider>{children}</ToastProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
