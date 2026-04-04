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
        "water-flow": "flow 15s linear infinite",
        "ship-bob": "bob 3s ease-in-out infinite",
        "sail-sway": "sway 4s ease-in-out infinite",
        "menu-slide-in": "menuSlideIn 0.3s ease-out",
        "water-flow-fast": "flow 10s linear infinite",
        "marquee-scroll": "scroll 10s linear infinite",
        "wake-ripple": "ripple 2s ease-in-out infinite",
        "marquee-pause": "scroll 10s linear infinite paused",
        "sail-sway-delayed": "sway 4.5s ease-in-out infinite -1s",
        "certificate-loop": "certificate-loop 34s linear infinite",
        "wake-ripple-delayed": "ripple 2s ease-in-out infinite -1s",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "chevron-pulse-left": "chevron-pulse-left 1s ease-in-out infinite",
        "chevron-move-left": "chevron-move-left 0.6s ease-in-out infinite",
        "chevron-pulse-right": "chevron-pulse-right 1s ease-in-out infinite",
        "chevron-move-right": "chevron-move-right 0.6s ease-in-out infinite",
        "fade-in-left": "fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-right": "fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
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
        flow: {
          from: { "background-position": "0 0" },
          to: { "background-position": "0 1000px" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-4px) rotate(1deg)" },
        },
        sway: {
          "0%, 100%": { transform: "skewX(0deg)" },
          "50%": { transform: "skewX(3deg)" },
        },
        ripple: {
          "0%": { transform: "scaleX(0.8) translateY(0)", opacity: "0.3" },
          "50%": { transform: "scaleX(1.1) translateY(2px)", opacity: "0.6" },
          "100%": { transform: "scaleX(0.9) translateY(0)", opacity: "0.3" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
