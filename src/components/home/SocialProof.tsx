"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export function SocialProof() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("value")
          .eq("key", "founder_quote")
          .single();

        if (error) throw error;
        if (data) setQuote(data.value);
      } catch (err) {
        // Fallback to static data if Supabase fails (silently in production to keep console clean)
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching content:", err);
        }
        setQuote(defaultQuote);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const defaultQuote = "We don't just build games; we architect digital legacies. Every project we take on is a partnership built on transparency and radical results.";

  return (
    <section id="about" className="relative z-20 py-28 bg-void overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_55%)] pointer-events-none" />
      <div className="absolute left-1/2 top-10 h-[420px] w-[700px] -translate-x-1/2 rounded-[80px] border border-white/5 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent opacity-60 rotate-2 pointer-events-none hidden lg:block" />
      <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-neon-blue/20 via-neon-blue/10 to-transparent opacity-70 pointer-events-none hidden md:block" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Humanizing the Brand - Founder's Note */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent rotate-1 pointer-events-none" />
            <div className="absolute -right-12 -top-8 h-24 w-48 rounded-full border border-white/10 bg-white/[0.03] blur-sm pointer-events-none" />
            <GlassCard className="p-12 border-white/10 bg-white/[0.06] shadow-[0_0_80px_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border border-white/20">
                   {/* Placeholder for real team photo */}
                   <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Burgundy Ventures</h4>
                </div>
              </div>
              <p className="text-2xl italic text-white/90 leading-relaxed mb-10">
                "{quote || (loading ? "..." : defaultQuote)}"
              </p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-neon-blue text-lg">★</span>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-white/70 text-sm">
                  Client outcome: 1.1M visitors in 3 days for a global brand launch.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Risk Reversal / Friction Removal */}
          <div className="space-y-12 relative">
            <div className="absolute -right-8 top-0 h-[420px] w-[4px] bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-60 pointer-events-none hidden lg:block" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              Removing the <br /> <span className="text-white/40 italic font-light">Fear of Failure.</span>
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-white/10 bg-white/[0.02] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent px-8 py-8 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-semibold text-white/70">
                  A
                </span>
                <div className="relative flex-1 h-px bg-gradient-to-r from-white/30 via-white/10 to-white/30">
                  <span className="absolute left-[28%] -top-1.5 h-3 w-3 rounded-full bg-neon-blue/80 ring-4 ring-neon-blue/20" />
                  <span className="absolute left-1/2 -top-1.5 h-3 w-3 rounded-full bg-neon-purple/80 ring-4 ring-neon-purple/20" />
                  <span className="absolute left-[72%] -top-1.5 h-3 w-3 rounded-full bg-white/80 ring-4 ring-white/10" />
                </div>
                <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-semibold text-white/70">
                  B
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <span>Concept</span>
                <span>Launch</span>
              </div>
              <div className="mt-8 space-y-4 text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-neon-blue/90" />
                  <p><span className="text-white/90 font-medium">Game designers make ideas reality.</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-neon-purple/90" />
                  <p><span className="text-white/90 font-medium">Top-of-the-line developers implement.</span></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-white/80" />
                  <p><span className="text-white/90 font-medium">Industry-leading influencers market.</span></p>
                </div>
              </div>
              <p className="mt-8 text-white/70 text-sm leading-relaxed">
                We leverage our experience to unite brand integration, leading Roblox powerhouses, and global industry influencers creating standout experiences across the Roblox metaverse.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
