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
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        primary: "var(--primary)",
        border: "var(--border)",
        neon: "#3db4ff",
      },
      boxShadow: {
        neon: "0 0 20px rgba(59, 180, 255, 0.24), 0 20px 60px rgba(59, 180, 255, 0.12)",
        glow: "0 0 24px rgba(59, 180, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
