"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUpRight } from "lucide-react";

const influencers = [
  {
    name: "LankyBox",
    region: "GLOBAL",
    subs: "38.5M",
    focus: "Variety / Gaming",
    metric: "1.2B+ Views/mo",
  },
  {
    name: "Flamingo",
    region: "USA",
    subs: "13.1M",
    focus: "Comedy / Chaos",
    metric: "400M+ Views/mo",
  },
  {
    name: "ItsFunneh",
    region: "CANADA",
    subs: "10.5M",
    focus: "Roleplay / Group",
    metric: "250M+ Views/mo",
  },
  {
    name: "KreekCraft",
    region: "USA",
    subs: "10.2M",
    focus: "Live Events",
    metric: "180M+ Views/mo",
  },
];

export function InfluencerNetwork() {
  return (
    <section id="influencers" className="py-48 relative bg-void overflow-hidden">
      {/* Structural Backdrop */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] overflow-hidden">
        <span className="absolute top-10 left-10 text-[20vw] font-black leading-none select-none">AMPLIFY</span>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col gap-8 mb-32 border-l-2 border-white/10 pl-12">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-white/40 font-bold uppercase tracking-[0.6em] text-[10px]"
          >
            DISTRIBUTION NODES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-white max-w-3xl"
          >
            THE REACH <br />
            <span className="text-white/10 italic font-light">IS ABSOLUTE.</span>
          </motion.h2>
        </div>

        {/* Industrial Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-4 md:px-0 bg-white/5 border border-white/5">
          {influencers.map((influencer, i) => (
            <div 
              key={influencer.name}
              className="group relative bg-void p-12 md:p-16 border border-white/5 hover:bg-white/[0.02] transition-colors duration-700"
            >
              {/* Background Name Overlay */}
              <div className="absolute top-4 right-8 text-white/[0.02] text-8xl font-black select-none group-hover:text-white/[0.05] transition-colors duration-700">
                {influencer.name.split('')[0]}
              </div>

              <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">
                      Node_{i.toString().padStart(2, '0')} // {influencer.region}
                    </p>
                    <h3 className="text-4xl font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                      {influencer.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Reach</p>
                    <p className="text-2xl font-black text-white tracking-tighter">{influencer.subs}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Velocity</p>
                    <p className="text-sm font-medium text-white/60 leading-tight">{influencer.metric}</p>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between">
                  <span className="px-3 py-1 border border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 group-hover:border-white/40 group-hover:text-white transition-all duration-500">
                    {influencer.focus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Summary Footer */}
        <div className="mt-24 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-8">
            <span className="text-7xl md:text-9xl font-black tracking-tighter text-white">100M+</span>
            <div className="h-16 w-[1px] bg-white/10 hidden md:block" />
            <p className="text-white/40 text-sm font-medium tracking-wide max-w-[180px] uppercase leading-relaxed">
              Global managed reach across primary gaming territories.
            </p>
          </div>
          
          <button className="px-12 py-5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black hover:border-white transition-all duration-500">
            Audit Distribution
          </button>
        </div>
      </div>
    </section>
  );
}
