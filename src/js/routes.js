import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Auth from './containers/auth/auth';
import CheckAuth from './containers/auth/check-auth';
import Sprints from './containers/sprints';
import Chart from './components/chart';
import Positions from './components/positions';

const AuthenticatedRoute = CheckAuth('login', (isAuth) => !isAuth);
const UnauthenticatedRoute = CheckAuth('trade', (isAuth) => isAuth)(Auth);

export default (
  <Route path="/" component={App}>
    <IndexRoute component={UnauthenticatedRoute} />
    <Route path="positions" component={Positions} />
    <Route path="login" component={UnauthenticatedRoute} />
    <Route path="trade" component={AuthenticatedRoute(Sprints)} />
  </Route>
);
