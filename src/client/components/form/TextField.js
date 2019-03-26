import React, { useEffect, useContext } from 'react';
import MUITextField from '@material-ui/core/TextField';

import { FormContext } from 'client/components/form';

export default function TextField(props) {
	const context = useContext(FormContext);
	useEffect(() => {
		context.registerField(props);
	}, [props.name]);
	const {
		name,
		validate,
		defaultValue,
		fullWidth = true,
		onChange,
		...inputProps
	} = props;
	let value = context.values[name] || defaultValue || '';
	let disabled = context.disabled;

	return (
		<MUITextField
			margin="normal"
			defaultValue={value}
			disabled={disabled}
			fullWidth={fullWidth}
			onChange={e => context.onChange(e.target.value, name)}
			{...inputProps}
		/>
	);
}
