"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Image from "next/image";

interface PortfolioGame {
  id: string;
  title: string;
  description: string;
  image_url: string;
  stats: string;
  order_index: number;
}

export function FeaturedGames() {
  const [games, setGames] = useState<PortfolioGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_games")
          .select("*")
          .order("order_index", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setGames(data);
        } else {
          throw new Error("No data found");
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error fetching games:", err);
        }
        // Fallback to static data
        setGames([
          { id: "1", title: "Cyber-City RPG", description: "A high-fidelity neon metropolis where brands integrate through digital fashion and interactive storefronts.", image_url: "/images/hero-1.png", stats: "1.2M+ Monthly Visits", order_index: 0 },
          { id: "2", title: "Void Runners", description: "High-octane competitive racing through gravity-defying tracks. Featured in official global tournaments.", image_url: "/images/hero-2.png", stats: "500k+ Active Players", order_index: 1 },
          { id: "3", title: "Eco-Quest", description: "An immersive nature simulation teaching sustainability through gamified challenges and community rewards.", image_url: "/images/hero-3.png", stats: "Top 10 Education", order_index: 2 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  // Duplicate for seamless loop if we have enough games
  const allGames = games.length > 0 ? [...games, ...games] : [];

  return (
    <section id="work" className="relative py-32 bg-void overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl mb-24">
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 block">
          The Portfolio
        </span>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          The <span className="text-white/40 italic font-light">Artifacts.</span>
        </h2>
      </div>

      {/* Seamless Marquee Container */}
      <div className="relative flex">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {allGames.map((game, i) => (
            <div key={`${game.id}-${i}`} className="relative flex-shrink-0">
              <div className="group relative h-[55vh] w-[400px] md:w-[500px] rounded-none border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-white/20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={game.image_url}
                    alt={game.title}
                    fill
                    className="object-cover opacity-20 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-12">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    {game.stats}
                  </span>
                  <h3 className="text-4xl font-bold tracking-tight mb-6">
                    {game.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-xs mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 whitespace-normal">
                    {game.description}
                  </p>
                  <div className="w-12 h-[1px] bg-white/40 transition-all duration-500 group-hover:w-full" />
                </div>

                {/* Index */}
                <div className="absolute top-12 right-12 text-white/10 font-mono text-sm group-hover:text-white/40 transition-colors">
                  0{(i % games.length) + 1}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10" />
    </section>
  );
}
