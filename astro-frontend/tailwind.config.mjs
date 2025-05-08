// tailwind.config.js o tailwind.config.mjs
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		fontFamily: {
		  page: ['Karla', 'sans-serif'],
		  sans: ['Karla', 'sans-serif'],
		},
		borderRadius: {
		  '3xl': '3rem',
		},
		animation: {
		  fadeInDown: 'fadeInDown 0.5s ease-out',
		},
		keyframes: {
		  fadeInDown: {
			'0%': { opacity: '0', transform: 'translateY(-30px)' },
			'100%': { opacity: '1', transform: 'translateY(0)' },
		  },
		},
	  },
	},
	plugins: [],
  };
  