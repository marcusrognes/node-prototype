const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const sharedConfig = {
	resolve: {
		alias: {
			cli: path.resolve(__dirname, 'src/cli/'),
			server: path.resolve(__dirname, 'src/server/'),
			client: path.resolve(__dirname, 'src/client/'),
		},
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};

module.exports = [
	{
		entry: './src/cli/index.js',
		output: {
			path: path.resolve(__dirname, 'dist/cli'),
			filename: 'index.js',
		},
		...sharedConfig,
		externals: nodeExternals(),
		target: 'node',
		plugins: [
			new webpack.BannerPlugin({
				banner: '#!/usr/bin/env node',
				raw: true,
			}),
		],
	},
	{
		entry: './src/server/index.js',
		output: {
			path: path.resolve(__dirname, 'dist/server'),
			filename: 'index.js',
		},
		externals: nodeExternals(),
		target: 'node',
		...sharedConfig,
		devServer: {
			port: 4000,
			open: true,
		},
	},
	{
		entry: './src/client/index.js',
		output: {
			path: path.resolve(__dirname, 'dist/client'),
			filename: 'index.js',
		},
		target: 'web',
		...sharedConfig,
		devServer: {
			port: 3000,
			open: true,
			proxy: {
				'/graphql': 'http://localhost:4000/graphql',
			},
		},
	},
];
