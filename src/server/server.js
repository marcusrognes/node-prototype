import '@babel/polyfill';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { CreateContext } from 'server/context';
import schema from 'server/schema';

function StartServer() {
	const PORT = process.env.SERVER_PORT || process.env.PORT || 4000;
	const app = express();

	app.use(express.static('dist/client'));

	(async () => {
		const staticContext = await CreateContext();
		const apolloServer = new ApolloServer({
			schema,
			introspection: true,
			playground: true,
			formatError: error => {
				Error.captureStackTrace(error);

				console.error(error);

				return error;
			},
			context: async ({ req }) => {
				let user = req.user || {};
				let acceptLanguage = req.header('Accept-Language');
				if (acceptLanguage) {
					acceptLanguage = acceptLanguage.split(',').map(lang => {
						return lang.split(';')[0];
					})[0];
				}

				let language = user.language || acceptLanguage || 'en';

				let languageT =
					staticContext.languagesT[language] ||
					staticContext.languagesT.en;

				return {
					...staticContext,
					user: req.user,
					t: languageT,
				};
			},
		});

		app.use(function(req, res, next) {
			const token = (req.header('Authorization') || '').replace(
				'Bearer ',
				'',
			);
			let tokenObject = {};

			if (!token) {
				return next();
			}

			try {
				tokenObject = staticContext.JWTVerify(token);
			} catch (error) {
				console.error(error);
			}

			if (!tokenObject) {
				return next();
			}

			req.user = tokenObject.user;

			return next();
		});

		apolloServer.applyMiddleware({ app });
	})();

	const server = app.listen(PORT, () =>
		console.log(`Server started on port ${PORT}!`),
	);

	return {
		server,
		app,
	};
}

export { StartServer };
