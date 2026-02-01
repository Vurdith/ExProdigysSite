"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, Trash2, Edit2, Save, X, Youtube, Loader2, Link as LinkIcon } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

interface Influencer {
  id: string;
  name: string;
  youtube_url: string;
  avatar_url: string;
  bio: string;
  subs: string;
  metric: string;
  order_index: number;
}

export default function InfluencersAdmin() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Influencer>>({});
  const [fetchingYT, setFetchingYT] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "info" | "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    // window.alert("ADMIN PAGE LOADED");
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const { data, error } = await supabase
        .from("influencers")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (data) setInfluencers(data);
    } catch (error: any) {
      console.error("Fetch influencers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (influencer: Influencer) => {
    setIsEditing(influencer.id);
    setFormData(influencer);
    setSaveStatus({
      type: "info",
      message: `Editing node: ${influencer.name}`,
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
    setSaveStatus(null);
  };

  const handleSave = async (e?: React.MouseEvent) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSaveStatus({
        type: "error",
        message: "You must be logged in to save changes.",
      });
      return;
    }

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!formData.name || !formData.subs || !formData.metric) {
      setSaveStatus({
        type: "error",
        message: "Please fill in Name, Subscribers, and Metric.",
      });
      return;
    }

    if (!isEditing) {
      setSaveStatus({
        type: "error",
        message: "No node selected for saving.",
      });
      return;
    }

    setSaveStatus({ type: "info", message: "Saving creator node..." });
    setSaving(true);
    
    try {
      const { id, created_at, ...payload } = formData as any;
      
      if (payload.order_index !== undefined) {
        payload.order_index = parseInt(String(payload.order_index)) || 0;
      }

      const response = await fetch("/api/admin/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isEditing === "new" ? null : isEditing,
          payload,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : { error: "Server returned non-JSON response. Check SUPABASE_SERVICE_ROLE_KEY and restart dev server." };

      if (!response.ok || result.error) {
        setSaveStatus({ type: "error", message: result.error || "Save failed." });
        throw new Error(result.error || "Save failed.");
      }
      if (!result.data || result.data.length === 0) {
        setSaveStatus({
          type: "info",
          message: "Save sent. Refreshing list...",
        });
      }

      // Verify the update actually persisted for edit flow.
      if (isEditing !== "new") {
        const { data: verifyData, error: verifyError } = await supabase
          .from("influencers")
          .select("*")
          .eq("id", isEditing)
          .maybeSingle();

        if (verifyError) {
          throw new Error(`Verification failed: ${verifyError.message}`);
        }
        if (!verifyData) {
          throw new Error("Verification failed: updated row not found.");
        }
        if (
          verifyData.name !== payload.name ||
          verifyData.subs !== payload.subs ||
          verifyData.metric !== payload.metric
        ) {
          throw new Error("Update did not persist. Check permissions or RLS.");
        }
      }

      await fetchInfluencers();
      setIsEditing(null);
      setFormData({});
      setSaveStatus({ type: "success", message: "Saved successfully!" });
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (error: any) {
      console.error("Save error:", error);
      setSaveStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this influencer?")) {
      const response = await fetch("/api/admin/influencers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : { error: "Server returned non-JSON response. Check SUPABASE_SERVICE_ROLE_KEY and restart dev server." };
      if (response.ok && !result.error) {
        fetchInfluencers();
      } else {
        setSaveStatus({
          type: "error",
          message: result.error || "Delete failed.",
        });
      }
    }
  };

  const handleAddNew = () => {
    setIsEditing("new");
    setFormData({
      name: "",
      youtube_url: "",
      avatar_url: "",
      bio: "",
      subs: "",
      metric: "",
      order_index: influencers.length,
    });
    setSaveStatus(null);
  };

  const fetchYouTubeData = async () => {
    if (!formData.youtube_url) {
      alert("Please enter a YouTube URL or handle first.");
      return;
    }

    setFetchingYT(true);
    try {
      const response = await fetch(`/api/youtube?url=${encodeURIComponent(formData.youtube_url)}`);
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setFormData({
          ...formData,
          name: data.title,
          subs: data.subscriberCount,
          bio: data.description,
          avatar_url: data.avatarUrl,
          metric:
            data.viewCount && data.viewCount !== "N/A"
              ? `Total Views: ${data.viewCount}`
              : data.videoCount && data.videoCount !== "N/A"
              ? `Total Videos: ${data.videoCount}`
              : "Total Views: N/A",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch data from YouTube.");
    } finally {
      setFetchingYT(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-white/40">Loading nodes...</div>;

  return (
    <div className="space-y-12 pb-24">
      {saveStatus && (
        <div
          className={`border px-5 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl ${
            saveStatus.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-300"
              : saveStatus.type === "error"
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-white/10 bg-white/5 text-white/60"
          }`}
        >
          {saveStatus.message}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 block mb-4">
            Creator Network
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Influencer Nodes</h1>
          <p className="text-white/60 leading-relaxed">
            Manage the distribution network. Use the YouTube sync feature to automatically populate creator metadata.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Node
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isEditing && (
          <div className="p-10 border border-white/10 bg-white/[0.03] rounded-3xl shadow-[0_0_80px_rgba(88,101,242,0.12)] relative overflow-hidden">
            <div className="pointer-events-none absolute -inset-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rotate-1" />
            <div className="pointer-events-none absolute right-8 top-8 h-20 w-20 rounded-full bg-gradient-to-br from-neon-blue/30 via-neon-blue/10 to-transparent opacity-80" />
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="w-12 h-12 bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                {isEditing === "new" ? <Plus className="w-6 h-6" /> : <Edit2 className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{isEditing === "new" ? "New Creator Node" : "Edit Creator Node"}</h2>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Sync with YouTube for automatic metadata</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* YouTube Sync Field */}
              <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">YouTube URL / Handle</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      placeholder="e.g. youtube.com/@KreekCraft"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
                      value={formData.youtube_url || ""}
                      onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={fetchYouTubeData}
                    disabled={fetchingYT}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {fetchingYT ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {fetchingYT ? "Syncing..." : "Sync Metadata"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Display Name</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subscribers (Fetched)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.subs || ""}
                    onChange={(e) => setFormData({ ...formData, subs: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Metric (e.g. 250M+ Monthly Views)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.metric || ""}
                    onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Avatar URL (Fetched)</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50"
                    value={formData.avatar_url || ""}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Bio / About (Fetched)</label>
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 resize-none"
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

          {saveStatus && (
            <div
              className={`mt-6 border px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl ${
                saveStatus.type === "success"
                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                  : saveStatus.type === "error"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              {saveStatus.message}
            </div>
          )}

            <div className="flex justify-end gap-6 mt-12 pt-8 border-t border-white/5 relative z-10">
              <button 
                onClick={handleCancel} 
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Discard Changes
              </button>
              <button 
                type="button"
                onClick={handleSave} 
                disabled={saving}
                className="bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-neon-blue transition-colors disabled:opacity-50"
              >
                {saving ? "SAVING DB..." : "SAVE CREATOR NODE"}
              </button>
            </div>
          </div>
        )}

        {influencers.map((influencer) => (
          <GlassCard key={influencer.id} className={`p-6 border-white/10 bg-white/[0.02] hover:border-white/20 transition-all ${isEditing === influencer.id ? "opacity-30 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {influencer.avatar_url && !failedAvatars[influencer.id] ? (
                  <img
                    src={influencer.avatar_url}
                    alt={influencer.name}
                    className="w-14 h-14 rounded-full border border-white/10"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => {
                      setFailedAvatars((prev) => ({ ...prev, [influencer.id]: true }));
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-xl font-black text-white/20">
                    {influencer.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{influencer.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{influencer.subs} Reach</p>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{influencer.metric}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                {influencer.youtube_url && (
                  <a href={influencer.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/20 hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
                <div className="flex items-center gap-2 border-l border-white/5 pl-8">
                  <button
                    type="button"
                    aria-label={`Edit ${influencer.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(influencer);
                    }}
                    className="relative z-20 pointer-events-auto p-2 text-white/20 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${influencer.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(influencer.id);
                    }}
                    className="relative z-20 pointer-events-auto p-2 text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
