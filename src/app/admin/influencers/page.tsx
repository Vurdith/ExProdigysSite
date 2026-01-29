"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface Influencer {
  id: string;
  name: string;
  region: string;
  subs: string;
  focus: string;
  metric: string;
  order_index: number;
}

export default function InfluencersAdmin() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Influencer>>({});

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) setInfluencers(data);
    setLoading(false);
  };

  const handleEdit = (influencer: Influencer) => {
    setIsEditing(influencer.id);
    setFormData(influencer);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (isEditing === "new") {
      const { error } = await supabase.from("influencers").insert([formData]);
      if (!error) fetchInfluencers();
    } else {
      const { error } = await supabase
        .from("influencers")
        .update(formData)
        .eq("id", isEditing);
      if (!error) fetchInfluencers();
    }
    setIsEditing(null);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this influencer?")) {
      const { error } = await supabase.from("influencers").delete().eq("id", id);
      if (!error) fetchInfluencers();
    }
  };

  const handleAddNew = () => {
    setIsEditing("new");
    setFormData({
      name: "",
      region: "GLOBAL",
      subs: "",
      focus: "",
      metric: "",
      order_index: influencers.length,
    });
  };

  if (loading) return <div>Loading nodes...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Influencer Nodes</h1>
          <p className="text-white/60 leading-relaxed">
            Manage the distribution network. Add new creators or update existing reach metrics.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Node
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isEditing === "new" && (
          <GlassCard className="p-8 border-neon-blue/20 bg-neon-blue/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Name</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Region</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  value={formData.region || ""}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subscribers</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  value={formData.subs || ""}
                  onChange={(e) => setFormData({ ...formData, subs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Focus</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  value={formData.focus || ""}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Metric (Views/mo)</label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
                  value={formData.metric || ""}
                  onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={handleCancel} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest">Save Node</button>
            </div>
          </GlassCard>
        )}

        {influencers.map((influencer) => (
          <GlassCard key={influencer.id} className="p-6 border-white/5 hover:border-white/10 transition-all">
            {isEditing === influencer.id ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <input
                    className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white"
                    value={formData.region || ""}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  />
                  <input
                    className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white"
                    value={formData.subs || ""}
                    onChange={(e) => setFormData({ ...formData, subs: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={handleCancel} className="p-2 text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                  <button onClick={handleSave} className="p-2 text-green-500 hover:text-green-400"><Save className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-lg font-black text-white/20">
                    {influencer.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{influencer.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{influencer.region} // {influencer.focus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{influencer.subs}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Subs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(influencer)} className="p-2 text-white/20 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(influencer.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
