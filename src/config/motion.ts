export const TRANSITION_EASE = [0.33, 1, 0.68, 1]; // Smooth, premium feel
export const DURATION_SLOW = 0.8;
export const DURATION_MEDIUM = 0.5;
export const DURATION_FAST = 0.3;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: TRANSITION_EASE,
      duration: DURATION_MEDIUM,
    },
  },
};
