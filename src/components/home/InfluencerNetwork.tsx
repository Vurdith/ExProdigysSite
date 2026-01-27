"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Globe2, Users2, Youtube } from "lucide-react";

const influencers = [
  {
    name: "LankyBox",
    region: "USA / Global",
    subs: "38.5M",
    platform: "YouTube",
    focus: "Variety Gaming",
  },
  {
    name: "Flamingo",
    region: "USA",
    subs: "13.1M",
    platform: "YouTube",
    focus: "Comedy / Chaos",
  },
  {
    name: "ItsFunneh",
    region: "Canada",
    subs: "10.5M",
    platform: "YouTube",
    focus: "Roleplay / Group",
  },
  {
    name: "KreekCraft",
    region: "USA",
    subs: "10.2M",
    platform: "YouTube",
    focus: "News / Live Events",
  },
  {
    name: "Thinknoodles",
    region: "USA",
    subs: "10.1M",
    platform: "YouTube",
    focus: "Simulators / Tips",
  },
];

export function InfluencerNetwork() {
  return (
    <section id="influencers" className="py-32 relative bg-void overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] block mb-10"
            >
              Amplification
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              The Influencer <br /> <span className="text-white/40 font-light italic">Network.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-white/70 text-lg max-w-sm leading-relaxed"
          >
            Leveraging high-reach creators to drive massive traffic and 
            viral engagement for every brand activation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {influencers.map((influencer, i) => (
            <GlassCard 
              key={influencer.name}
              className="group border-white/5 hover:border-neon-blue/20"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <Youtube className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <Globe2 className="w-3 h-3 text-neon-blue" />
                    {influencer.region}
                  </div>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                    {influencer.name}
                  </h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                    {influencer.focus}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users2 className="w-4 h-4 text-white/20" />
                    <span className="text-2xl font-black text-white tracking-tighter">
                      {influencer.subs}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                    Subscribers
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* Aggregate Stat Card */}
          <GlassCard className="bg-neon-blue/5 border-neon-blue/20 flex flex-col justify-center text-center p-12">
            <h4 className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
              Total Managed Reach
            </h4>
            <span className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4">
              100M+
            </span>
            <p className="text-white/60 text-sm font-medium tracking-wide">
              Global audience across <br /> primary gaming territories.
            </p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
