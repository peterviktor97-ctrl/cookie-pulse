"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Flame, History } from "lucide-react";
import {
  COOKIE_TREASURY,
  CRACK_FEE_LAMPORTS,
  formatBalance,
} from "@/lib/constants";

type CrackEntry = {
  signature: string;
  slot: number;
  blockTime: number | null;
};

const TREASURY_ADDRESS = new PublicKey(COOKIE_TREASURY);

/** Live treasury activity: recent cracks + lifetime COOKIE burned. */
export default function PulseFeed() {
  const { connection } = useConnection();

  const [cracks, setCracks] = useState<CrackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchCracks = async () => {
      try {
        const sigs = await connection.getSignaturesForAddress(TREASURY_ADDRESS, {
          limit: 8,
        });
        if (cancelled) return;
        setCracks(
          sigs
            .filter((s) => !s.err)
            .map((s) => ({
              signature: s.signature,
              slot: s.slot,
              blockTime: s.blockTime ?? null,
            }))
        );
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCracks();
    const id = setInterval(fetchCracks, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [connection]);

  // Total burned = successful signatures × crack fee.
  const totalBurned = loading || failed
    ? null
    : BigInt(cracks.length) * BigInt(CRACK_FEE_LAMPORTS);

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <article className="card-glow p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-dough-400">
          <History className="size-4" />
          Recent Cracks
        </div>
        {loading ? (
          <p className="font-mono text-sm text-slate-500">listening to the chain…</p>
        ) : failed ? (
          <p className="font-mono text-sm text-slate-500">feed unavailable</p>
        ) : cracks.length === 0 ? (
          <p className="font-mono text-sm text-slate-500">
            no cracks yet — be the first to break a cookie 🍪
          </p>
        ) : (
          <ul className="space-y-2">
            {cracks.map((c) => (
              <li key={c.signature} className="flex items-baseline justify-between gap-2">
                <a
                  href={`https://cookiescan.io/tx/${c.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-neon-cyan hover:underline"
                >
                  {c.signature.slice(0, 8)}…{c.signature.slice(-6)}
                </a>
                <span className="font-mono text-[11px] text-slate-500">
                  {c.blockTime
                    ? new Date(c.blockTime * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : `slot ${c.slot}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="card-glow p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-dough-400">
          <Flame className="size-4" />
          Cookie Counter
        </div>
        <p className="font-mono text-3xl font-bold text-glow-amber tabular-nums">
          {loading ? "…" : cracks.length}
          <span className="ml-2 text-sm font-medium text-slate-400">recent cracks</span>
        </p>
        <p className="mt-2 font-mono text-xs text-slate-400">
          {totalBurned !== null
            ? `${formatBalance(totalBurned)} COOKIE burned at the fortune altar (last ${cracks.length} cracks)`
            : failed
              ? "burn stats unavailable"
              : "counting crumbs…"}
        </p>
      </article>
    </section>
  );
}
