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
import ContactsListRoute from './pages/Contacts/ContactsList/route/ContactsListRoute.jsx';
import CreateContactRoute from './pages/Contacts/CreateContact/route/CreateContactRoute.jsx';
import OrderDetailRoute from './pages/Orders/OrderDetail/route/OrderDetailRoute.jsx';
import MaterialDetailRoute from './pages/Materials/MaterialDetail/route/MaterialDetailRoute.jsx';
import EditPurchaseDetailsRoute from './pages/Orders/EditPurchaseDetails/route/EditPurchaseDetailsRoute';


function App() {
  const { isLoadingContext } = useContext(LoadingContext);

  return (
    <>
      {isLoadingContext ? <LoadingSpin /> : null}

      <Slidebar>
        <Routes>
          <Route path='/'
           element={<Login />} 

           />
          
          
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


{/* Orders */}

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
            path='/orders/orderDetail/:id'
            element={
              <ProtectedRoute>
                <OrderDetailRoute />
              </ProtectedRoute>
            }
          />

{/* Clients */}

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

{/* Contacts */}
           <Route
            path='/contacts'
            element={
              <ProtectedRoute>
                <ContactsListRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/contacts/newContact'
            element={
              <ProtectedRoute>
                <CreateContactRoute />
              </ProtectedRoute>
            }
          />

{/* Materials */}

          <Route
            path='/materials/materialDetail/:id'
            element={
              <ProtectedRoute>
                <MaterialDetailRoute />
              </ProtectedRoute>
            }
          />


          <Route
            path='/materials/createMaterial'
            element={
              <ProtectedRoute>
                <CreateMaterialRoute />
              </ProtectedRoute>
            }
          />


{/* Configurations */}

          <Route
            path='/configurations'
            element={
              <ProtectedRoute>
                <ConfigurationsListRoute />
              </ProtectedRoute>
            }
          />

{/* Purchases */}

        <Route
            path='/purchases/purchaseDetail/:id'
            element={
              <ProtectedRoute>
                <EditPurchaseDetailsRoute />
              </ProtectedRoute>
            }
          />


        </Routes>
      </Slidebar>
    </>
  );
}
export default App;
