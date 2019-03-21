import { graphqls2s } from 'graphql-s2s';
import { makeExecutableSchema } from 'graphql-tools';
import merge from 'lodash/merge';
import JSONScalar from 'graphql-type-json';

const { transpileSchema } = graphqls2s;

const API_VERSION = '0.0.1';

const baseTypeDefs = `
scalar JSON
scalar DateTime

enum Language {
    nb
    en
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
	typeDefs: transpileSchema(
		baseTypeDefs, //+ require('./Projects.module').typeDefs,
	),
	resolvers: merge(
		baseResolvers, //require('./Projects.module').resolvers

		{ JSON: JSONScalar },
	),
	schemaDirectives: {},
});

export default schema;
