import { CheckCommand, complete } from 'cli/util';
import { CreateContext } from 'server/context';

const name = 'users:create';
const description = 'create a new user';

function describe(yargs) {
	const argv = yargs
		.usage(
			'usage: $0 --email email@example.com --name "Test Testerson" --password "@SuperSecure42"',
		)
		.option('email', {
			alias: 'e',
			describe: 'Users email',
			demandOption: true,
		})
		.option('password', {
			alias: 'p',
			describe: 'Users password',
			demandOption: true,
		})
		.option('name', {
			alias: 'n',
			describe: 'Users full name',
			demandOption: true,
		}).argv;

	CheckCommand(yargs, argv, 1);
}

async function callback(argv) {
	const { email, password, name } = argv;

	const context = await CreateContext();
	const { Users, GenerateId, PasswordHash } = context;

	const user = {
		_id: GenerateId(),
	};

	/*
	const user = await Users.insertOne({
		name,
		email,
		//password,
	});
	*/
	console.log('PasswordHash:', PasswordHash(password));
	console.log(
		`User with id: "${user &&
			user._id}" created, and email with login information has been sent`,
	);

	complete();
}

const CreateUserCommand = [name, description, describe, callback];

export default CreateUserCommand;
