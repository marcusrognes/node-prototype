import React from 'react';
import { render } from 'react-dom';
import AppLayout from './components/layouts/App';

function StartClient() {
	render(
		<AppLayout>
			<h1>UPDATED YA!</h1>
		</AppLayout>,
		document.getElementById('root'),
	);
}

export { StartClient };
