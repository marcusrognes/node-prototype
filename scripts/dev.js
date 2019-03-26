const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');
const [cliConfig, serverConfig, clientConfig] = require('../webpack.config');

function StartDev() {
	let serverObject = null;

	const cliCompiler = webpack(cliConfig);
	const cliWatcher = cliCompiler.watch(
		{
			aggregateTimeout: 300,
		},
		(err, stats) => {
			console.log(`CLI:\n${stats}\n\n`);
		},
	);

	const serverCompiler = webpack(serverConfig);
	const serverWatcher = serverCompiler.watch(
		{
			aggregateTimeout: 300,
		},
		(err, stats) => {
			console.log(`SERVER:\n${stats}\n\n`);
		},
	);

	clientConfig.entry.unshift(
		'webpack-dev-server/client?http://localhost:3000/',
		'webpack/hot/dev-server',
	);

	const clientCompiler = webpack(clientConfig);
	const clientDevServer = new WebpackDevServer(clientCompiler, {
		proxy: {
			'/graphql': 'http://localhost:4000',
		},
		noInfo: true,
		hot: true,
		inline: true,
	});

	clientDevServer.listen(3000, 'localhost', () => {
		console.log('Starting server on http://localhost:3000');
	});
}

nodemon({
	script: 'dist/server/index.js',
	ext: 'js json',
});

StartDev();
