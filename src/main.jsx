import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import './styles/tailwind.css';
import './styles/main.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { LoadingContextProvider } from './context/LoadingContext/LoadingContext.jsx';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LoadingContextProvider>
        <AuthContextProvider>
          <Router>
            <App />
          </Router>
        </AuthContextProvider>
      </LoadingContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
