import { BrowserRouter, Route, Routes } from 'react-router-dom';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import ConnectWallet from './pages/ConnectWallet';

import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import BondPage from './pages/BondPage';
import BondDetail from './pages/BondDetail';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import CreateBondPage from './pages/CreateBondPage';
import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <Routes>
        <Route index element={<ConnectWallet />} />
        <Route path="app" element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardAppPage />} />
          <Route path="bonds" element={<BondPage />} />
          <Route path="bonds/:id" element={<BondDetail />} />
          <Route path="createBond" element={<CreateBondPage />} />
          <Route path="blog" element={<BlogPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
