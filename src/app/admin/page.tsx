"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Gamepad2, BarChart3, Settings, Save } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function AdminDashboard() {
  const defaultMetrics = [
    { label: "Games Created", value: "20+" },
    { label: "Influencer Partners", value: "40+" },
    { label: "Games Worked With", value: "60+" },
    { label: "Companies Worked With", value: "50+" },
  ];
  const [heroMetrics, setHeroMetrics] = useState(defaultMetrics);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [metricsStatus, setMetricsStatus] = useState<string | null>(null);

  const stats = [
    { label: "Total Influencers", value: "5", icon: Users, href: "/admin/influencers" },
    { label: "Portfolio Items", value: "4", icon: Gamepad2, href: "/admin/portfolio" },
    { label: "Market Stats", value: "9", icon: BarChart3, href: "/admin/stats" },
    { label: "Global Settings", value: "Active", icon: Settings, href: "/admin/content" },
  ];

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch("/api/admin/content");
        const result = await response.json();
        if (!response.ok || result.error || !result.data) return;

        const map = new Map<string, string>(
          result.data.map((row: { key: string; value: string }) => [row.key, row.value])
        );
        const next = [
          {
            label: map.get("hero_metric_1_label") || defaultMetrics[0].label,
            value: map.get("hero_metric_1_value") || defaultMetrics[0].value,
          },
          {
            label: map.get("hero_metric_2_label") || defaultMetrics[1].label,
            value: map.get("hero_metric_2_value") || defaultMetrics[1].value,
          },
          {
            label: map.get("hero_metric_3_label") || defaultMetrics[2].label,
            value: map.get("hero_metric_3_value") || defaultMetrics[2].value,
          },
          {
            label: map.get("hero_metric_4_label") || defaultMetrics[3].label,
            value: map.get("hero_metric_4_value") || defaultMetrics[3].value,
          },
        ];
        setHeroMetrics(next);
      } catch {
        // keep defaults
      }
    };

    loadMetrics();
  }, []);

  const handleMetricChange = (index: number, field: "label" | "value", value: string) => {
    setHeroMetrics((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveMetrics = async () => {
    setSavingMetrics(true);
    setMetricsStatus(null);
    try {
      const items = [
        { key: "hero_metric_1_label", value: heroMetrics[0]?.label || "" },
        { key: "hero_metric_1_value", value: heroMetrics[0]?.value || "" },
        { key: "hero_metric_2_label", value: heroMetrics[1]?.label || "" },
        { key: "hero_metric_2_value", value: heroMetrics[1]?.value || "" },
        { key: "hero_metric_3_label", value: heroMetrics[2]?.label || "" },
        { key: "hero_metric_3_value", value: heroMetrics[2]?.value || "" },
        { key: "hero_metric_4_label", value: heroMetrics[3]?.label || "" },
        { key: "hero_metric_4_value", value: heroMetrics[3]?.value || "" },
      ];
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to save.");
      }
      setMetricsStatus("Hero metrics saved.");
    } catch (error: any) {
      setMetricsStatus(error.message || "Failed to save.");
    } finally {
      setSavingMetrics(false);
      setTimeout(() => setMetricsStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 block mb-4">
          Admin Overview
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Command Center
        </h1>
        <p className="text-white/60 leading-relaxed">
          Manage your digital artifacts, influencer nodes, and market validation data in real-time. 
          Changes made here will reflect instantly on the public portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <GlassCard className="p-8 hover:border-white/20 transition-all cursor-pointer border-white/10 bg-white/[0.03] shadow-[0_0_60px_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </GlassCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-10 border-white/10 bg-white/[0.03]">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { action: "Updated Influencer", target: "LankyBox", time: "2 mins ago" },
              { action: "New Portfolio Item", target: "GrowROT", time: "1 hour ago" },
              { action: "Modified Stat", target: "Daily Active Users", time: "3 hours ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-bold text-white">{item.action}</p>
                  <p className="text-xs text-white/40">{item.target}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-10 border-white/10 bg-white/[0.03]">
          <h3 className="text-xl font-bold mb-6">System Status</h3>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Database Connection</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Stable</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Storage Bucket</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Auth Service</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Secure</span>
            </div>
            <div className="pt-4">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-full bg-white/20" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-4">
                All systems operational // 2026.01.23
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-10 border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
              Hero Metrics
            </p>
            <h3 className="text-2xl font-bold text-white mt-2">Homepage Stats Grid</h3>
          </div>
          <MagneticButton
            className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em]"
            onClick={handleSaveMetrics}
            variant="primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {savingMetrics ? "Saving..." : "Save Metrics"}
          </MagneticButton>
        </div>
        {metricsStatus && (
          <div className="mb-6 border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/70 rounded-2xl">
            {metricsStatus}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroMetrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`} className="border border-white/10 bg-white/[0.02] p-6">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-3">
                Metric {index + 1}
              </label>
              <div className="space-y-4">
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                  placeholder="Label"
                  value={metric.label}
                  onChange={(e) => handleMetricChange(index, "label", e.target.value)}
                />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                  placeholder="Value"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, "value", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
