"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import confetti from "canvas-confetti";
import { Cookie, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "./toast";
import {
  COOKIE_TREASURY,
  CRACK_FEE_LAMPORTS,
  FORTUNES,
  explorerUrl,
} from "@/lib/constants";

/** Wallets phrase user rejection differently; match the common variants. */
function isUserRejection(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /user rejected|rejected the request|cancel|denied|4001/i.test(msg);
}

type Phase =
  | { kind: "idle" }
  | { kind: "broadcasting" }
  | { kind: "confirming" }
  /** signature is null in Demo Mode (no on-chain transaction was sent) */
  | { kind: "confirmed"; fortune: string; signature: string | null }
  | { kind: "failed" };

/** Random fortune, picked once on confirm and stored in phase state so it never reshuffles. */
function pickFortune(): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

function fireConfetti() {
  const end = Date.now() + 1200;
  const colors = ["#f5c66d", "#f0a832", "#ffb347", "#a0642f", "#4ade80"];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    scalar: 1.1,
  });
}

/** "Crack the Fortune Cookie": pay 0.001 COOKIE, get a degenerate fortune.
 *  Falls back to Demo Mode — full confetti + fortune, no on-chain tx —
 *  when the wallet is empty or the RPC transfer fails. */
export default function FortuneCookie() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const toast = useToast();

  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const busy = phase.kind === "broadcasting" || phase.kind === "confirming";

  /** Success path without an on-chain transaction: fortune + confetti, marked as demo. */
  function demoCrack() {
    setPhase({ kind: "confirmed", fortune: pickFortune(), signature: null });
    toast.show({ kind: "success", text: "Demo Crack Confirmed" });
    fireConfetti();
  }

  async function crack() {
    if (!publicKey) return;

    // Preflight: a wallet with zero balance can't even pay the network fee.
    // Demo Mode instead — full experience, no on-chain spend.
    let balance = 0;
    try {
      balance = await connection.getBalance(publicKey);
    } catch {
      balance = 0;
    }
    if (balance < CRACK_FEE_LAMPORTS) {
      demoCrack();
      return;
    }

    setPhase({ kind: "broadcasting" });
    const loadingId = toast.show({
      kind: "loading",
      sticky: true,
      text: "Broadcasting to Cookie Chain...",
    });

    let signature: string;
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(COOKIE_TREASURY),
          lamports: CRACK_FEE_LAMPORTS,
        })
      );

      signature = await sendTransaction(tx, connection);
    } catch (err) {
      toast.dismiss(loadingId);
      if (isUserRejection(err)) {
        // The user said no — never fake a success on top of that.
        setPhase({ kind: "failed" });
        toast.show({ kind: "info", text: "Transaction canceled in wallet." });
      } else {
        // RPC/wallet failure → Demo Mode keeps the moment alive.
        demoCrack();
      }
      return;
    }

    setPhase({ kind: "confirming" });
    const t0 = performance.now();
    try {
      const latest = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature, blockhash: latest.blockhash, lastValidBlockHeight: latest.lastValidBlockHeight },
        "confirmed"
      );
      const elapsedMs = Math.round(performance.now() - t0);

      toast.dismiss(loadingId);
      setPhase({ kind: "confirmed", fortune: pickFortune(), signature });
      toast.show({
        kind: "success",
        text: `Cookie cracked in ${elapsedMs}ms! Check signature on CookieScan.`,
        href: explorerUrl(signature),
        hrefLabel: "CookieScan",
      });
      fireConfetti();
    } catch (err) {
      toast.dismiss(loadingId);
      // The transaction was broadcast, so it may still land — don't pretend
      // it didn't happen. Surface the error, let the user retry manually.
      setPhase({ kind: "failed" });
      toast.show({
        kind: "error",
        text: err instanceof Error ? err.message : "Confirmation failed",
      });
    }
  }

  const label: Record<Phase["kind"], string> = {
    idle: "Crack a Cookie (Send 0.001 COOKIE)",
    broadcasting: "Broadcasting to Cookie Chain...",
    confirming: "Broadcasting to Cookie Chain...",
    confirmed: "Crack another Cookie",
    failed: "Crumbled — try again",
  };

  return (
    <section className="card-glow relative overflow-hidden p-6 sm:p-10 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(240,168,50,0.12),transparent)]" />

      <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-glow-amber">
        Crack the Fortune Cookie 🥠
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        Pay 0.001 COOKIE to the cookie gods, receive one certified-degenerate fortune.
        Confirmed in sub-second finality.
      </p>

      {phase.kind === "confirmed" && (
        <div className="mx-auto mt-6 max-w-lg rounded-xl border border-dough-500/30 bg-crust-800/80 p-5">
          <p className="font-mono text-lg text-dough-400 text-glow-amber">
            “{phase.fortune}”
          </p>
          {phase.signature ? (
            <a
              href={explorerUrl(phase.signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neon-cyan hover:underline"
            >
              View transaction on CookieScan
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neon-mint">
              Demo Mode — no COOKIE was spent
            </p>
          )}
        </div>
      )}

      {phase.kind === "failed" && (
        <p className="mt-6 text-sm text-red-300">Crumbled — check the toast for details.</p>
      )}

      {/* Status ticker */}
      {(phase.kind === "broadcasting" || phase.kind === "confirming") && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-dough-400">
          <Loader2 className="size-4 animate-spin" />
          {phase.kind === "broadcasting"
            ? "Broadcasting to Cookie Chain..."
            : "Confirming — sub-second finality incoming..."}
        </p>
      )}

      <div className="mt-8">
        {connected ? (
          <button
            onClick={crack}
            disabled={busy}
            className="btn-crack mx-auto block px-8 py-4 text-lg font-extrabold tracking-wide"
          >
            {label[phase.kind]}
          </button>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="btn-crack mx-auto block px-8 py-4 text-lg font-extrabold tracking-wide"
          >
            Connect Wallet to Crack
          </button>
        )}
      </div>

      <p className="mt-4 font-mono text-[11px] text-slate-500">
        Fee: 0.001 COOKIE → {COOKIE_TREASURY.slice(0, 4)}…{COOKIE_TREASURY.slice(-4)} (system burner)
      </p>
    </section>
  );
}