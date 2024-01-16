import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // color vars from app/tailwind.css
        "color-1": "var(--color-1)",
        "color-2": "var(--color-2)",
        "color-3": "var(--color-3)",
        "color-4": "var(--color-4)",
        "color-5": "var(--color-5)"
      },
    },
  },
  plugins: [],
} satisfies Config

