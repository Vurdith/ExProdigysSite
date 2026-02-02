"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  LogOut,
  Globe,
  BookOpen
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (session) {
        setAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
        setAuthenticated(false);
      } else if (session) {
        setAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authenticated) return null;

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Influencers", href: "/admin/influencers", icon: Users },
    { label: "Portfolio", href: "/admin/portfolio", icon: Gamepad2 },
    { label: "Market Stats", href: "/admin/stats", icon: BarChart3 },
    { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
    { label: "Site Content", href: "/admin/content", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-void text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-[90px] border border-white/5 bg-white/[0.02] opacity-70 rotate-2" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-neon-blue/20 via-neon-blue/10 to-transparent opacity-70" />
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-80 rounded-full bg-gradient-to-br from-neon-purple/20 via-neon-purple/10 to-transparent opacity-70" />
      <div className="relative flex">
        {/* Sidebar */}
        <aside className="w-64 md:w-72 border-r border-white/5 flex flex-col bg-white/[0.02] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent sticky top-0 h-screen">
          <div className="p-8 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-7 h-7 bg-white flex items-center justify-center">
                <div className="w-3 h-3 bg-black" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.35em] uppercase opacity-70 group-hover:opacity-100 transition-opacity block">
                  Burgundy
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/30 block">
                  Admin Control
                </span>
              </div>
            </Link>
          </div>

          <div className="px-5 pt-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 block">
              Admin Modules
            </span>
          </div>
          <nav className="flex-1 p-5 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all",
                    isActive
                      ? "bg-white text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-2 top-1/2 h-6 w-[3px] -translate-y-1/2 bg-black/60 rounded-full" />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-white/10">
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-y-auto">
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-white/[0.01] bg-gradient-to-r from-white/[0.04] via-white/[0.01] to-transparent">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30 block">
                Command Layer
              </span>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.45em] text-white/70">
                {navItems.find(i => i.href === pathname)?.label || "Admin"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-white/20 transition-colors"
              >
                <Globe className="w-3 h-3" />
                Public Site
              </Link>
            </div>
          </header>
          <div className="p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
              <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-6 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
