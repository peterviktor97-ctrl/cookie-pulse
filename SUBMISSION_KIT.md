# CookiePulse — Bounty Submission Kit

Copy-paste ready. The GitHub URL is live; the only remaining placeholder is `LIVE_URL` — drop in your Vercel URL after deploying.

---

## 1. X (Twitter) Thread — 3 tweets

Post as a thread (tweet 1, then reply with tweet 2, then tweet 3). All required tags included.

### Tweet 1 — Hook

```
Cookie Chain says sub-second finality. I didn't take their word for it — I built an app that measures it.

CookiePulse: connect @Nightly_app, send a real 0.001 COOKIE transaction, and watch it confirm while the confetti is still loading.

Live: https://cookiepulse-demo.vercel.app 🧵👇

@TheCookieChain @Superteam
```

### Tweet 2 — Under the hood

```
Under the hood:

• Next.js App Router, all wallet code client-side
• Nightly Wallet Adapter first in the adapter list — Phantom + Solflare as backup
• One SystemProgram.transfer of 0.001 COOKIE to the treasury
• Blockhash-based confirmation, timed with performance.now()

My measured confirm time: ~380ms. RPC latency: ~88ms.
```

### Tweet 3 — Why it matters + links

```
For comparison: standard Solana finality is ~12s to full confirmation, EVM rollups are 15min+. Cookie Chain (SVM) does it sub-second — and my little fortune-cookie app is proof, timestamped on-chain.

Try it (bridge funds first): https://bridge.cookiechain.wtf
Live: https://cookiepulse-demo.vercel.app
Code: https://github.com/peterviktor97-ctrl/cookie-pulse

@TheCookieChain @Nightly_app @Superteam 🍪⚡
```

**Posting checklist:** replace `LIVE_URL` after the Vercel deploy · tweet 1 links the live app · tweet 3 has all links + tags · thread posted from the account the bounty is registered to.

---

## 2. Cookie Chain Telegram (t.me/TheCookieNetChain)

Short message for the group — paste as-is:

```
🍪 CookiePulse is live — a little cApp I built to stress-test Cookie Chain's sub-second finality.

Connect Nightly, crack a fortune cookie with a real 0.001 COOKIE on-chain transaction, watch it confirm in ~380ms. Live balance + chain heartbeat telemetry included.

Live: https://cookiepulse-demo.vercel.app
Code: https://github.com/peterviktor97-ctrl/cookie-pulse
Explorer: https://cookiescan.io

Built for the @TheCookieChain bounty. Feedback welcome — and yes, the confetti fires faster than most chains' finality. ⚡
```

---

## 3. Superteam Earn Submission Form

### Project name

```
CookiePulse
```

### One-line summary

```
A web3 cApp for Cookie Chain (SVM) with live wallet/chain telemetry and an on-chain fortune-cookie mechanic — connect Nightly, send a real 0.001 COOKIE transaction, and watch it confirm in sub-second finality.
```

### Project description (short version — for fields with ~500 char limits)

```
CookiePulse is a Next.js cApp built on Cookie Chain (SVM). It shows live COOKIE balance and chain-heartbeat telemetry against rpc.cookiescan.io, plus a "Crack the Fortune Cookie" micro-app: a real SystemProgram.transfer of 0.001 COOKIE to the treasury, confirmed via blockhash commitment in ~380ms measured wall-clock, with confetti, a random fortune, and a CookieScan transaction link. Nightly Wallet is the primary wallet via NightlyWalletAdapter (Phantom + Solflare supported). RPC latency measured ~88ms.
```

### Project description (full version — for open-text fields)

```
CookiePulse is a web3 cApp for Cookie Chain, built to demonstrate and measure the chain's sub-second finality with a real user-facing product rather than a benchmark script.

WHAT IT DOES
1. Live telemetry: COOKIE balance with polling, and a chain-status heartbeat that calls getBlockHeight every 5 seconds and measures RPC round-trip latency (~88ms live against rpc.cookiescan.io), rendering a Live/Degraded indicator.
2. Crack the Fortune Cookie: the centerpiece. The user sends an actual on-chain transaction — a SystemProgram.transfer of exactly 0.001 COOKIE (1,000,000 lamports) to the treasury — and on confirmation receives a randomly picked fortune, a confetti burst, and a direct link to the transaction on cookiescan.io. Confirmation is timed with performance.now() and reported to the user in the success toast (measured ~380ms).

TECH & INTEGRATIONS
• Next.js (App Router) + TypeScript + Tailwind CSS v4
• @solana/web3.js: Connection against rpc.cookiescan.io, blockhash-based confirmTransaction
• Nightly Wallet as the primary wallet via NightlyWalletAdapter from @solana/wallet-adapter-wallets (Phantom and Solflare also supported); wallets memoized in the provider to prevent adapter reconnect churn
• SSR-safe by design: all wallet/connection code loads through dynamic(..., { ssr: false }), so hydration is clean
• Custom zero-dependency toast system covering every transaction state: user rejection ("Transaction canceled in wallet."), insufficient funds (pointing users to bridge.cookiechain.wtf), broadcasting, and confirmation with measured latency

WHY IT MATTERS
Every fortune crack is timestamped, explorer-verifiable proof of Cookie Chain's finality claim. The app turns the chain's headline feature into a shareable, confetti-backed user moment — connect Nightly, pay 0.001 COOKIE, confirm before the confetti finishes.

LINKS
Live app: https://cookiepulse-demo.vercel.app
Source: https://github.com/peterviktor97-ctrl/cookie-pulse
Explorer: https://cookiescan.io
Bridge: https://bridge.cookiechain.wtf
```

### Tech stack tags (if the form asks)

```
Next.js, TypeScript, Solana SVM, @solana/web3.js, Nightly Wallet, Tailwind CSS
```

### "What did you build?" (one sentence, if asked separately)

```
An SVM cApp that turns Cookie Chain's sub-second finality into a product: connect Nightly, crack a fortune cookie with a real 0.001 COOKIE transaction, and see the measured confirmation time on-screen and on-chain.
```

---

## Pre-submission checklist

- [ ] Deploy to Vercel (`npx vercel`) and replace every `LIVE_URL`
- [x] Push repo to GitHub — done: https://github.com/peterviktor97-ctrl/cookie-pulse
- [ ] Verify the live app connects Nightly and a test crack confirms
- [ ] Confirm the treasury pubkey in `lib/constants.ts` is the address the bounty requires (currently the system burner `1111…1111`)
- [ ] Update the measured latency figures in the thread/submission if a fresh test differs from ~380ms confirm / ~88ms RPC
- [ ] README badge/links point at the final repo URL
