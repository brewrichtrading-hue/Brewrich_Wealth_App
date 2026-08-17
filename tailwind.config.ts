import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          accent: "#D4AF37",
        },
        dark: {
          950: "#030712",
          900: "#0B0F19",
          850: "#111827",
          800: "#1F2937",
          700: "#374151",
        }
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      boxShadow: {
        'glow-brand': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
};

export default config;
