import { deleteOne, paginate, findOne } from 'server/context/resolvers';

function getJWTUserObject(user) {
	return {
		_id: user._id,
		name: user.name,
		email: user.email,
	};
}

async function hashUserPassword(_, args, doc, context) {
	const { PasswordHash, PasswordValidate, t } = context;

	if (doc.password) {
		const passwordIssues = PasswordValidate(doc.password);

		if (passwordIssues.length !== 0) {
			throw new Error(
				t('error.user.weakPassword', {
					issues: passwordIssues
						.map(issue => t('error.user.passwordIssues.' + issue))
						.join(', '),
				}),
			);
		}

		doc.password = PasswordHash(doc.password);
	}

	return doc;
}

const UsersModule = {
	typeDefs: `
        type User inherits Document {
            name: String
			email: String
			language: Language
        }

		type LoginReturn {
			user: User
			token: String
		}

        extend type Query {
            findOneUser(
                _id: ID!
            ): User @auth(scope:"users:read")

            paginateUsers(
                skip: Int
                limit: Int
                search: String
                order: Int
                orderBy: String
            ): Paginate<User> @auth(scope:"users:read")
        }

        extend type Mutation {
			insertOneUser(
                name: String!
                email: String!
				password: String!
				language: Language
            ): User

            updateOneUser(
                _id: ID!
                name: String
                email: String
                password: String
				language: Language
            ): User @auth(scope:"users:write")

            deleteOneUser(
                _id: ID!
			): Boolean @auth(scope:"users:delete")
			
			login(
				email: String!
				password: String!
			): LoginReturn

			updateMyProfile(
				name: String
				email: String
				password: String
				language: Language
			): LoginReturn
        }
    `,
	resolvers: {
		Query: {
			findOneUser: findOne('Users'),
			paginateUsers: paginate('Users'),
		},
		Mutation: {
			insertOneUser: async (_, args, context) => {
				const { Users, t } = context;
				const {
					password,
					name,
					email,
					language,
				} = await hashUserPassword(_, args, args, context);

				if (!password) {
					throw new Error(t('error.user.missingPassword'));
				}

				const existingUser = await Users.findOne({
					email,
				});

				if (existingUser) {
					throw new Error(t('error.user.emailExists'));
				}

				const results = await Users.insertOne({
					name,
					email,
					password,
					language: language || 'nb',
				});

				return results.ops[0];
			},
			updateOneUser: async (_, args, context) => {
				const { Users, t } = context;
				const {
					_id,
					password,
					email,
					name,
					language,
				} = await hashUserPassword(_, args, args, context);

				const existingUser = await Users.findOne({
					email,
					_id: {
						$ne: _id,
					},
				});

				if (existingUser) {
					throw new Error(t('error.user.emailExists'));
				}

				let $set = {};

				if (password) {
					$set.password = password;
				}

				if (name) {
					$set.name = name;
				}

				if (email) {
					$set.email = email;
				}

				if (language) {
					$set.language = language;
				}

				const updateReturn = await Users.updateOne(
					{
						_id,
					},
					{
						$set,
					},
				);

				if (updateReturn.matchedCount === 0) {
					throw new Error(t('error.user.notFound'));
				}

				return await Users.findOne({
					_id: _id,
				});
			},
			updateMyProfile: async (_, args, context) => {
				const { Users, JWTSign, t } = context;
				const {
					password,
					email,
					name,
					language,
				} = await hashUserPassword(_, args, args, context);

				let { user } = context;

				if (!user) {
					throw new Error(t('error.user.notLoggedIn'));
				}

				const existingUser = await Users.findOne({
					email,
				});

				if (existingUser) {
					throw new Error(t('error.user.emailExists'));
				}

				let $set = {};

				if (password) {
					$set.password = password;
				}

				if (name) {
					$set.name = name;
				}

				if (language) {
					$set.language = language;
				}

				await Users.updateOne(
					{
						_id: user._id,
					},
					{
						$set,
					},
				);

				user = await Users.findOne({
					_id: user._id,
				});

				return {
					user,
					token: JWTSign({
						sub: user._id,
						user: getJWTUserObject(user),
					}),
				};
			},
			deleteOneUser: deleteOne('Users'),
			login: async (_, args, context) => {
				const { PasswordCompare, Users, JWTSign, t } = context;
				const { email, password } = args;
				const user = await Users.findOne({
					email,
				});
				let isLoggedIn = false;

				if (!user) {
					throw new Error(t('error.user.emailPassword'));
				}

				try {
					isLoggedIn = PasswordCompare(password, user.password);
				} catch (error) {
					console.error(error);
					throw new Error(t('error.user.emailPassword'));
				}

				if (!isLoggedIn) {
					throw new Error(t('error.user.emailPassword'));
				}

				return {
					user,
					token: JWTSign({
						sub: user._id,
						user: getJWTUserObject(user),
					}),
				};
			},
		},
	},
};

export default UsersModule;
