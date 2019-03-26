import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const Login = lazy(() => import('client/routes/users/login'));

export default function LoggedOutRoutes() {
	return <Route exact path="/" component={Login} />;
}
