"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArtifactCore } from "@/components/ui/ArtifactCore";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { useRef, useEffect } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Mouse tracking for interactive lighting
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Parallax transforms
  const textY = useTransform(springScroll, [0, 1], ["0%", "100%"]);
  const floorRotateX = useTransform(springScroll, [0, 1], [60, 45]);
  const floorZ = useTransform(springScroll, [0, 1], [0, -500]);
  const opacity = useTransform(springScroll, [0, 0.5], [1, 0]);

  // Spotlight effect
  const spotlight = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] w-full flex flex-col items-center overflow-hidden bg-void"
    >
      {/* 1. Interactive Spotlight Layer */}
      <motion.div 
        style={{ background: spotlight }}
        className="fixed inset-0 z-40 pointer-events-none" 
      />

      {/* 2. Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="mesh-container opacity-20">
          <div className="mesh-ball w-[80vw] h-[80vw] bg-neon-purple top-[-20%] left-[-10%] animate-mesh" />
          <div className="mesh-ball w-[70vw] h-[70vw] bg-neon-blue bottom-[-20%] right-[-10%] animate-mesh animation-delay-2000" />
        </div>
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
      </div>

      {/* 3. The Perspective Stage (The Floor) */}
      <div className="absolute inset-0 z-5 flex items-center justify-center perspective-2000">
        <motion.div
          style={{ rotateX: floorRotateX, z: floorZ, opacity }}
          className="relative w-[200vw] h-[200vh] transform-3d"
        >
          {/* Glowing Lines / Structural Blueprint */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:100px_100px]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                 
                 {/* Floating High-End Assets */}
          <motion.div 
            animate={{ y: [0, -40, 0], rotateZ: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            className="absolute left-[35%] top-[40%] w-[600px] h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,240,255,0.1)]"
          >
            <Image src="/images/hero-1.png" alt="Showcase 1" fill className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 40, 0], rotateZ: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            className="absolute right-[35%] top-[45%] w-[500px] h-[350px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(112,0,255,0.1)]"
          >
            <Image src="/images/hero-2.png" alt="Showcase 2" fill className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" />
          </motion.div>
        </motion.div>
      </div>

      {/* 3.5 The 3D Artifact Centerpiece - Positioned behind UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div className="w-full h-[80vh] opacity-60">
          <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
            <ArtifactCore />
          </Canvas>
        </div>
      </div>

      {/* 4. Hero Content - Floating Above Stage */}
      <div className="relative z-50 pt-[25vh] container mx-auto px-6 max-w-6xl pointer-events-none">
        <div className="flex flex-col items-center text-center">
          {/* Technical Label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-white"
          >
            <div className="w-12 h-[1px] bg-white/30" />
            <span>Burgundy Ventures Structural Systems</span>
            <div className="w-12 h-[1px] bg-white/30" />
          </motion.div>

          {/* Headline - Kinetic Reveal */}
          <motion.div style={{ y: textY, opacity }} className="mb-16">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                  className="block"
                >
                  Architecting
                </motion.span>
              </span>
                     <span className="block overflow-hidden -mt-2">
                       <motion.span
                         initial={{ y: "100%" }}
                         animate={{ y: 0 }}
                         transition={{ delay: 0.2, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                         className="block text-white/60 italic font-light"
                       >
                         The Impossible.
                       </motion.span>
                     </span>
            </h1>
          </motion.div>

          {/* Description - Clarified for 5-Second Test */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-medium"
          >
            We build high-fidelity virtual worlds for brands ready to lead the metaverse. 
            Remove technical friction and start growing your digital presence today.
          </motion.p>

          {/* Interactive CTAs - Action Oriented + Risk Reversal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center gap-8 pointer-events-auto"
          >
            <div className="flex flex-col sm:flex-row items-center gap-12">
              <MagneticButton className="bg-white text-black px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] rounded-none hover:bg-neon-blue transition-all duration-500">
                Book Your Strategy Session
              </MagneticButton>
              
              <button className="group relative text-white/70 hover:text-white font-bold tracking-[0.4em] uppercase text-[10px] transition-colors">
                <span>View Results Guide</span>
                <motion.div 
                  className="absolute -bottom-4 left-0 w-0 h-[1px] bg-white opacity-40 group-hover:w-full transition-all duration-500"
                />
              </button>
            </div>
          </motion.div>

          {/* Micro-Trust Logos - Moved Above the Fold */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-24 pt-12 border-t border-white/10 flex flex-col items-center gap-8 w-full"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-white/60 font-bold">
              Trusted by metaverse leaders
            </span>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale pointer-events-none">
              {["FURIA", "AVATAR STUDIOS", "GO HARD", "SERUNITE"].map((logo) => (
                <span key={logo} className="text-sm font-black tracking-tighter text-white">{logo}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. Scroll Progress Ribbon */}
      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[1px] bg-white/20 origin-left z-[110]"
      />
    </section>
  );
}
