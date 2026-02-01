"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Gamepad2, Megaphone, LineChart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function Services() {
  return (
    <section id="services" className="py-36 relative overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] block mb-10"
            >
              Capabilities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
            >
              Unlocking Value <br /> Through <span className="text-white/40 font-light italic">Architecture.</span>
            </motion.h2>
          </div>
        </div>

        {/* Bento Grid - Refined Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[280px]">
          {/* Main Service - Wide */}
          <GlassCard className="md:col-span-7 md:row-span-2 md:translate-y-6 group flex flex-col justify-between border-white/10 bg-white/[0.02] shadow-[0_0_60px_rgba(255,255,255,0.05)]">
            <div className="relative z-10">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] block mb-8">
                Signature Build
              </span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all duration-500">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-4xl font-bold mb-8 tracking-tight">Full-Cycle <br /> Game Development</h3>
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Conceptualize unique gameplay mechanics tailored to brand identity. 
                Full-cycle development from prototype to final launch.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4 mt-12">
              {["Roblox", "UE5", "Unity", "Cross-Platform"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Service 2 - Square */}
          <GlassCard className="md:col-span-5 md:row-span-2 md:-translate-y-8 group flex flex-col justify-between border-white/10 bg-white/[0.02]">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-blue transition-all duration-500">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="relative z-10">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
                Activation
              </span>
              <h3 className="text-3xl font-bold mb-6 tracking-tight">Brand <br /> Integrations</h3>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                Seamlessly weave assets into existing high-traffic environments. 
                Authentic, non-intrusive opportunities.
              </p>
              <ArrowUpRight className="w-6 h-6 text-white/60 group-hover:text-white transition-all" />
            </div>
          </GlassCard>

          {/* Service 3 - Wide Footer */}
          <GlassCard className="md:col-span-11 md:col-start-2 md:row-span-1 md:-translate-y-4 group flex items-center justify-between py-12 border-white/10 bg-white/[0.02]">
            <div className="flex gap-12 items-center">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-purple transition-all duration-500">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">
                  Advisory
                </span>
                <h3 className="text-2xl font-bold tracking-tight">Market Consultation</h3>
                <p className="text-white/70 text-sm mt-2 tracking-wide font-medium">Audit current digital assets for gamification potential and ROI forecasting.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Strategy</span>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
