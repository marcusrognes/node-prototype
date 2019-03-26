import React from 'react';
import { Route } from 'react-router-dom';
import UserRoutes from 'client/routes/users/index';

export default function Routes() {
	return <Route path="/users" component={UserRoutes} />;
}
