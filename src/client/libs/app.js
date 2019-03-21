import React, { createContext, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

export const AppContext = createContext({
	appName: 'Prototype',
	isMobile: false,
});

export default function AppProvider({ appName = 'Prototype', children }) {
	let [isMobile, setIsMobile] = useState(window.innerWidth < 601);

	function onResize(e) {
		setIsMobile(window.innerWidth < 601);
	}

	useEffect(() => {
		window.addEventListener('resize', debounce(onResize, 150));
	}, [false]);

	return (
		<AppContext.Provider
			value={{
				appName,
				isMobile,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
