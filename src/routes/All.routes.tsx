import DashboardLayout from '@/layouts/DashboardLayout';
import MainLayout from '@/layouts/MainLayout';
import ForgotPassword from '@/pages/ForgotPassword';
import NotFound from '@/pages/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import { dashboardRoutePaths } from './Dashboard.routes';
import { mainRoutePaths } from './Main.routes';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: mainRoutePaths,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: dashboardRoutePaths,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
