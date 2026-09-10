"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ExternalLink, Gauge, Wallet } from "lucide-react";
import {
  COOKIE_EXPLORER,
  COOKIE_RPC,
  formatBalance,
} from "@/lib/constants";

type ChainStatus = "polling" | "healthy" | "degraded";

/** Live COOKIE balance, chain status and explorer link. */
export default function NetworkCards() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [balance, setBalance] = useState<string | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<ChainStatus>("polling");

  // Live balance, refreshed on connect + every 10s.
  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }
    let cancelled = false;

    const fetchBalance = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (!cancelled) setBalance(formatBalance(lamports));
      } catch {
        if (!cancelled) setBalance("?");
      }
    };

    fetchBalance();
    const id = setInterval(fetchBalance, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [connection, publicKey, connected]);

  // Chain heartbeat: block height + RPC latency every 5s.
  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      const t0 = performance.now();
      try {
        const height = await connection.getBlockHeight();
        const ms = Math.round(performance.now() - t0);
        if (cancelled) return;
        setBlockHeight(height);
        setLatency(ms);
        setStatus("healthy");
      } catch {
        if (!cancelled) setStatus("degraded");
      }
    };

    ping();
    const id = setInterval(ping, 5_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [connection]);

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <article className="card-glow p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-dough-400">
          <Wallet className="size-4" />
          Your COOKIE Balance
        </div>
        {connected ? (
          <p className="font-mono text-3xl font-bold text-glow-amber tabular-nums">
            {balance === null ? "…" : balance}
            <span className="ml-2 text-sm font-medium text-slate-400">COOKIE</span>
          </p>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="text-sm font-medium text-dough-400 underline decoration-dotted underline-offset-4 hover:text-dough-500"
          >
            Connect wallet to view balance
          </button>
        )}
      </article>

      <article className="card-glow p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-dough-400">
          <Gauge className="size-4" />
          Chain Status
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`size-2.5 rounded-full ${
              status === "healthy"
                ? "bg-neon-mint shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                : status === "degraded"
                  ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  : "bg-slate-500 animate-pulse"
            }`}
          />
          <span className="font-mono text-xl font-bold">
            {status === "healthy" ? "Live" : status === "degraded" ? "Degraded" : "Polling"}
          </span>
          {latency !== null && status === "healthy" && (
            <span className="font-mono text-sm text-neon-mint">{latency} ms</span>
          )}
        </div>
        <p className="mt-2 font-mono text-xs text-slate-400">
          {blockHeight !== null
            ? `block #${blockHeight.toLocaleString()} · ${COOKIE_RPC.replace("https://", "")}`
            : "awaiting RPC heartbeat…"}
        </p>
      </article>

      <article className="card-glow p-5 flex flex-col">
        <div className="mb-3 flex items-center gap-2 text-sm text-dough-400">
          <ExternalLink className="size-4" />
          Explorer
        </div>
        <p className="text-sm text-slate-300">Every crumb, on-chain and public.</p>
        <a
          href={COOKIE_EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1.5 text-sm font-semibold text-neon-cyan transition hover:bg-neon-cyan/20"
        >
          cookiescan.io
          <ExternalLink className="size-3.5" />
        </a>
      </article>
    </section>
  );
}
