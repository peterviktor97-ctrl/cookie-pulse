import Header from "@/components/header";
import NetworkCards from "@/components/network-cards";
import PulseFeed from "@/components/pulse-feed";
import FortuneCookie from "@/components/fortune-cookie";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <NetworkCards />
        <div className="mt-8">
          <PulseFeed />
        </div>
        <div className="mt-8">
          <FortuneCookie />
        </div>
      </main>
      <footer className="border-t border-dough-500/10 px-6 py-4 text-center font-mono text-xs text-slate-500">
        CookiePulse · built on Cookie Chain SVM · crumbs are not financial advice
      </footer>
    </>
  );
}