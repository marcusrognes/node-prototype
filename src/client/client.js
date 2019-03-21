import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import 'client/libs/i18n';
import apollo from 'client/libs/apollo';
import AppProvider from 'client/libs/app';
import Routes from 'client/routes/index';

const theme = createMuiTheme({
	palette: {
		primary: { main: process.env.REACT_APP_COLOR_PRIMARY || '#64b5f6' },
		secondary: { main: process.env.REACT_APP_COLOR_SECONDARY || '#ff8a65' },
	},
	typography: { useNextVariants: true },
	logoUrl: process.env.REACT_APP_LOGO_URL || '/React-icon.svg',
	background: '#eeeeee',
	border: '1px solid rgba(0, 0, 0, 0.12)',
}); // @see: https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=64B5F6&secondary.color=FF8A65

function StartClient() {
	render(
		<BrowserRouter>
			<ApolloProvider client={apollo}>
				<ThemeProvider theme={theme}>
					<MuiThemeProvider theme={theme}>
						<AppProvider>
							<Routes />
						</AppProvider>
					</MuiThemeProvider>
				</ThemeProvider>
			</ApolloProvider>
		</BrowserRouter>,
		document.getElementById('root'),
	);
}

export { StartClient };
