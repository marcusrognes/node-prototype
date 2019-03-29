import uuid from 'uuid/v1';
import { MongoClient } from 'mongodb';
import Redis from 'async-redis';
import Bcrypt from 'bcrypt';

const DATABASE_URL = process.env.MONGODB_URI || process.env.MONGO_URL;

export async function CreateContext() {
	const MongoDbClient = await MongoClient.connect(DATABASE_URL, {
		useNewUrlParser: true,
	});

	const MongoDB = MongoDbClient.db();

	return {
		MongoDB,
		Redis,
		GenerateId: uuid,
		PasswordHash: password => Bcrypt.hashSync(password, 10),
		PasswordCompare: (password, hash) => Bcrypt.compareSync(password, hash),
		Users: MongoDB.collection('Users'),
	};
}
