"use client";

import dynamic from "next/dynamic";
import type WalletProviders from "./providers";

/**
 * Client root: everything wallet-related is loaded with `ssr: false` so no
 * wallet/window code ever runs on the server — the source of hydration errors.
 */
const WalletProvidersDynamic = dynamic(
  () => import("./providers") as Promise<{ default: typeof WalletProviders }>,
  { ssr: false }
);

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <WalletProvidersDynamic>{children}</WalletProvidersDynamic>;
}
