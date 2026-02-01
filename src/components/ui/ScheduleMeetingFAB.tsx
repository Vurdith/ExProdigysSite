"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { LeadForm } from "@/components/conversion/LeadForm";
import { GlassCard } from "./GlassCard";
import { X } from "lucide-react";

export function ScheduleMeetingFAB() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-schedule-modal", openHandler);
    return () => window.removeEventListener("open-schedule-modal", openHandler);
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Calendar className="relative z-10 w-6 h-6" />
      </motion.button>

      {/* Booking Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/85 to-black/90"
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="relative w-full max-w-lg"
          >
            <GlassCard className="relative border-white/10 bg-white/[0.05] shadow-glow">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-3">
                  Schedule a strategy session
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Connect with our team to audit your digital assets and map the fastest route to launch.
                </p>
              </div>

              <LeadForm onComplete={() => setIsOpen(false)} />
            </GlassCard>
          </motion.div>
        </div>
      )}
    </>
  );
}
