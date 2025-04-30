/* Configuración de Tailwind CSS */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
	  extend: {
		fontFamily: {
		  page: ['Karla', 'sans-serif'],
		  sans: ['Karla', 'sans-serif'],
		},
		/* Para bordes */
		borderRadius: {
		  '3xl': '3rem',
		},
	  },
	},
	plugins: [],
  };
  