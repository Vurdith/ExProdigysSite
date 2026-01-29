"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";

interface PortfolioGame {
  id: string;
  title: string;
  description: string;
  image_url: string;
  stats: string;
  order_index: number;
}

export default function PortfolioAdmin() {
  const [games, setGames] = useState<PortfolioGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioGame>>({});

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from("portfolio_games")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) setGames(data);
    setLoading(false);
  };

  const handleEdit = (game: PortfolioGame) => {
    setIsEditing(game.id);
    setFormData(game);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.stats) {
      alert("Please fill in the required fields: Title, Description, and Stats.");
      return;
    }

    try {
      const { id, created_at, ...cleanData } = formData as any;
      
      if (isEditing === "new") {
        const { error } = await supabase.from("portfolio_games").insert([cleanData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("portfolio_games")
          .update(cleanData)
          .eq("id", isEditing);
        if (error) throw error;
      }
      
      await fetchGames();
      setIsEditing(null);
      setFormData({});
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message || "Unknown error"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this artifact?")) {
      const { error } = await supabase.from("portfolio_games").delete().eq("id", id);
      if (!error) fetchGames();
    }
  };

  const handleAddNew = () => {
    setIsEditing("new");
    setFormData({
      title: "",
      description: "",
      image_url: "/images/hero-1.png",
      stats: "",
      order_index: games.length,
    });
  };

  if (loading) return <div>Loading artifacts...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Portfolio Artifacts</h1>
          <p className="text-white/60 leading-relaxed">
            Manage your high-performance virtual worlds. Update case studies and peak engagement metrics.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-none"
        >
          <Plus className="w-4 h-4 mr-2" />
          Archive New Artifact
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isEditing === "new" && (
          <GlassCard className="p-10 border-neon-blue/20 bg-neon-blue/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Title</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue resize-none"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Stats (e.g. 1M+ Peak CCU)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
                    value={formData.stats || ""}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Image URL</label>
                  <div className="flex gap-4">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue"
                      value={formData.image_url || ""}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                    <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center border border-white/10">
                      <ImageIcon className="w-5 h-5 text-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-white/5">
              <button onClick={handleCancel} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-white text-black px-10 py-3 text-[10px] font-black uppercase tracking-widest">Save Artifact</button>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <GlassCard key={game.id} className="group relative aspect-[16/10] overflow-hidden p-0 border-white/5 hover:border-white/10 transition-all">
              <Image
                src={game.image_url}
                alt={game.title}
                fill
                className="object-cover opacity-20 grayscale group-hover:opacity-40 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent p-10 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neon-blue mb-2">{game.stats}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-sm text-white/40 line-clamp-2 max-w-xs">{game.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(game)} className="p-3 rounded-full bg-white/5 text-white/40 hover:bg-white hover:text-black transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(game.id)} className="p-3 rounded-full bg-white/5 text-white/40 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
