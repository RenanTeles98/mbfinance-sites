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
        brand: {
          primary: "#003956",
          secondary: "#0099dd",
          dark: "#002840",
          light: "#e6f4fb",
          muted: "#f0f8ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #003956 0%, #005a8a 100%)",
        "gradient-hero": "linear-gradient(135deg, #002840 0%, #003956 50%, #005a8a 100%)",
        "gradient-cta": "linear-gradient(135deg, #0099dd 0%, #007ab8 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
