"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 md:px-16 transition-all duration-500",
        scrolled ? "py-6 bg-black/40 backdrop-blur-2xl border-b border-white/5" : "py-10 bg-transparent"
      )}
    >
      <Link href="/" className="group flex items-center gap-4">
        <div className="w-8 h-8 bg-white flex items-center justify-center">
          <div className="w-4 h-4 bg-black" />
        </div>
        <span className="text-sm font-bold tracking-[0.3em] text-white uppercase transition-opacity group-hover:opacity-70">
          Burgundy Ventures
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-16">
        {["About", "Services", "Stats", "Work"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-12">
        <Link 
          href="#contact" 
          className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
        >
          Contact
        </Link>
        <MagneticButton className="bg-white text-black px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-none">
          Get Started
        </MagneticButton>
      </div>
    </motion.header>
  );
}
