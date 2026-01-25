"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export function LeadForm({
  onComplete,
  compact = false,
}: {
  onComplete?: () => void;
  compact?: boolean;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);

  const handleBlur = async () => {
    // Save partial data as "abandoned" lead if we have email
    if (formData.email) {
      await supabase.from("leads").upsert(
        {
          email: formData.email,
          name: formData.name,
          company: formData.company,
          status: "abandoned",
          abandoned_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("leads").upsert(
      {
        email: formData.email,
        name: formData.name,
        company: formData.company,
        status: "new",
        source: "website_form",
        abandoned_at: null, // Clear abandoned status
      },
      { onConflict: "email" }
    );

    setLoading(false);

    if (!error) {
      if (onComplete) onComplete();
      else setStep(3); // Success state
    }
  };

  if (step === 3) {
    return (
      <div className="text-center py-10">
        <h3 className="text-2xl font-bold text-white mb-2">You're all set!</h3>
        <p className="text-white/60">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={handleBlur}
              />
            </div>
            {!compact && (
              <MagneticButton
                className="w-full bg-white text-black"
                onClick={() => setStep(2)}
                variant="primary"
              >
                Next Step
              </MagneticButton>
            )}
            {compact && (
                <MagneticButton
                className="w-full bg-white text-black"
                variant="primary"
                // type="submit" // Need to handle this click to submit if compact
              >
                {loading ? "Sending..." : "Get Report"}
              </MagneticButton>
            )}
          </motion.div>
        )}

        {step === 2 && !compact && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1">
                Company (Optional)
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="Acme Inc."
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                onBlur={handleBlur}
              />
            </div>
            <MagneticButton
              className="w-full bg-white text-black"
              variant="primary"
            >
              {loading ? "Submitting..." : "Complete Request"}
            </MagneticButton>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-white/40 hover:text-white transition-colors"
            >
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
