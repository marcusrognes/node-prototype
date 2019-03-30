import React from 'react';
import styled from 'styled-components';

const ErrorMessageWrapper = styled.div`
	color: red;
	font-weight: 900;
	margin: 25px 0;
`;

export default function ErrorMessage({ children, ...props }) {
	return <ErrorMessageWrapper {...props}>{children}</ErrorMessageWrapper>;
}
