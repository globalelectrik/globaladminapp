import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/tailwind.css';
import './styles/main.css';

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './services/MSAuthService';

import { AuthContextProvider } from './context/AuthContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadingContextProvider } from './context/LoadingContext/LoadingContext.jsx';
import { QueryClientProvider, QueryClient } from 'react-query';

const msalInstance = new PublicClientApplication(msalConfig);
const queryClient = new QueryClient();

(async () => {
  await msalInstance.initialize(); // ✅ Required in MSAL.js v3+
  await msalInstance.handleRedirectPromise(); // ✅ Wait for redirect resolution

  ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LoadingContextProvider>
          <MsalProvider instance={msalInstance}>
            <Router>
              <AuthContextProvider>
                <App />
              </AuthContextProvider>
            </Router>
          </MsalProvider>
        </LoadingContextProvider>
      </QueryClientProvider>
    </StrictMode>
  );
})();
