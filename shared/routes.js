import App from './App';
import { Home } from './home';
import NotFound from './NotFound';
import Forgot from './forgot';

import loadData from './helpers/loadData';
import { Dashboard } from '../client/components/dashboard';
import { Login } from '../client/components/login';

const Routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/dashboard/',
    strict: true,
    component: Dashboard
  },
  {
    path: '/home',
    exact: true,
    component: Home
  },
  {
    path: '/forgot',
    component: Forgot
  },
  {
    path: '/login',
    component: Login
  },
  {
    component: NotFound
  }
]

export default Routes;