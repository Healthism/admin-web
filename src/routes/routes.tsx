import type { ReactNode } from 'react';
import Dashboard from '../pages/dashboard/Dashboard';

export interface AppRoute {
  path: string;
  element: ReactNode;
}
export const routes: AppRoute[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dashbord',
    element: <Dashboard />,
  },
];
