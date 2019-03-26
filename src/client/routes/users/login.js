import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled, { withTheme } from 'styled-components';

import BlankLayout from 'client/components/layouts/Blank';
import Form from 'client/components/form/index';
import TextField from 'client/components/form/TextField';
import ScrollPane from 'client/components/ScrollPane';
import SubmitButton from 'client/components/form/SubmitButton';

const Wrapper = styled(ScrollPane)`
	text-align: center;
`;

const StyledGrid = styled(Grid)`
	height: 100vh;
`;

const LeftGrid = styled(StyledGrid)`
	background: ${({ theme }) => theme.palette.primary.light};
	@media (max-width: ${({ theme }) => theme.breakpoints.values.sm}px) {
		height: calc(100vh - 50px);
	}
`;

const Logo = styled(
	withTheme(({ theme, ...props }) => <img {...props} src={theme.logoUrl} />),
)`
	width: 150px;
`;

export default function Login() {
	return (
		<BlankLayout>
			<Wrapper>
				<StyledGrid container>
					<LeftGrid
						xs={12}
						sm={6}
						alignItems="center"
						justify="center"
						direction="row"
						container
						item
					>
						<Grid item>
							<div>
								<Logo />
							</div>
						</Grid>
					</LeftGrid>
					<StyledGrid
						xs={12}
						sm={6}
						alignItems="center"
						justify="center"
						direction="row"
						container
						item
					>
						<Grid item>
							<h1>Login</h1>
							<Form
								onSubmit={values => {
									console.log(values);
								}}
							>
								<TextField
									name="email"
									type="email"
									label="E-post"
									required
								/>

								<TextField
									name="password"
									type="password"
									label="Passord"
									required
								/>

								<SubmitButton fullWidth>Login</SubmitButton>
								<a href="#">Glemt passord</a>
							</Form>
						</Grid>
					</StyledGrid>
				</StyledGrid>
			</Wrapper>
		</BlankLayout>
	);
}
