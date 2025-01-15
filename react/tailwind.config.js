/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
      // Simple 16 column grid
      '15': 'repeat(15, minmax(0, 1fr))',
    },
    keyframes: {
      fall: {
        "0%": { transform: "translateY(0)" },
        "100%": { transform: "translateY(110vh)" },
      },
      sway: {
        "0%, 100%": { transform: "translateX(0)" },
        "50%": { transform: "translateX(10px)" },
      },
    },
    animation: {
      fall: "fall 5s linear infinite",
      sway: "sway 5s ease-in-out infinite",
    },
    
  },
    
  },
  plugins: [],
}