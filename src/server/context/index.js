import uuid from 'uuid/v1';
import { MongoClient } from 'mongodb';
import Redis from 'async-redis';
import Bcrypt from 'bcrypt';
import { passwordSchema } from 'server/context/passwordValidator';
import JWT from 'jsonwebtoken';
import i18next from 'i18next';
import en from 'server/i18n/en.json';
import nb from 'server/i18n/nb.json';

const DATABASE_URL = process.env.MONGODB_URI || process.env.MONGO_URL;

const languagesT = {
	nb: i18next.getFixedT('nb'),
	en: i18next.getFixedT('en'),
};

i18next.init({
	fallbackLng: 'en',
	resources: {
		en: {
			translation: en,
		},
		nb: {
			translation: nb,
		},
	},
});

export async function CreateContext() {
	const MongoDbClient = await MongoClient.connect(DATABASE_URL, {
		useNewUrlParser: true,
	});

	const MongoDB = MongoDbClient.db();

	return {
		MongoDB,
		Redis,
		i18next,
		languagesT,
		GenerateId: uuid,
		PasswordHash: password => Bcrypt.hashSync(password, 10),
		PasswordCompare: (password, hash) => Bcrypt.compareSync(password, hash),
		PasswordValidate: password =>
			passwordSchema.validate(password, { list: true }),
		JWTSign: (data, options) => {
			return JWT.sign(data, process.env.JWT_SALT, {
				expiresIn: '14d',
				...options,
			});
		},
		JWTVerify: token => {
			return JWT.verify(token, process.env.JWT_SALT);
		},
		Users: MongoDB.collection('Users'),
	};
}
