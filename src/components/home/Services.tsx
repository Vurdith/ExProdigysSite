"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Gamepad2, Megaphone, LineChart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { ArtifactCore } from "@/components/ui/ArtifactCore";

export function Services() {
  return (
    <section id="services" className="py-36 relative overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_50%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        {/* Central 3D accent */}
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 opacity-35 hidden lg:block">
          <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
            <ArtifactCore />
          </Canvas>
        </div>
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
            >
              Unlocking Value <br /> Through <span className="text-white/40 font-light italic">Architecture.</span>
            </motion.h2>
            <p className="text-white/60 mt-6 max-w-xl">
              We plan, build, and launch experiences that feel native to Roblox culture and brand-safe by design.
            </p>
          </div>
        </div>

        {/* Bento Grid - Refined Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[280px]">
          {/* Main Service - Wide */}
          <GlassCard className="relative overflow-hidden md:col-span-6 md:row-span-2 group flex flex-col border-white/10 bg-white/[0.05] shadow-[0_0_60px_rgba(255,255,255,0.08)] transform-gpu transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.4deg]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent" />
            <div className="pointer-events-none absolute -left-6 bottom-10 h-24 w-24 rounded-full border border-white/10 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col h-full p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-4xl font-bold tracking-tight leading-tight">Full-Cycle <br /> Game Development</h3>
                  <p className="text-white/70 text-base mt-4 mb-6 leading-relaxed">
                    Conceptualize unique gameplay mechanics tailored to brand identity. 
                    Full-cycle development from prototype to final launch.
                  </p>
                </div>
                <div className="w-12 h-12 min-w-12 min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center text-white/80 flex-shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto pt-8 border-t border-white/10 text-sm text-white/60">
                End-to-end production with concept, build, and launch handled in one pipeline.
              </div>
            </div>
          </GlassCard>

          {/* Service 2 - Square */}
          <GlassCard className="relative overflow-hidden md:col-span-6 md:row-span-2 group flex flex-col border-white/10 bg-white/[0.05] transform-gpu transition-all duration-500 hover:-translate-y-2 hover:rotate-[-0.3deg]">
            <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full border border-white/10 bg-gradient-to-tr from-white/[0.1] via-transparent to-transparent" />
            <div className="pointer-events-none absolute right-8 top-8 h-16 w-16 rounded-full border border-white/10 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col h-full p-8">
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-3xl font-bold tracking-tight leading-tight">Brand <br /> Integrations</h3>
                <div className="w-12 h-12 min-w-12 min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center text-white/80 flex-shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/70 text-base leading-relaxed mt-4 mb-6">
                Seamlessly weave assets into existing high-traffic environments. 
                Authentic, non-intrusive opportunities.
              </p>
              <div className="mt-auto pt-8 border-t border-white/10" />
            </div>
          </GlassCard>

          {/* Service 3 - Wide Footer */}
          <GlassCard className="relative overflow-hidden md:col-span-12 md:row-span-1 group flex items-center justify-between border-white/10 bg-white/[0.05] transform-gpu transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.2deg]">
            <div className="pointer-events-none absolute right-12 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-white/10 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent" />
            <div className="pointer-events-none absolute left-12 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-white/10 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent" />
            <div className="flex items-center justify-between w-full p-8">
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 min-w-12 min-h-12 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center text-white/80 flex-shrink-0">
                  <LineChart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Market Consultation</h3>
                  <p className="text-white/70 text-sm mt-2 tracking-wide font-medium">
                    Audit current digital assets for gamification potential and ROI forecasting.
                  </p>
                </div>
              </div>
              <div />
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
