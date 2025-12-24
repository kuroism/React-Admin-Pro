import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'
import { MainLayout } from '@/layouts/main-layout'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/login'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))

// Create router with Data Router pattern
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        // TODO: Add loader for pre-fetching data
        // loader: async () => {
        //   // Pre-fetch dashboard data
        //   return null
        // },
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
])
