import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function SignatureSigil({
  className,
}: {
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(smoothY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothX, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className={className}>
      <motion.div
        className="w-full h-full"
        style={{ rotateX, rotateY }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          <radialGradient id="sigilGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(120 120) rotate(90) scale(120)">
            <stop offset="0" stopColor="rgba(0,240,255,0.35)" />
            <stop offset="0.6" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="sigilStroke" x1="24" y1="30" x2="210" y2="210">
            <stop offset="0" stopColor="#00F0FF" />
            <stop offset="0.5" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#7000FF" />
          </linearGradient>
        </defs>

        <circle cx="120" cy="120" r="112" stroke="url(#sigilStroke)" strokeOpacity="0.4" strokeWidth="1.2" />
        <circle cx="120" cy="120" r="86" stroke="url(#sigilStroke)" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="120" cy="120" r="58" stroke="url(#sigilStroke)" strokeOpacity="0.6" strokeWidth="1" />

        <g stroke="url(#sigilStroke)" strokeOpacity="0.7" strokeWidth="1">
          <path d="M120 26V6" />
          <path d="M120 234V214" />
          <path d="M26 120H6" />
          <path d="M234 120H214" />
          <path d="M55 55L40 40" />
          <path d="M185 185L200 200" />
          <path d="M185 55L200 40" />
          <path d="M55 185L40 200" />
        </g>

        <g stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1">
          <path d="M120 46L128 62L146 66L133 79L136 98L120 89L104 98L107 79L94 66L112 62Z" />
        </g>

        <g stroke="url(#sigilStroke)" strokeOpacity="0.75" strokeWidth="1">
          <path d="M120 120L182 92" />
          <path d="M120 120L58 150" />
          <path d="M120 120L120 182" />
        </g>

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ originX: "120px", originY: "120px" }}
        >
          <circle cx="120" cy="26" r="3" fill="#00F0FF" fillOpacity="0.8" />
          <circle cx="205" cy="120" r="2.5" fill="#FFFFFF" fillOpacity="0.7" />
        </motion.g>

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ originX: "120px", originY: "120px" }}
        >
          <circle cx="120" cy="210" r="2.5" fill="#7000FF" fillOpacity="0.75" />
          <circle cx="34" cy="120" r="2" fill="#FFFFFF" fillOpacity="0.6" />
        </motion.g>

        <motion.circle
          cx="120"
          cy="120"
          r="14"
          fill="url(#sigilGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="120" cy="120" r="6" stroke="#FFFFFF" strokeOpacity="0.9" />

        <g fill="#FFFFFF" fillOpacity="0.7">
          <circle cx="120" cy="34" r="1.5" />
          <circle cx="206" cy="120" r="1.5" />
          <circle cx="120" cy="206" r="1.5" />
          <circle cx="34" cy="120" r="1.5" />
        </g>
        </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
