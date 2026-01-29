"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { useRef } from "react";

interface Influencer {
  id: string;
  name: string;
  region: string;
  subs: string;
  focus: string;
  metric: string;
  order_index: number;
}

export function InfluencerNetwork() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const { data, error } = await supabase
        .from("influencers")
        .select("*")
        .order("order_index", { ascending: true });

      if (data) setInfluencers(data);
      setLoading(false);
    };

    fetchInfluencers();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xOffset = useTransform(scrollYProgress, [0, 1], ["5%", "-20%"]);
  const springX = useSpring(xOffset, { stiffness: 50, damping: 20 });

  if (loading) {
    return (
      <section className="py-48 bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  // Duplicate for infinite-feeling loop
  const allInfluencers = [...influencers, ...influencers];

  return (
    <section id="influencers" ref={containerRef} className="py-48 relative bg-void overflow-hidden">
      {/* 1. Massive Parallax Background Typography */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center">
        <motion.div 
          style={{ x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
          className="text-[40vw] font-black leading-none whitespace-nowrap select-none flex gap-20"
        >
          <span>AMPLIFY</span>
          <span>GLOBAL</span>
          <span>REACH</span>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 mb-32">
        {/* Editorial Header */}
        <div className="flex flex-col gap-8 border-l-2 border-white/10 pl-12">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-white/60 font-bold uppercase tracking-[0.6em] text-[10px]"
          >
            GLOBAL DISTRIBUTION
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-white max-w-3xl"
          >
            TALENT <br />
            <span className="text-white/20 italic font-light">WITHOUT BORDERS.</span>
          </motion.h2>
        </div>
      </div>

      {/* 2. Seamless Panning Roster Rail */}
      <div className="relative flex">
        <motion.div
          className="flex gap-1"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {allInfluencers.map((influencer, i) => (
            <div 
              key={`${influencer.id}-${i}`}
              className="group relative bg-void w-[350px] md:w-[450px] p-12 md:p-16 border border-white/5 hover:bg-white/[0.02] transition-colors duration-700 flex-shrink-0"
            >
              {/* Background Initial */}
              <div className="absolute top-4 right-8 text-white/[0.02] text-9xl font-black select-none group-hover:text-white/[0.05] transition-colors duration-700">
                {influencer.name[0]}
              </div>

              <div className="relative z-10 space-y-16">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] tracking-widest uppercase">
                      <Globe2 className="w-3 h-3 text-neon-blue" />
                      {influencer.region}
                    </div>
                    <h3 className="text-4xl font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                      {influencer.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors duration-500" />
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Subscriber Reach</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{influencer.subs}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Monthly Velocity</p>
                    <p className="text-sm font-medium text-white/70 leading-tight">{influencer.metric}</p>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between">
                  <span className="px-4 py-1.5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 group-hover:border-white/40 group-hover:text-white transition-all duration-500">
                    {influencer.focus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Global Summary Footer - Re-aligned */}
      <div className="container mx-auto px-6 max-w-6xl mt-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex items-baseline gap-8">
            <span className="text-8xl md:text-[12rem] font-black tracking-tighter text-white leading-none">100M+</span>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em] mb-4">
              Managed Reach
            </p>
          </div>
          
          <div className="max-w-xs text-right space-y-8">
            <p className="text-white/60 text-sm font-medium leading-relaxed uppercase">
              Consolidated distribution across primary gaming territories. One pipeline, absolute scale.
            </p>
            <button className="px-12 py-5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black hover:border-white transition-all duration-500">
              Initiate Distribution Audit
            </button>
          </div>
        </div>
      </div>

      {/* Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-void to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-void to-transparent z-20" />
    </section>
  );
}
