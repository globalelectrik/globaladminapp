import { useContext } from 'react';
import { Navigate, Route, Routes, redirect } from 'react-router-dom';
import Main from './pages/Main/Main';
import Slidebar from './components/Slidebar/Slidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Orders from './pages/Orders/OrderList/OrdersList';
import LoadingContext from './context/LoadingContext/LoadingContext';
import LoadingSpin from './components/LoadingSpin/LoadingSpin';
import NewOrder from './pages/Orders/NewOrder/NewOrder';
import NewDiscount from './pages/Discounts/NewDiscount/NewDiscount';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Discounts from './pages/Discounts/Discounts';
import EditDiscount from './pages/Discounts/EditDiscount/EditDiscount';
import { DashboardContextProvider } from './context/DashboardContext/DashboardContext';
import OrderDetail from './pages/Orders/OrderDetail/OrderDetail';
import { OrderCartContextProvider } from './context/OrderCartContext/OrderCartContext';
import CreateOrderRoute from './pages/Orders/CreateOrder/route/CreateOrderRoute';
import InfoManagement from './pages/InfoManagement/views/InfoManagementView';

function App() {
  const { isLoadingContext } = useContext(LoadingContext);

  return (
    <>
      {isLoadingContext ? <LoadingSpin /> : null}

      <Slidebar>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DashboardContextProvider>
                  <Dashboard />
                </DashboardContextProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Slidebar>
    </>
  );
}
export default App;
