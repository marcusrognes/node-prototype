const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

function getSafeEnvVariables(env) {
	let safeEnv = {};

	Object.keys(env).forEach(key => {
		if (key.indexOf('REACT_APP') === 0) {
			safeEnv[key] = env[key];
		}
	});

	const envKeys = Object.keys(safeEnv).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);

		return prev;
	}, {});

	return envKeys;
}

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
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {},
					},
				],
			},
		],
	},
};

module.exports = [
	{
		devtool: 'sourcemap',
		entry: './src/cli/index.js',
		output: {
			path: path.resolve(__dirname, 'dist/cli'),
			filename: 'index.js',
		},
		...sharedConfig,
		externals: nodeExternals(),
		target: 'node',
		plugins: [
			// new webpack.BannerPlugin({
			// 	banner: '#!/usr/bin/env node',
			// 	raw: true,
			// }),
			new webpack.BannerPlugin({
				banner: 'require("source-map-support").install();',
				raw: true,
				entryOnly: false,
			}),
			new DashboardPlugin(),
		],
	},
	{
		devtool: 'sourcemap',
		entry: {
			index: './src/server/index.js',
			server: './src/server/server.js',
		},
		output: {
			path: path.resolve(__dirname, 'dist/server'),
			filename: '[name].js',
			libraryTarget: 'commonjs',
		},
		externals: nodeExternals({
			exclude: ['./src/server/server.js'],
		}),
		target: 'node',
		plugins: [
			new webpack.BannerPlugin({
				banner: 'require("source-map-support").install();',
				raw: true,
				entryOnly: false,
			}),
			new DashboardPlugin(),
		],
		...sharedConfig,
	},
	{
		devtool: 'inline-source-map',
		entry: ['./src/client/index.js'],
		output: {
			path: path.resolve(__dirname, 'dist/client'),
			filename: 'index.js',
		},
		target: 'web',
		...sharedConfig,
		optimization: {
			splitChunks: {
				// include all types of chunks
				chunks: 'all',
			},
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './assets/index.html',
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin(getSafeEnvVariables(process.env)),
			new DashboardPlugin(),
		],
	},
];
