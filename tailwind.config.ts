import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        midnight: "#0A0F1C",
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-hover": "rgba(255, 255, 255, 0.1)",
        neon: {
          blue: "#00F0FF",
          purple: "#7000FF",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 240, 255, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
