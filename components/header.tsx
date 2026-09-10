"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Cookie, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-dough-500/15 bg-crust-900/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-dough-400 to-choco-500 shadow-[0_0_20px_rgba(240,168,50,0.4)]">
          <Cookie className="size-6 text-crust-950" />
        </span>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-glow-amber">
            CookiePulse 🍪⚡
          </h1>
          <p className="text-xs text-slate-400">Degenerate analytics for a crumbly chain</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-neon-mint/30 bg-neon-mint/10 px-3 py-1 text-xs font-medium text-neon-mint sm:flex">
          <Zap className="size-3.5" />
          Cookie Chain SVM - Sub-second Finality
        </span>
        <WalletMultiButton />
      </div>
    </header>
  );
}