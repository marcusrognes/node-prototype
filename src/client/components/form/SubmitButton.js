import React from 'react';
import Button from '@material-ui/core/Button';
import styled, { css } from 'styled-components';

const StyledButton = styled(Button)`
	${({ fullWidth }) =>
		fullWidth &&
		css(`
		width: 100%;
	`)}
`;

export default function SubmitButton({
	children,
	isLoading,
	disabled,
	variant = 'contained',
	color = 'primary',
	...props
}) {
	return (
		<StyledButton
			disabled={disabled || isLoading}
			variant={variant}
			color={color}
			type="submit"
			{...props}
		>
			{!isLoading && children}
			{isLoading && <span />}
		</StyledButton>
	);
}
