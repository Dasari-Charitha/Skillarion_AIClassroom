/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // UptoSkills-inspired deep blue palette
        navy: {
          50: "#E8EEF8",
          100: "#C5D3ED",
          200: "#9BB3DE",
          300: "#6E90CC",
          400: "#4A73BF",
          500: "#2B5AA0",
          DEFAULT: "#0F3460",
          600: "#0D2D54",
          700: "#0B1F3D",
          800: "#0a1128",  // UptoSkills exact background
          900: "#070C1E",
          950: "#050816",  // Deepest dark
        },
        // Warm gold accents
        gold: {
          50: "#FFF9E6",
          100: "#FFF0BF",
          200: "#FFE699",
          300: "#FFD54F",
          400: "#FFC107",
          500: "#DAA520",
          DEFAULT: "#C8952E",
          600: "#B8860B",
          700: "#996F08",
          800: "#7A5800",
          900: "#5C4200",
        },
        // UptoSkills accent colors
        accent: {
          blue: "#2563EB",
          teal: "#14B8A6",
          orange: "#F97316",
          purple: "#9333EA",
          pink: "#EC4899",
          emerald: "#10B981",
          rose: "#F43F5E",
          sky: "#0EA5E9",
          cyan: "#06B6D4",
        },
        // Surface colors
        surface: {
          light: "#F8FAFC",
          card: "#FFFFFF",
          darkBg: "#020817",
          darkCard: "#0f172a",
          darkInner: "#1e293b",
        },
        muted: "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#0EA5E9",
      },

      boxShadow: {
        gold: "0 8px 30px rgba(200, 149, 46, 0.15)",
        goldHover: "0 18px 45px rgba(200, 149, 46, 0.28)",
        blue: "0 8px 30px rgba(37, 99, 235, 0.18)",
        blueHover: "0 18px 45px rgba(37, 99, 235, 0.30)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        cardDark: "0 4px 24px rgba(0,0,0,0.5)",
        glow: "0 0 40px rgba(37, 99, 235, 0.15)",
      },

      fontFamily: {
        sans: ["Inter", "Segoe UI", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },

      animation: {
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "float-medium": "floatMedium 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "bubble": "bubbleFloat 8s ease-in-out infinite",
      },

      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(37, 99, 235, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(37, 99, 235, 0.30)" },
        },
        bubbleFloat: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.5" },
          "50%": { transform: "translateY(-30px) scale(1.1)", opacity: "0.8" },
        },
      },
    },
  },

  plugins: [],
};