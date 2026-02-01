"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Youtube } from "lucide-react";
import { useRef } from "react";

interface Influencer {
  id: string;
  name: string;
  youtube_url?: string;
  avatar_url?: string;
  bio?: string;
  subs: string;
  metric: string;
  order_index: number;
}

export function InfluencerNetwork() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const { data, error } = await supabase
          .from("influencers")
          .select("*")
          .order("order_index", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setInfluencers(data);
        } else {
          throw new Error("No data found");
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching influencers:", err);
        }
        // Fallback to static data
        setInfluencers([
          { 
            id: "1", 
            name: "KreekCraft", 
            subs: "10M+", 
            metric: "250M+ Monthly Views", 
            bio: "The top destination for Roblox news, live events, and high-energy gameplay.",
            avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200", 
            order_index: 0 
          },
          { 
            id: "2", 
            name: "Flamingo", 
            subs: "12M+", 
            metric: "300M+ Monthly Views", 
            bio: "Pure chaos and comedy in the metaverse. One of the most influential voices in gaming.",
            avatar_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200",
            order_index: 1 
          },
          { 
            id: "3", 
            name: "LankyBox", 
            subs: "30M+", 
            metric: "1B+ Monthly Views", 
            bio: "Global phenomenon specializing in high-fidelity story-driven content and animation.",
            avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200&h=200",
            order_index: 2 
          },
          { 
            id: "4", 
            name: "Julia MineGirl", 
            subs: "9M+", 
            metric: "150M+ Monthly Views", 
            bio: "The leading voice for family-friendly adventures in the Latin American market.",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
            order_index: 3 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  if (loading) {
    return (
      <section className="py-48 bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  const allInfluencers = [...influencers, ...influencers];

  return (
    <section id="influencers" ref={containerRef} className="py-48 relative bg-void overflow-hidden">
      {/* 1. Massive Parallax Background Typography */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center">
        <motion.div 
          style={{ x: bgTextX }}
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
          className="flex gap-4"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {allInfluencers.map((influencer, i) => (
            <div 
              key={`${influencer.id}-${i}`}
              className="group relative bg-void w-[380px] md:w-[480px] p-10 md:p-14 border border-white/5 hover:bg-white/[0.02] transition-colors duration-700 flex-shrink-0"
            >
              <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-6">
                    {influencer.avatar_url && !failedAvatars[influencer.id] ? (
                      <img 
                        src={influencer.avatar_url} 
                        alt={influencer.name} 
                        className="w-16 h-16 rounded-full border-2 border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => {
                          setFailedAvatars((prev) => ({ ...prev, [influencer.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-xl font-black text-white/20 border-2 border-white/5">
                        {influencer.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-bold text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                        {influencer.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Youtube className="w-3 h-3 text-neon-blue" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Creator Node</span>
                      </div>
                    </div>
                  </div>
                  {influencer.youtube_url && (
                    <a href={influencer.youtube_url} target="_blank" rel="noopener noreferrer">
                      <ArrowUpRight className="w-5 h-5 text-white/20 hover:text-white transition-colors duration-500" />
                    </a>
                  )}
                </div>

                <p className="text-white/60 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                  {influencer.bio || "Active distribution node within the Burgundy Ventures network, specializing in high-fidelity metaverse experiences."}
                </p>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Aggregate Reach</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{influencer.subs}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total Videos</p>
                    <p className="text-sm font-medium text-white/70 leading-tight">{influencer.metric}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 3. Global Summary Footer */}
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
