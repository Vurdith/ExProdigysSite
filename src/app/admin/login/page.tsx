"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <main className="min-h-screen bg-void flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <span className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-4">
            System Access
          </span>
          <h1 className="text-4xl font-bold tracking-tighter text-white">
            Admin <span className="text-white/20 italic font-light">Portal.</span>
          </h1>
        </div>

        <GlassCard className="border-white/10 shadow-glow">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="admin@burgundy.ventures"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Security Key
              </label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <MagneticButton
              className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-none mt-4"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Authorize Access"}
            </MagneticButton>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
