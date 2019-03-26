const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');
const [cliConfig, serverConfig, clientConfig] = require('../webpack.config');

const PORT = process.env.PORT || 3000;
const SERVER_PORT = process.env.SERVER_PORT || PORT + 10;

function StartDev() {
	const cliCompiler = webpack(cliConfig);
	cliCompiler.watch(
		{
			aggregateTimeout: 300,
		},
		(err, stats) => {
			console.log(`CLI:\n${stats}\n\n`);
		},
	);

	const serverCompiler = webpack(serverConfig);
	serverCompiler.watch(
		{
			aggregateTimeout: 300,
		},
		(err, stats) => {
			console.log(`SERVER:\n${stats}\n\n`);
		},
	);

	clientConfig.entry.unshift(
		`webpack-dev-server/client?http://localhost:${PORT}/`,
		'webpack/hot/dev-server',
	);

	const clientCompiler = webpack(clientConfig);
	const clientDevServer = new WebpackDevServer(clientCompiler, {
		proxy: {
			'/graphql': `http://localhost:${SERVER_PORT}`,
		},
		noInfo: true,
		hot: true,
		inline: true,
	});

	clientDevServer.listen(PORT, 'localhost', () => {
		console.log(`Starting server on http://localhost:${PORT}`);
	});
}

nodemon({
	script: 'dist/server/index.js',
	ext: 'js json',
});

StartDev();
