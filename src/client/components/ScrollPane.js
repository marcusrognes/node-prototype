import React, { createContext, useState } from 'react';
import styled from 'styled-components';

export const ScrollContext = createContext({ scrollElement: null });

const ScrollElement = styled.div`
	overflow: auto;
	-webkit-overflow-scrolling: touch;
`;

export default function ScrollPane({ children, ...props }) {
	const [ref, setRef] = useState(null);

	return (
		<ScrollElement ref={setRef} {...props}>
			<ScrollContext.Provider
				value={{
					scrollElement: ref,
				}}
			>
				{children}
			</ScrollContext.Provider>
		</ScrollElement>
	);
}
