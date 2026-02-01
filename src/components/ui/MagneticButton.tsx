"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function MagneticButton({
  children,
  className,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    if (disabled) return;
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-glass border border-white/20 text-white hover:bg-glass-hover",
    ghost: "bg-transparent text-white hover:text-neon-blue",
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative rounded-full px-8 py-3 text-sm font-medium tracking-wide transition-colors",
        variants[variant],
        disabled && "pointer-events-none opacity-60",
        className
      )}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}
