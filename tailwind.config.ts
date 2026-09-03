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
        // Official Brand Color Tokens
        storm: {
          DEFAULT: "#000B4F",
          50: "#F0F2FA",
          100: "#D6DBF0",
          200: "#ADC0E3",
          300: "#7E9CD1",
          400: "#466BB8",
          500: "#1E4399",
          600: "#0E297A",
          700: "#071A5E",
          800: "#03114D",
          900: "#000B4F",
          950: "#000733",
        },
        bumblebee: {
          DEFAULT: "#FFC729",
          50: "#FFFDF5",
          100: "#FFF6D6",
          200: "#FFEBAD",
          300: "#FFDF7A",
          400: "#FFD347",
          500: "#FFC729",
          600: "#E6AF15",
          700: "#BF8E0A",
          800: "#996F04",
          900: "#735100",
        },
        joyous: {
          DEFAULT: "#B0261D",
          50: "#FDF2F1",
          100: "#F9D9D7",
          200: "#F2B2AE",
          300: "#E7857E",
          400: "#D9564E",
          500: "#B0261D",
          600: "#8F1B13",
          700: "#6E120D",
          800: "#4D0A07",
          900: "#2E0402",
        },
        surface: {
          DEFAULT: "#FEFEFE",
          pure: "#FEFEFE",
          card: "#FFFFFF",
          muted: "#F8FAFC",
        },
        // Backward-compatible color mappings
        royal: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#466BB8",
          500: "#1E4399",
          600: "#000B4F",
          700: "#000B4F",
          800: "#000733",
          900: "#000733",
          950: "#000522",
        },
        brand: {
          storm: "#000B4F",
          bumblebee: "#FFC729",
          joyous: "#B0261D",
          surface: "#FEFEFE",
          50: "#F0F2FA",
          100: "#D6DBF0",
          500: "#000B4F",
          600: "#000B4F",
          700: "#000733",
        },
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['32px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h3': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '0' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
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
        'brand': '0 12px 36px -4px rgba(0, 11, 79, 0.08), 0 4px 12px -2px rgba(0, 11, 79, 0.04)',
        'brand-hover': '0 20px 48px -4px rgba(0, 11, 79, 0.16), 0 8px 16px -2px rgba(0, 11, 79, 0.08)',
        'glow-bumblebee': '0 0 35px -5px rgba(255, 199, 41, 0.45)',
        'glow-storm': '0 0 35px -5px rgba(0, 11, 79, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
