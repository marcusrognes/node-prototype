import '@babel/polyfill';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { CreateContext } from 'server/context';
import schema from 'server/schema';

const port = process.env.PORT || 4000;

function StartServer() {
	const app = express();

	app.use(express.static('dist/client'));

	(async () => {
		const staticContext = await CreateContext();
		const apolloServer = new ApolloServer({
			schema,
			formatError: error => {
				Error.captureStackTrace(error);

				console.error(error);

				return error;
			},
			context: async ({ req }) => ({
				...staticContext,
			}),
		});

		apolloServer.applyMiddleware({ app });
	})();

	const server = app.listen(port, () =>
		console.log(`Example app listening on port ${port}!`),
	);

	return {
		server,
		app,
	};
}

export { StartServer };
