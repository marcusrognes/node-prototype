import { graphqls2s } from 'graphql-s2s';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLScalarType } from 'graphql';
import merge from 'lodash/merge';
import JSONScalar from 'graphql-type-json';
import UsersModule from 'server/schema/Users.module';

const { transpileSchema } = graphqls2s;

const API_VERSION = '0.0.1';

export const DateTime = new GraphQLScalarType({
	name: 'DateTime',
	description: 'Resolves to javascript date object',
	serialize(value) {
		return (value && new Date(value)) || null;
	},
	parseValue(value) {
		return new Date(value);
	},
	parseLiteral(ast) {
		return new Date(ast.value);
	},
});

const baseTypeDefs = `
scalar JSON
scalar DateTime

enum Language {
    nb
    en
}

type Paginate<T> {
	items: [T]
    count: Int
}

type Document {
    _id: ID
    createdAt: DateTime
    updatedAt: DateTime
    createdBy: ID
    updatedBy: ID
}

type Query {
    apiVersion: String!
}

type Mutation {
	checkTime: String!
}
`;

const baseResolvers = {
	Query: {
		apiVersion: () => API_VERSION,
	},
	Mutation: {
		checkTime: () => new Date(),
	},
};

const schema = makeExecutableSchema({
	typeDefs: transpileSchema(baseTypeDefs + UsersModule.typeDefs),
	resolvers: merge(baseResolvers, UsersModule.resolvers, {
		JSON: JSONScalar,
		DateTime,
	}),
	schemaDirectives: {},
});

export default schema;
