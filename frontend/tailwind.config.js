/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "#1e3a8a", // Indian Railways Blue
          light: "#3b82f6",
          dark: "#0f172a",
        },
        rail: {
          gold: "#f59e0b",
          green: "#10b981",
          red: "#ef4444",
          amber: "#f97316",
          dark: "#0b0f19",
          slate: "#1e293b",
          border: "#334155"
        }
      },
    },
  },
  plugins: [],
}
