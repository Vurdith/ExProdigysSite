"use client";

import { useExitIntent } from "@/hooks/useExitIntent";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LeadForm } from "./LeadForm";
import { X } from "lucide-react";

export function ExitIntentPopup() {
  const { isVisible, setIsVisible } = useExitIntent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-black/90 via-black/70 to-black/80 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg"
          >
            <GlassCard className="relative border-neon-blue/30 shadow-glow">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-bold mb-3">
                  WAIT! BEFORE YOU GO
                </span>
                <h3 className="text-2xl font-bold mb-2">
                  Get the Gaming Market Trends Report
                </h3>
                <p className="text-white/60">
                  Don't leave empty handed. Download our comprehensive guide to 2026 gaming trends and monetization strategies.
                </p>
              </div>

              <LeadForm
                compact
                onComplete={() => {
                  setTimeout(() => setIsVisible(false), 2000);
                }}
              />
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
