import { ExitIntentPopup } from "@/components/conversion/ExitIntentPopup";
import { FeaturedGames } from "@/components/home/FeaturedGames";
import { Hero } from "@/components/home/Hero";
import { MarketStats } from "@/components/home/MarketStats";
import { Services } from "@/components/home/Services";
import { SocialProof } from "@/components/home/SocialProof";
import { Navbar } from "@/components/layout/Navbar";
import { ScheduleMeetingFAB } from "@/components/ui/ScheduleMeetingFAB";

export default function Home() {
  return (
    <main className="min-h-screen bg-void selection:bg-neon-purple/30">
      <Navbar />
      <Hero />
      <SocialProof />
      <MarketStats />
      <Services />
      <FeaturedGames />
      <ExitIntentPopup />
      <ScheduleMeetingFAB />
      
      <footer className="py-20 border-t border-white/10 text-center text-white/40">
        <p>© 2026 Burgundy Ventures. All rights reserved.</p>
      </footer>
    </main>
  );
}
