import PasswordValidator from 'password-validator';

const passwordSchema = new PasswordValidator();

passwordSchema
	.is()
	.min(8)
	.is()
	.max(100)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits();

export { passwordSchema, PasswordValidator };
