import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./_lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'red': '#B71C1C',
        'light-blue': '#B3E5FC',
        'beige': '#F5E6D3',
        'yellow': '#FDD835',
      },
      fontFamily: {
        'gardablack': ['Gardablack', 'cursive'],
        'cubano': ['Cubano', 'sans-serif'],
      },
    },
  },
  safelist: [
    'bg-red',
    'bg-light-blue',
    'bg-beige',
    'bg-yellow',
    'text-red',
    'text-white',
    'font-gardablack',
    'font-cubano',
  ],
  plugins: [],
};
export default config;
