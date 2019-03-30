import {
	insertOne,
	updateOne,
	deleteOne,
	paginate,
	findOne,
} from 'server/context/resolvers';

async function hashUserPassword(_, args, doc, context) {
	const { PasswordHash, PasswordValidate } = context;

	if (doc.password) {
		const passwordIssues = PasswordValidate(doc.password);

		if (passwordIssues.length !== 0) {
			throw new Error(
				`Password must be stronger!, missing ${passwordIssues.join(
					',',
				)}`,
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
            ): User

            updateOneUser(
                _id: ID!
                name: String
                email: String
                password: String
            ): User @auth(scope:"users:write")

            deleteOneUser(
                _id: ID!
			): Boolean @auth(scope:"users:delete")
			
			login(
				email: String!
				password: String!
			): LoginReturn
        }
    `,
	resolvers: {
		Query: {
			findOneUser: findOne('Users'),
			paginateUsers: paginate('Users'),
		},
		Mutation: {
			insertOneUser: insertOne('Users', {
				transformDoc: hashUserPassword,
			}),
			updateOneUser: updateOne('Users', {
				transformDoc: hashUserPassword,
			}),
			deleteOneUser: deleteOne('Users'),
			login: async (_, args, context) => {
				const { PasswordCompare, Users, JWTSign } = context;
				const { email, password } = args;
				const user = await Users.findOne({
					email,
				});
				let isLoggedIn = false;

				if (!user) {
					throw new Error('Wrong email / password.');
				}

				try {
					isLoggedIn = PasswordCompare(password, user.password);
				} catch (error) {
					console.error(error);
					throw new Error('Wrong email / password.');
				}

				if (!isLoggedIn) {
					throw new Error('Wrong email / password.');
				}

				return {
					user,
					token: JWTSign({
						sub: user._id,
						user: {
							name: user.name,
							email: user.email,
						},
					}),
				};
			},
		},
	},
};

export default UsersModule;
