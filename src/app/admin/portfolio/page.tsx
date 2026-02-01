"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Image from "next/image";
import { formatPlayerCount } from "@/lib/roblox";

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
  const [robloxUrl, setRobloxUrl] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

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
    setRobloxUrl("");
    setSyncStatus(`Editing: ${game.title}`);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
    setRobloxUrl("");
    setSyncStatus(null);
  };

  const savePortfolioPayload = async (payload: Partial<PortfolioGame>, id: string | null) => {
    const response = await fetch("/api/admin/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        payload,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? await response.json()
      : { error: "Server returned non-JSON response. Check SUPABASE_SERVICE_ROLE_KEY and restart dev server." };

    if (!response.ok || result.error) {
      throw new Error(result.error || "Failed to save.");
    }

    return (result.data?.[0] as PortfolioGame | undefined) || null;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.stats) {
      alert("Please fill in the required fields: Title, Description, and Stats.");
      return;
    }

    try {
      const { id, created_at, ...cleanData } = formData as any;

      const saved = await savePortfolioPayload(cleanData, isEditing === "new" ? null : isEditing);
      
      await fetchGames();
      setIsEditing(saved?.id || null);
      setFormData({});
      setSyncStatus("Saved successfully.");
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (error: any) {
      console.error("Save error:", error);
      setSyncStatus(error.message || "Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this artifact?")) {
      const response = await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : { error: "Server returned non-JSON response. Check SUPABASE_SERVICE_ROLE_KEY and restart dev server." };

      if (response.ok && !result.error) {
        fetchGames();
      } else {
        setSyncStatus(result.error || "Delete failed.");
      }
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
    setRobloxUrl("");
    setSyncStatus(null);
  };

  const truncateDescription = (text: string, maxLength = 240) => {
    const cleaned = text.trim();
    if (cleaned.length <= maxLength) return cleaned;
    return `${cleaned.slice(0, maxLength).trim()}…`;
  };

  const handleRobloxSync = async () => {
    if (!robloxUrl) {
      setSyncStatus("Please paste a Roblox game URL first.");
      return;
    }

    setSyncing(true);
    setSyncStatus("Fetching Roblox metadata...");

    try {
      const response = await fetch("/api/roblox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: robloxUrl }),
      });
      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to fetch Roblox metadata.");
      }

      const nextFormData = {
        ...formData,
        title: result.title || formData.title,
        description: truncateDescription(result.description || formData.description || ""),
        image_url: result.imageUrl || formData.image_url,
        stats: formatPlayerCount(result.currentPlayers ?? null),
      };
      setFormData(nextFormData);

      setSyncStatus("Roblox metadata synced.");

      // Auto-save to persist the synced fields for existing or new entries.
      if (isEditing) {
        const saved = await savePortfolioPayload(
          {
            title: nextFormData.title || "",
            description: nextFormData.description || "",
            image_url: nextFormData.image_url || "",
            stats: nextFormData.stats || "",
            order_index: nextFormData.order_index ?? 0,
          },
          isEditing === "new" ? null : isEditing
        );
        await fetchGames();
        setIsEditing(saved?.id || null);
        setSyncStatus("Roblox metadata synced and saved.");
      }
    } catch (error: any) {
      setSyncStatus(error.message || "Failed to fetch Roblox metadata.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div>Loading artifacts...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 block mb-4">
            Portfolio Control
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Portfolio Artifacts</h1>
          <p className="text-white/60 leading-relaxed">
            Manage your high-performance virtual worlds. Update case studies and peak engagement metrics.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Archive New Artifact
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isEditing && (
          <GlassCard className="p-10 border-white/10 bg-white/[0.03] shadow-[0_0_80px_rgba(88,101,242,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Roblox Game URL</label>
                  <div className="flex gap-4">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                      placeholder="https://www.roblox.com/games/123456789/Game-Name"
                      value={robloxUrl}
                      onChange={(e) => setRobloxUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleRobloxSync}
                      disabled={syncing}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {syncing ? "Syncing..." : "Sync Roblox"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Title</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Description</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 resize-none"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Stats (e.g. 1M+ Peak CCU)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.stats || ""}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Image URL</label>
                  <div className="flex gap-4">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
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
            {syncStatus && (
              <div className="mt-6 border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/70 rounded-2xl">
                {syncStatus}
              </div>
            )}
            <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-white/5">
              <button onClick={handleCancel} className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSave} className="bg-white text-black px-10 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl">Save Artifact</button>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all"
            >
              <Image
                src={game.image_url}
                alt={game.title}
                fill
                className="object-cover opacity-30 grayscale group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute right-6 top-6 flex gap-2">
                <button
                  onClick={() => handleEdit(game)}
                  className="p-3 rounded-full bg-black/40 border border-white/10 text-white/70 hover:bg-white hover:text-black transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="p-3 rounded-full bg-black/40 border border-white/10 text-white/70 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent p-10 flex flex-col justify-end">
                <div className="pr-16">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neon-blue mb-2">{game.stats}</p>
                  <h3 className="text-3xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-sm text-white/40 line-clamp-2 max-w-xs">{game.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
