import React, { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const CreateUser = lazy(() => import('client/routes/users/create'));
const EditUser = lazy(() => import('client/routes/users/edit'));
const UsersArchive = lazy(() => import('client/routes/users/archive'));

export default function UserRoutes({ match }) {
	return (
		<Switch>
			<Route exact path={match.url} component={UsersArchive} />
			<Route exact path={`${match.url}/create`} component={CreateUser} />
			<Route exact path={`${match.url}/:_id`} component={EditUser} />
		</Switch>
	);
}
