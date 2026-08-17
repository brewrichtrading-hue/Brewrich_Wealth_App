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
        royal: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1456F0",
          700: "#0A358F",
          800: "#082974",
          900: "#081d4a",
          950: "#040d21",
        },
        navy: {
          800: "#13233c",
          850: "#0f1c30",
          900: "#0b1626",
          950: "#070e1a",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#3b82f6",
          500: "#1456F0",
          600: "#0A358F",
          700: "#082974",
          800: "#061f5c",
          900: "#041544",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      minHeight: {
        touch: "48px",
      },
      minWidth: {
        touch: "48px",
      },
      boxShadow: {
        'betterment': '0 12px 36px -4px rgba(10, 37, 64, 0.08), 0 4px 12px -2px rgba(10, 37, 64, 0.04)',
        'betterment-hover': '0 20px 48px -4px rgba(20, 86, 240, 0.12), 0 8px 16px -2px rgba(10, 37, 64, 0.06)',
        'glow-royal': '0 0 35px -5px rgba(20, 86, 240, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
