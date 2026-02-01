"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBlur = async () => {
    // Save partial data as "abandoned" lead if we have email
    if (formData.email) {
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            company: formData.company,
            status: "abandoned",
            abandoned_at: new Date().toISOString(),
          }),
        });
      } catch {
        // best-effort only
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        name: formData.name,
        company: formData.company,
        status: "new",
        source: "website_form",
        abandoned_at: null,
      }),
    });
    const result = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok || result?.error) {
      setErrorMessage(result?.error || "Submission failed. Please try again.");
      return;
    }

    {
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
          }),
        });
      } catch {
        // Email notification is best-effort only
      }
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
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden space-y-6 border border-white/10 bg-white/[0.03] bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent rounded-3xl p-8 ring-1 ring-white/5 shadow-[0_0_80px_rgba(88,101,242,0.12)]"
    >
      <div className="pointer-events-none absolute -inset-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rotate-1" />
      <div className="pointer-events-none absolute inset-3 rounded-3xl border border-white/10" />
      {!compact && (
        <div className="space-y-2 relative z-10">
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] block">
            Strategy Intake
          </span>
          <h3 className="text-2xl font-bold text-white">Let’s build this.</h3>
          <p className="text-white/60 text-sm">
            Share the basics and we will send a tailored next step.
          </p>
        </div>
      )}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4 relative z-10"
          >
            {errorMessage && (
              <div className="border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-semibold px-4 py-3 rounded-2xl">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-2">
                Company / Brand (optional)
              </label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-neon-blue/80 focus:ring-1 focus:ring-neon-blue/50 transition-colors"
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
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : compact ? "Get Report" : "Complete Request"}
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
