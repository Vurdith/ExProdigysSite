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
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "founder_quote")
        .single();

      if (data) setQuote(data.value);
      setLoading(false);
    };

    fetchContent();
  }, []);

  const defaultQuote = "We don't just build games; we architect digital legacies. Every project we take on is a partnership built on transparency and radical results.";

  return (
    <section id="about" className="relative z-20 py-24 bg-void">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Humanizing the Brand - Founder's Note */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden border border-white/20">
                   {/* Placeholder for real team photo */}
                   <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Burgundy Ventures</h4>
                  <p className="text-white/70 text-xs uppercase tracking-widest">Executive Team</p>
                </div>
              </div>
              <p className="text-xl italic text-white/90 leading-relaxed mb-8">
                "{quote || (loading ? "..." : defaultQuote)}"
              </p>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-neon-blue text-lg">★</span>
                ))}
                <span className="ml-4 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  Top-Rated Agency 2026
                </span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Risk Reversal / Friction Removal */}
          <div className="space-y-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] block"
            >
              Why Partner With Us
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Removing the <br /> <span className="text-white/40 italic font-light">Fear of Failure.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "Cancel Anytime", desc: "No long-term lock-ins until you see value." },
                { title: "Risk-Free Trial", desc: "Prototype phase with money-back guarantee." },
                { title: "Real-Time Comms", desc: "Direct access to lead developers 24/7." },
                { title: "Fixed Pricing", desc: "No hidden fees or scope-creep surprises." }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h5 className="font-bold text-white mb-2 text-sm uppercase tracking-widest">{item.title}</h5>
                  <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
