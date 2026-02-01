"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3, Users, Clock, TrendingUp, Wallet, CheckCircle2, ChevronDown } from "lucide-react";

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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching stats:", err);
        }
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
    <section id="stats" className="py-36 relative bg-void overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_55%)] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="flex flex-col items-center text-center mb-24">
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

        <div className="space-y-8">
          {categories.map((category) => {
            const categoryStats = stats.filter((s) => s.category === category);
            const isOpen = expandedCategory === category;
            const preview = categoryStats.slice(0, 2);
            return (
              <div
                key={category}
                className="border border-white/10 bg-white/[0.02] bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent rounded-3xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCategory(isOpen ? null : category)}
                  className="w-full text-left px-8 py-6 relative"
                >
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <BarChart3 className="w-5 h-5 text-white/70" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{category}</h3>
                        <p className="text-white/60 text-sm">
                          {categoryStats.length} data points
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-8 pb-8 border-t border-white/10 bg-white/[0.01]">
                    <div className="divide-y divide-white/10">
                      {categoryStats.map((item) => {
                        const Icon = iconMap[item.icon_name] || BarChart3;
                        return (
                          <div key={item.id} className="py-6 flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.is_highlighted ? "bg-neon-blue/10 text-neon-blue" : "bg-white/5 text-white/60"}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                                  {item.label}
                                </p>
                                <p className="text-white/70 text-sm mt-2">
                                  {item.detail}
                                </p>
                              </div>
                            </div>
                            <div className="md:ml-auto">
                              <span
                                className={`inline-flex items-center rounded-full px-4 py-2 text-lg md:text-xl font-semibold tracking-tight ${
                                  item.is_highlighted
                                    ? "bg-neon-blue/15 text-white shadow-[0_10px_30px_rgba(88,101,242,0.25)]"
                                    : "bg-white/10 text-white/90"
                                }`}
                              >
                                {item.value}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Brand Ecosystem */}
        <div className="mt-48 pt-24 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                450+ Major Global <br /> <span className="text-white/40 italic font-light">Brands Activated.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-12">
                From high-fashion to automotive, the world's leading brands are 
                leveraging persistent worlds and pop-up integrations to capture attention.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {brands.map((brand) => (
                  <span key={brand} className="px-4 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60 bg-white/[0.02]">
                    {brand}
                  </span>
                ))}
              </div>
              <button
                onClick={() => window.dispatchEvent(new Event("open-schedule-modal"))}
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-7 py-3.5 text-sm font-semibold shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:bg-neon-blue hover:text-black transition-colors"
              >
                Be the next brand
              </button>
            </div>
            
            <GlassCard className="p-12 relative overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
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
