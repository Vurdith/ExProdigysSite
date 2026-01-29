"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, Edit2, Save, X, BarChart3 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

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

export default function StatsAdmin() {
  const [stats, setStats] = useState<MarketStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MarketStat>>({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("market_stats")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) setStats(data);
    setLoading(false);
  };

  const handleEdit = (stat: MarketStat) => {
    setIsEditing(stat.id);
    setFormData(stat);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.label || !formData.value) {
      alert("Please fill in the required fields: Label and Value.");
      return;
    }

    try {
      const { id, created_at, ...cleanData } = formData as any;
      
      if (isEditing === "new") {
        const { error } = await supabase.from("market_stats").insert([cleanData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("market_stats")
          .update(cleanData)
          .eq("id", isEditing);
        if (error) throw error;
      }
      
      await fetchStats();
      setIsEditing(null);
      setFormData({});
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this stat?")) {
      const { error } = await supabase.from("market_stats").delete().eq("id", id);
      if (!error) fetchStats();
    }
  };

  const handleAddNew = () => {
    setIsEditing("new");
    setFormData({
      category: "Scale & Reach",
      label: "",
      value: "",
      detail: "",
      icon_name: "BarChart3",
      is_highlighted: false,
      order_index: stats.length,
    });
  };

  if (loading) return <div>Loading validation data...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Market Validation</h1>
          <p className="text-white/60 leading-relaxed">
            Manage the high-impact statistics that validate the Roblox economy. 
            Update DAU, bookings, and demographic shifts.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" />
          Inject New Metric
        </MagneticButton>
      </div>

      <div className="space-y-16">
        {["Scale & Reach", "Demographics", "The Digital Economy"].map((category) => (
          <div key={category} className="space-y-8">
            <div className="flex items-center gap-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">{category}</h2>
              <div className="h-[1px] w-full bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.filter(s => s.category === category).map((stat) => (
                <GlassCard 
                  key={stat.id} 
                  className={stat.is_highlighted ? "border-neon-blue/20 bg-neon-blue/5" : "border-white/5"}
                >
                  {isEditing === stat.id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                        placeholder="Label"
                        value={formData.label || ""}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      />
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-lg font-bold"
                        placeholder="Value"
                        value={formData.value || ""}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs"
                        placeholder="Detail"
                        value={formData.detail || ""}
                        onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                      />
                      <div className="flex justify-between items-center pt-4">
                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <input
                            type="checkbox"
                            checked={formData.is_highlighted || false}
                            onChange={(e) => setFormData({ ...formData, is_highlighted: e.target.checked })}
                          />
                          Highlight
                        </label>
                        <div className="flex gap-2">
                          <button onClick={handleCancel} className="p-2 text-white/40"><X className="w-4 h-4" /></button>
                          <button onClick={handleSave} className="p-2 text-green-500"><Save className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between h-full">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</p>
                          <BarChart3 className={`w-4 h-4 ${stat.is_highlighted ? "text-neon-blue" : "text-white/20"}`} />
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        <p className="text-xs text-white/60">{stat.detail}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-8">
                        <button onClick={() => handleEdit(stat)} className="p-2 text-white/20 hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(stat.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </GlassCard>
              ))}
              
              {isEditing === "new" && formData.category === category && (
                <GlassCard className="border-dashed border-white/20 bg-white/[0.02]">
                  <div className="space-y-4">
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm"
                      placeholder="New Label"
                      autoFocus
                      value={formData.label || ""}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-lg font-bold"
                      placeholder="Value"
                      value={formData.value || ""}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                    <div className="flex justify-end gap-4 pt-4">
                      <button onClick={handleCancel} className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cancel</button>
                      <button onClick={handleSave} className="text-[10px] font-bold uppercase tracking-widest text-neon-blue">Inject</button>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
