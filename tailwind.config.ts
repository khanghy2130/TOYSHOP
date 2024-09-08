import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // color vars from app/tailwind.css
                bgColor1: "var(--bgColor1)",
                bgColor2: "var(--bgColor2)",
                bgColor3: "var(--bgColor3)",
                textColor1: "var(--textColor1)",
                primaryColor: "var(--primaryColor)",
                primaryColorMuted: "var(--primaryColorMuted)",
                primaryTextColor: "var(--primaryTextColor)",
            },
        },
    },
    plugins: [],
} satisfies Config;
