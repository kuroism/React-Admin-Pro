import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import { MainLayout } from '@/layouts/main-layout'
import { PublicRoute } from '@/components/public-route'
import { ProtectedRoute } from '@/components/protected-route'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/login'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))
const RolesPage = lazy(() => import('@/pages/roles'))
const UsersPage = lazy(() => import('@/pages/users'))

// Create router with Data Router pattern
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/roles',
        element: <RolesPage />,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
    ],
  },
])
