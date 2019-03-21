import React from 'react';
import { render } from 'react-dom';

function StartClient() {
	render(
		<div>
			<h1>UPDATED YA!</h1>
		</div>,
		document.getElementById('root'),
	);
}

export { StartClient };
