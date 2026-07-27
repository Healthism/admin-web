import type { ReactNode } from 'react';
import Dashboard from '../pages/dashboard/Dashboard';
import Users from '../pages/users/Users';
import Transactions from '../pages/transactions/Transactions';
import PromoCodes from '../pages/promo-codes/PromoCodes';
import Login from '../pages/login/Login';
import FullProfile from '../pages/fullProfile/FullProfile';
import FeedbackAndWaitlist from '../pages/feedback/FeedbackAndWaitlist';
import PayoutManagement from '../pages/payout-management/PayoutManagement';
import SubscriptionPlans from '../pages/subscription-plans/SubscriptionPlans';
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
  },
  {
    path: '/feedback',
    element: <ProtectedRoute><FeedbackAndWaitlist /></ProtectedRoute>,
  },
  {
    path: '/payout-management',
    element: <ProtectedRoute><PayoutManagement /></ProtectedRoute>,
  },
  {
    path: '/subscription-plans',
    element: <ProtectedRoute><SubscriptionPlans /></ProtectedRoute>,
  }, {
    path: '/profile',
    element: <ProtectedRoute><FullProfile /></ProtectedRoute>,
  },

];
