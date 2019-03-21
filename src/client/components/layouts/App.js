import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
`;

export default function AppLayout({ children }) {
	return <Wrapper>{children}</Wrapper>;
}
