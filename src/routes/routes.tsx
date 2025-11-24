import type { ReactNode } from 'react';
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/users/Users';
import Transactions from '../pages/transactions/Transactions';
import PromoCodes from '../pages/promo-codes/PromoCodes';
import Login from '../pages/login/Login';

export interface AppRoute {
  path: string;
  element: ReactNode;
}
export const routes: AppRoute[] = [

  {
    path: '/login',
    element: <Login />,
  },  
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/users',
    element: <Users />,
  }, 
   {
    path: '/transactions',
    element: <Transactions />,
  }, {
    path: '/transactions',
    element: <Transactions />,
  },
  {
    path: '/promo-codes',
    element: <PromoCodes />,
  },
];
