export const COOKIE_RPC = "https://rpc.cookiescan.io";
export const COOKIE_EXPLORER = "https://cookiescan.io";

/** Burner / treasury address that receives the fortune-cookie fee. */
export const COOKIE_TREASURY = "1111111111111111111111111111111111111111";

/** Fee per cracked cookie, in lamports (0.001 COOKIE). */
export const CRACK_FEE_LAMPORTS = 1_000_000;

export const FORTUNES = [
  "100x alpha awaits you in the Cookie Jar 🍪",
  "Sub-second finality has blessed your portfolio ⚡",
  "A whale is watching your wallet. Wave back 🐋",
  "You will find riches in an airdrop you forgot you farmed",
  "Do not sell. The crumbs become the loaf 🍞",
  "Your seed phrase is safe. Your emotions are not",
  "The devs doxxed the tokenomics. It is still a mystery",
  "Sell the news? There was never any news. Buy anyway",
  "Fortune favors the degenerate who HODLs through the dip",
  "Your next gas fee will be suspiciously low. Savor it",
  "A mint is coming. It will be crumbly but profitable",
  "Trust the fork. The fork is delicious",
  "Your PnL is green in a universe far, far away",
  "The cookie crumbles for everyone. Your entry point does not",
  "Beware of the rug that wears the sugar coating",
  "You will be early. Then you will be very, very late",
  "The chain confirms in 400ms. Your exit liquidity confirms slower",
  "Someone is about to FOMO into your bag. Let them",
];

export function explorerUrl(signature: string): string {
  return `${COOKIE_EXPLORER}/tx/${signature}`;
}

/** Split a lamport amount into an integer COOKIE part and a fractional part. */
export function formatBalance(lamports: bigint | number): string {
  const value = typeof lamports === "bigint" ? lamports : BigInt(Math.round(lamports));
  const whole = value / 1_000_000_000n;
  const frac = value % 1_000_000_000n;
  const fracStr = frac.toString().padStart(9, "0").slice(0, 4).replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : whole.toString();
}
