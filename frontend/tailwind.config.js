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
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "SF Pro",
          "Helvetica Neue",
          "Inter",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Menlo",
          "Monaco",
          "Courier New",
          "monospace"
        ]
      },
      colors: {
        canvas: {
          DEFAULT: "#090D16",
          subtle: "#0D121F",
          card: "#111726",
          cardHover: "#161E31",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        status: {
          green: "#10b981",
          amber: "#f59e0b",
          red: "#f43f5e",
          blue: "#0284c7",
          purple: "#8b5cf6"
        }
      },
    },
  },
  plugins: [],
}
