const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
			new webpack.BannerPlugin({
				banner: '#!/usr/bin/env node',
				raw: true,
			}),
			new webpack.BannerPlugin({
				banner: 'require("source-map-support").install();',
				raw: true,
				entryOnly: false,
			}),
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
		plugins: [
			new HtmlWebpackPlugin({
				template: './assets/index.html',
			}),
			new webpack.HotModuleReplacementPlugin(),
		],
	},
];
