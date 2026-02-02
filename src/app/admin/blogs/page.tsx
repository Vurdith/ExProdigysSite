"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Plus, Edit2, Trash2, Save, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  image_url: string;
  order_index: number;
}

export default function BlogsAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      const result = await response.json();
      if (response.ok && result.data) {
        setPosts(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setIsEditing(post.id);
    setFormData(post);
    setSaveStatus(`Editing: ${post.title}`);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({});
    setSaveStatus(null);
  };

  const handleAddNew = () => {
    setIsEditing("new");
    setFormData({
      title: "",
      image_url: "",
      order_index: posts.length,
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      setSaveStatus("Title and image are required.");
      return;
    }

    const payload = {
      title: formData.title,
      image_url: formData.image_url,
      order_index: formData.order_index ?? posts.length,
    };

    const response = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: isEditing === "new" ? undefined : isEditing,
        payload,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      setSaveStatus(result?.error || "Failed to save.");
      return;
    }

    await fetchPosts();
    setIsEditing(null);
    setFormData({});
    setSaveStatus("Saved.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const response = await fetch("/api/admin/blogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      fetchPosts();
    }
  };

  if (loading) return <div>Loading blog posts...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50 block mb-4">
            Editorial Studio
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog Posts</h1>
          <p className="text-white/60 leading-relaxed">
            Create and manage visually striking blog entries for your public blog page.
          </p>
        </div>
        <MagneticButton
          onClick={handleAddNew}
          className="bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </MagneticButton>
      </div>

      {isEditing && (
        <GlassCard className="p-8 border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl border border-white/10 bg-white/[0.06] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Blog Entry</h3>
                <p className="text-white/50 text-sm">Image + title layout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <MagneticButton
                onClick={handleSave}
                className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Post
              </MagneticButton>
            </div>
          </div>

          {saveStatus && (
            <div className="mb-6 border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white/70 rounded-2xl">
              {saveStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
                placeholder="Launch insight or market trend..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url || ""}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: Number(e.target.value) })
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] h-48 flex items-center justify-center">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="text-white/40 text-sm">Image preview</div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <GlassCard
            key={post.id}
            className="p-6 border-white/10 bg-white/[0.03] hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-white/50 mt-1">Order: {post.order_index}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-white/30 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
