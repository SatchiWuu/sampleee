import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Shared.css'

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'admin/crud/product',
    title: 'Products',
    icon: <ShoppingCartIcon />,
  },

  {
    kind: 'divider',
  },

];


function AdminLayout(props) {
  const { window } = props;

  const navigate = useNavigate();  
  const location = useLocation();  
  
  const router = React.useMemo(() => {
    return {
      pathname: location.pathname,   
      searchParams: new URLSearchParams(location.search), 
      navigate: (path) => navigate(path),  
    };
  }, [location, navigate]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

AdminLayout.propTypes = {

};

export default AdminLayout;
