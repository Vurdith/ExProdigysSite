"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const games = [
  {
    title: "GrowROT",
    description: "Plant your magical seeds and grow a brainrot!",
    image: "/images/hero-1.png",
    stats: "1M+ Peak CCU",
  },
  {
    title: "Anime Simulator",
    description: "Welcome to Anime Simulator, a fighting and training game.",
    image: "/images/hero-2.png",
    stats: "500K+ Peak CCU",
  },
  {
    title: "Anime Chefs",
    description: "Step into the kitchen where cooking meets chaos.",
    image: "/images/hero-3.png",
    stats: "250K+ Peak CCU",
  },
  {
    title: "Go Hard Games",
    description: "Find the best Roblox games to play with friends.",
    image: "/images/hero-1.png",
    stats: "Platform Leader",
  },
];

// Duplicate for seamless loop
const allGames = [...games, ...games];

export function FeaturedGames() {
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
            <div key={i} className="relative flex-shrink-0">
              <div className="group relative h-[55vh] w-[400px] md:w-[500px] rounded-none border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-700 hover:border-white/20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={game.image}
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

                {/* Index - Adjust based on original list length */}
                <div className="absolute top-12 right-12 text-white/10 font-mono text-sm group-hover:text-white/40 transition-colors">
                  0{(i % games.length) + 1}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Fades for the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10" />
    </section>
  );
}
