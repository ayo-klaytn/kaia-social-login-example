import React from 'react'
import ReactDOM from 'react-dom/client'
import { Klaytn, KlaytnTestnet } from '@particle-network/chains';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';
import App from './App'

import('buffer').then(({ Buffer }) => {
  window.Buffer = Buffer;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: process.env.REACT_APP_PROJECT_ID,
        clientKey: process.env.REACT_APP_CLIENT_KEY,
        appId: process.env.REACT_APP_APP_ID,
        wallet: {
          visible: true,
          customStyle: {
              supportChains: [Klaytn,KlaytnTestnet],
          }
        }
      }}
    >
    <App />
      </AuthCoreContextProvider>
  </React.StrictMode>
)
