"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3, Users, Clock, TrendingUp, Wallet, CheckCircle2 } from "lucide-react";

interface MarketStat {
  id: string;
  category: string;
  label: string;
  value: string;
  detail: string;
  icon_name: string;
  is_highlighted: boolean;
  order_index: number;
}

const iconMap: Record<string, any> = {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Wallet,
  CheckCircle2,
};

export function MarketStats() {
  const [stats, setStats] = useState<MarketStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("market_stats")
          .select("*")
          .order("order_index", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setStats(data);
        } else {
          throw new Error("No data found");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback to static data
        setStats([
          { id: "1", category: "Scale & Reach", label: "Daily Active Users", value: "88.9M", detail: "Q3 2024 Average", icon_name: "Users", is_highlighted: true, order_index: 0 },
          { id: "2", category: "Scale & Reach", label: "Monthly Engagement", value: "20.7B", detail: "Hours Spent in Q3", icon_name: "Clock", is_highlighted: false, order_index: 1 },
          { id: "3", category: "Scale & Reach", label: "Monthly Active Users", value: "380M+", detail: "Estimated Global Reach", icon_name: "TrendingUp", is_highlighted: false, order_index: 2 },
          { id: "4", category: "Demographics", label: "Users Over 13", value: "58%", detail: "Mature Audience Shift", icon_name: "Users", is_highlighted: false, order_index: 3 },
          { id: "5", category: "Demographics", label: "Fastest Growing", value: "17-24", detail: "Age Demographic", icon_name: "TrendingUp", is_highlighted: true, order_index: 4 },
          { id: "6", category: "Demographics", label: "Gender Split", value: "Near Even", detail: "Inclusive Market", icon_name: "Users", is_highlighted: false, order_index: 5 },
          { id: "7", category: "The Digital Economy", label: "Quarterly Bookings", value: "$1.13B", detail: "34% YoY Growth", icon_name: "Wallet", is_highlighted: true, order_index: 6 },
          { id: "8", category: "The Digital Economy", label: "Creator Payouts", value: "$800M+", detail: "Trailing 12 Months", icon_name: "CheckCircle2", is_highlighted: false, order_index: 7 },
          { id: "9", category: "The Digital Economy", label: "Daily Avatar Updates", value: "1.6B", detail: "Digital Identity Focus", icon_name: "TrendingUp", is_highlighted: false, order_index: 8 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  const categories = ["Scale & Reach", "Demographics", "The Digital Economy"];
  const brands = ["Fashion & Apparel", "Beauty & Cosmetics", "Automotive", "Entertainment", "Food & Beverage", "Retail & Tech"];

  return (
    <section id="stats" className="py-32 relative bg-void overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] block mb-6"
          >
            Market Validation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            The Metaverse is Here <br /> 
            <span className="text-white/40 font-light italic">& It's Profitable.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl leading-relaxed"
          >
            Roblox is no longer just a game; it's a massive, aging-up social utility 
            with an economy that rivals small nations.
          </motion.p>
        </div>

        <div className="space-y-32">
          {categories.map((category) => (
            <div key={category} className="space-y-12">
              <div className="flex items-center gap-8">
                <h3 className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs whitespace-nowrap">
                  {category}
                </h3>
                <div className="h-[1px] w-full bg-white/10" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.filter(s => s.category === category).map((item) => {
                  const Icon = iconMap[item.icon_name] || BarChart3;
                  return (
                    <GlassCard 
                      key={item.id} 
                      className={item.is_highlighted ? "border-neon-blue/20" : ""}
                    >
                      <div className="space-y-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.is_highlighted ? "bg-neon-blue/10 text-neon-blue" : "bg-white/5 text-white/60"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">{item.label}</p>
                          <h4 className="text-4xl font-bold text-white mb-2">{item.value}</h4>
                          <p className="text-white/40 text-xs font-medium">{item.detail}</p>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Brand Ecosystem */}
        <div className="mt-48 pt-24 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-white/60 font-bold uppercase tracking-[0.4em] text-[10px] block mb-10">
                Brand Integration
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                450+ Major Global <br /> <span className="text-white/40 italic font-light">Brands Activated.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-12">
                From high-fashion to automotive, the world's leading brands are 
                leveraging persistent worlds and pop-up integrations to capture attention.
              </p>
              <div className="flex flex-wrap gap-4">
                {brands.map((brand) => (
                  <span key={brand} className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            
            <GlassCard className="p-12 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">The Attention Economy</span>
                  <BarChart3 className="text-neon-blue w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white">Capture Active Engagement</h3>
                <p className="text-white/70 italic leading-relaxed">
                  "For every 1 hour a user spends on YouTube, they spend nearly 2 hours on Roblox."
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
                      <span>Roblox</span>
                      <span>130 min/day</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-white" 
                        initial={{ width: 0 }} 
                        whileInView={{ width: "100%" }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>TikTok</span>
                      <span>112 min/day</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-white/40" 
                        initial={{ width: 0 }} 
                        whileInView={{ width: "86%" }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>YouTube</span>
                      <span>70 min/day</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-white/20" 
                        initial={{ width: 0 }} 
                        whileInView={{ width: "54%" }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
