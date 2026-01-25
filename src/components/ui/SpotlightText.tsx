"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
}

export function SpotlightText({
  children,
  className,
  as: Component = "h1",
}: SpotlightTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <Component
      ref={ref}
      className={cn(
        "relative inline-block overflow-hidden pb-1", // pb-1 for descenders
        className
      )}
    >
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        className="block bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
      >
        {children}
      </motion.span>
    </Component>
  );
}
