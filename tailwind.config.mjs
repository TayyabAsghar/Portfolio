/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      zIndex: {
        100: "100",
      },
      animation: {
        rising: "rising 1s ease 0s 1",
        setting: "setting 1s ease 0s 1",
        "menu-slide-in": "menuSlideIn 0.3s ease-out",
        "marquee-scroll": "scroll 10s linear infinite",
        "marquee-pause": "scroll 10s linear infinite paused",
        "certificate-loop": "certificate-loop 34s linear infinite",
        "chevron-pulse-left": "chevron-pulse-left 1s ease-in-out infinite",
        "chevron-move-left": "chevron-move-left 0.6s ease-in-out infinite",
        "chevron-pulse-right": "chevron-pulse-right 1s ease-in-out infinite",
        "chevron-move-right": "chevron-move-right 0.6s ease-in-out infinite",
      },
      keyframes: {
        scroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 24px))" },
        },
        "certificate-loop": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-50% - 10px))" },
        },
        menuSlideIn: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        setting: {
          "0%": { transform: "translate3d(0, 10px, 0)" },
          "40%": { transform: "translate3d(0, -2px, 0)" },
          to: { transform: "translate3d(0, 30px, 0)" },
        },
        rising: {
          "0%": { opacity: "0", transform: "translate3d(0, 30px, 0)" },
          "40%": { opacity: "1", transform: "translate3d(0, -2px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 10px, 0)" },
        },
        "chevron-pulse-right": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(3px)" },
        },
        "chevron-pulse-left": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-3px)" },
        },
        "chevron-move-right": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(4px)" },
        },
        "chevron-move-left": {
          "0%, 100%": { transform: "rotate(180deg) translateX(0)" },
          "50%": { transform: "rotate(180deg) translateX(4px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
