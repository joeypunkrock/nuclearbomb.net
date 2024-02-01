module.exports = {
	content: [
		"./src/*.html",
		"./src/**/*.html",
		"./src/*.pug",
		"./src/**/*.pug",
		"./src/**/*.js",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
		},
		extend: {
			//- Add custom color palette here
			colors: {
				white: "#ffffff",
			},
		},
	},
	variants: {},
	corePlugins: {},
	future: {
		purgeLayersByDefault: process.env.NODE_ENV === "production",
	},
};
