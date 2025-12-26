import type { ReactNode } from 'react';
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/users/Users';
import Transactions from '../pages/transactions/Transactions';
import PromoCodes from '../pages/promo-codes/PromoCodes';
import Login from '../pages/login/Login';
import FullProfile from '../pages/fullProfile/FullProfile';
import ProtectedRoute from './ProtectedRoute'

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
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/users',
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  }, {
    path: '/transactions',
    element: <ProtectedRoute><Transactions /></ProtectedRoute>,
  },
  {
    path: '/promo-codes',
    element: <ProtectedRoute><PromoCodes /></ProtectedRoute>,
  }, {
    path: '/profile',
    element: <ProtectedRoute><FullProfile /></ProtectedRoute>,
  },

];
