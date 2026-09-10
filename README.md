# CookiePulse 🍪⚡

CookiePulse is a weekend hackathon build: a small web3 dashboard that shows your live COOKIE balance, chain health, and lets you pay 0.001 COOKIE to crack a fortune cookie on-chain. It runs on Cookie Chain (an SVM chain) specifically because of its sub-second finality — the fortune transaction confirms before the confetti even finishes loading.

## Links

- **Live demo:** https://cookiepulse.demo.example (placeholder — deploy to Vercel and swap in the real URL)
- **Explorer:** https://cookiescan.io
- **RPC:** `https://rpc.cookiescan.io`
- **API:** `https://api.cookiescan.io`
- **Treasury (fortune fee sink):** `1111111111111111111111111111111111111111`

## Architecture

- **Next.js 16 App Router** — the scaffold shipped on 16.3.4; the commit message says 14 and lies. Server components for the shell, everything wallet-related is client-only.
- **@solana/web3.js** — `Connection` against the Cookie Chain RPC, `SystemProgram.transfer` for the fortune fee, blockhash-based confirmation.
- **Nightly Wallet Adapter** — first-class support alongside Phantom and Solflare via `@solana/wallet-adapter-react`.
- **`api.cookiescan.io`** — reserved for the stats/fortune endpoints; the current build reads everything straight from the RPC.
- **SSR boundary** — wallet providers load through `dynamic(..., { ssr: false })`, so no wallet code ever touches the server render and hydration errors stay theoretical.

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:3000, connect Nightly (or Phantom), crack a cookie. A real run costs 0.001 COOKIE per fortune, so keep a crumb of SOL-equivalent in your wallet for it.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust if you're pointing at a different Cookie Chain deployment:

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_COOKIE_RPC` | `https://rpc.cookiescan.io` | Cookie Chain RPC endpoint used by the `Connection` |
| `NEXT_PUBLIC_COOKIE_EXPLORER` | `https://cookiescan.io` | Base URL for transaction links on the fortune card |

> These are wired but currently hardcoded in `lib/constants.ts` — switching to `process.env` reads is a two-line change if you fork this.
