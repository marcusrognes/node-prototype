import { StartClient } from './client.js';

StartClient();

if (module.hot) {
	module.hot.accept('./client.js', function() {
		console.log('WAT');
		StartClient();
	});
}
