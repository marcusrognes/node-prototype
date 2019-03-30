import React, { useState, createContext } from 'react';
import styled from 'styled-components';

const HiddenSubmit = styled.input`
	position: absolute;
	left: -9999px;
	width: 1px;
	height: 1px;
`;

export const FormContext = createContext({
	values: {},
	fields: {},
	errors: {},
});

export default function Form({
	children,
	onSubmit,
	onChange,
	disabled,
	...props
}) {
	let [values, setValues] = useState(props.values || {});
	let [fields, setFields] = useState({});
	let [errors, setErrors] = useState({});

	const [ref, setRef] = useState(null);

	function transformAndValidateFields(values, fields) {
		let errors = {};
		let hasErrors = false;
		let fieldKeys = Object.keys(fields);

		fieldKeys.forEach(key => {
			let field = fields[key];

			if (field.required && !values[key]) {
				hasErrors = true;
				errors[key] = 'This field is required'; // TODO: Use translations
			}

			if (field.validate) {
				let { value, error } = field.validate(values[key]);

				if (error) {
					errors[key] = error;
					hasErrors = true;
				}

				values[key] = value;
			}
		});

		if (!hasErrors) {
			errors = null;
		}

		return { errors, values };
	}

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();

				({ values, errors } = transformAndValidateFields(
					values,
					fields,
				));

				setErrors(errors);

				if (errors) {
					return;
				}

				onSubmit && onSubmit(values);
			}}
			ref={setRef}
		>
			<FormContext.Provider
				value={{
					values,
					fields,
					errors,
					formElement: ref,
					disabled,
					registerField: field => {
						setFields({
							...fields,
							[field.name]: field,
						});
					},
					onChange: (value, name) => {
						values[name] = value;
						setValues(values);
						onChange && onChange(values);
					},
				}}
			>
				<HiddenSubmit type="submit" />
				{children}
			</FormContext.Provider>
		</form>
	);
}
