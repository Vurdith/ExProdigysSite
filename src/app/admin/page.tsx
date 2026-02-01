"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Gamepad2, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Influencers", value: "5", icon: Users, href: "/admin/influencers" },
    { label: "Portfolio Items", value: "4", icon: Gamepad2, href: "/admin/portfolio" },
    { label: "Market Stats", value: "9", icon: BarChart3, href: "/admin/stats" },
    { label: "Global Settings", value: "Active", icon: Settings, href: "/admin/content" },
  ];

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
    </div>
  );
}
