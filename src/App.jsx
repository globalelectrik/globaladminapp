import { useContext } from 'react';
import { Navigate, Route, Routes, redirect } from 'react-router-dom';

import Slidebar from './components/Slidebar/Slidebar';
import Dashboard from './pages/Dashboard/Dashboard';

import LoadingContext from './context/LoadingContext/LoadingContext';
import LoadingSpin from './components/LoadingSpin/LoadingSpin';

import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import OrdersRoute from './pages/Orders/OrdersLis/route/OrdersListRoute';



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
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute>
                <OrdersRoute />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Slidebar>
    </>
  );
}
export default App;
