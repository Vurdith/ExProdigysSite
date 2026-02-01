"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  hoverEffect = true,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position relative to center of card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate relative mouse position from -0.5 to 0.5
    const mouseX = (event.clientX - rect.left) / width - 0.5;
    const mouseY = (event.clientY - rect.top) / height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Shine position values
  const shineX = useMotionValue(0);
  const shineY = useMotionValue(0);

  function handleShineMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    shineX.set(clientX - left);
    shineY.set(clientY - top);
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent",
        "transition-colors duration-500 perspective-2000",
        hoverEffect && "hover:border-white/10 hover:bg-white/[0.04]",
        className
      )}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleShineMouseMove(e);
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hoverEffect ? rotateX : 0,
        rotateY: hoverEffect ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5 }}
    >
      {/* Shine Effect */}
      {hoverEffect && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${shineX}px ${shineY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
            transform: "translateZ(50px)",
          }}
        />
      )}
      
      {/* Inner Glow/Noise */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      
      <div 
        className="relative z-10 p-8 md:p-10"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
