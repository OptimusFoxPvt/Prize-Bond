import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
import SimpleLayout from './layouts/simple'
//
import BlogPage from './pages/BlogPage'
import BondPage from './pages/BondPage'
import BondDetail from './pages/BondDetail'
import LoginPage from './pages/LoginPage'
import Page404 from './pages/Page404'
import CreateBondPage from './pages/CreateBondPage'
import DashboardAppPage from './pages/DashboardAppPage'

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'bonds', element: <BondPage /> },
        { path: 'bonds/:id', element: <BondDetail /> },
        { path: 'createBond', element: <CreateBondPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ])

  return routes
}
