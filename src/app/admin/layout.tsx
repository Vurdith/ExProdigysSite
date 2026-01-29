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
  Globe
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
    { label: "Site Content", href: "/admin/content", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-void flex text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-black" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
              Burgundy
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
                pathname === item.href 
                  ? "bg-white text-black" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-xs font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">
            {navItems.find(i => i.href === pathname)?.label || "Admin"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">System Online</span>
          </div>
        </header>
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
