const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');

const config = {
	future: {
		hoverOnlyWhenSupported: true
	},

	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [typography, daisyui]
};

module.exports = config;
