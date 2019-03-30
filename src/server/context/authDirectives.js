import { SchemaDirectiveVisitor } from 'graphql-tools';

const checkScope = (requiredScope, userScopeArray) => {
	for (let key in userScopeArray) {
		if (
			new RegExp(
				'^' + userScopeArray[key].split('*').join('.*') + '$',
			).test(requiredScope)
		) {
			return true;
		}
	}

	return false;
};

class AuthDirective extends SchemaDirectiveVisitor {
	visitObject(type) {
		this.ensureFieldsWrapped(type);

		type._scope = this.args.scope;
	}
	// Visitor methods for nested types like fields and arguments
	// also receive a details object that provides information about
	// the parent and grandparent types.
	visitFieldDefinition(field, details) {
		this.ensureFieldsWrapped(details.objectType);

		field._scope = this.args.scope;
	}

	ensureFieldsWrapped(objectType) {
		// Mark the GraphQLObjectType object to avoid re-wrapping:
		if (objectType._alreadyWrapperd) {
			return;
		}

		objectType._alreadyWrapperd = true;

		const fields = objectType.getFields();

		Object.keys(fields).forEach(fieldName => {
			const field = fields[fieldName];
			const { defaultFieldResolver, resolve } = field;

			field.resolve = async function(...args) {
				// Get the required Role from the field first, falling back
				// to the objectType if no Role is required by the field:
				const scope = field._scope || objectType._scope;
				const context = args[2];

				if (!scope) {
					return (
						(defaultFieldResolver &&
							defaultFieldResolver.apply(this, args)) ||
						(resolve && resolve.apply(this, args))
					);
				}

				if (!context.user) {
					throw new Error('User not logged in');
				}

				let userRoleScopes = roleScopes[context.user.role];

				if (!checkScope(scope, userRoleScopes)) {
					throw new Error('User dont have correct scope');
				}

				return (
					(defaultFieldResolver &&
						defaultFieldResolver.apply(this, args)) ||
					(resolve && resolve.apply(this, args))
				);
			};
		});
	}
}

class RoleDirective extends SchemaDirectiveVisitor {
	visitObject(type) {
		this.ensureFieldsWrapped(type);

		type._roles = this.args.roles;
	}
	// Visitor methods for nested types like fields and arguments
	// also receive a details object that provides information about
	// the parent and grandparent types.
	visitFieldDefinition(field, details) {
		this.ensureFieldsWrapped(details.objectType);

		field._roles = this.args.roles;
	}

	ensureFieldsWrapped(objectType) {
		// Mark the GraphQLObjectType object to avoid re-wrapping:
		if (objectType._alreadyWrapperd) {
			return;
		}

		objectType._alreadyWrapperd = true;

		const fields = objectType.getFields();

		Object.keys(fields).forEach(fieldName => {
			const field = fields[fieldName];
			const { defaultFieldResolver, resolve } = field;

			field.resolve = async function(...args) {
				// Get the required Role from the field first, falling back
				// to the objectType if no Role is required by the field:
				const roles = field._roles || objectType._roles;
				const context = args[2];

				if (!roles) {
					return (
						(defaultFieldResolver &&
							defaultFieldResolver.apply(this, args)) ||
						(resolve && resolve.apply(this, args))
					);
				}

				if (!context.user) {
					throw new Error('User not logged in');
				}

				if (
					!context.user.role ||
					roles.indexOf(context.user.role) === -1
				) {
					throw new Error('User dont have correct role');
				}

				return (
					(defaultFieldResolver &&
						defaultFieldResolver.apply(this, args)) ||
					(resolve && resolve.apply(this, args))
				);
			};
		});
	}
}

export { AuthDirective, RoleDirective, checkScope };
