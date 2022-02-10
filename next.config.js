/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	basePath: process.env.NODE_ENV === "development" ? "" : "/water-drinker",
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},
};
