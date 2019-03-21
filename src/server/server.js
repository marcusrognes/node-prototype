import express from 'express';

const port = process.env.PORT || 4000;

function StartServer() {
	const app = express();

	app.get('/', (req, res) => res.send('Hello World!'));
	app.get('/graphql', (req, res) => res.send('GraphQL!'));

	const server = app.listen(port, () =>
		console.log(`Example app listening on port ${port}!`),
	);

	return {
		server,
		app,
	};
}

export { StartServer };
