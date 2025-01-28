import { useContext } from 'react';
import { Navigate, Route, Routes, redirect } from 'react-router-dom';

import Slidebar from './components/Slidebar/Slidebar';
import Dashboard from './pages/Dashboard/Dashboard';

import LoadingContext from './context/LoadingContext/LoadingContext';
import LoadingSpin from './components/LoadingSpin/LoadingSpin';

import Login from './pages/Login/Login.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import OrdersListRoute from './pages/Orders/OrdersList/route/OrdersListRoute.jsx';
import { useAuthContext } from './context/AuthContext.jsx';
import CreateOrderRoute from './pages/Orders/CreateOrder/route/CreateOrderRoute.jsx';
import CreateMaterialRoute from './pages/Materials/CreateMaterial/route/CreateMaterialRoute.jsx';
import ConfigurationsListRoute from './pages/Configurations/ConfigurationsList/route/ConfigurationsListRoute.jsx';
import ClientsListRoute from './pages/Clients/ClientsList/route/ClientsListRoute.jsx';
import CreateClientRoute from './pages/Clients/CreateClient/route/CreateClientRoute.jsx';
import ClientDetailRoute from './pages/Clients/ClientDetail/route/ClientDetailRoute.jsx';


function App() {
  const { isLoadingContext } = useContext(LoadingContext);

  return (
    <>
      {isLoadingContext ? <LoadingSpin /> : null}

      <Slidebar>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute>
                <OrdersListRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders/newOrder'
            element={
              <ProtectedRoute>
                <CreateOrderRoute />
              </ProtectedRoute>
            }
          />
             <Route
            path='/clients'
            element={
              <ProtectedRoute>
                <ClientsListRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/clients/createClient'
            element={
              <ProtectedRoute>
                <CreateClientRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/clients/clientDetail/:id'
            element={
              <ProtectedRoute>
                <ClientDetailRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path='/material/createMaterial'
            element={
              <ProtectedRoute>
                <CreateMaterialRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/configurations'
            element={
              <ProtectedRoute>
                <ConfigurationsListRoute />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Slidebar>
    </>
  );
}
export default App;
