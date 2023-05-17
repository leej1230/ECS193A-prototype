import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app'
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const redirectUri = `${window.location.origin}/console`


root.render(
  // <React.StrictMode>
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: redirectUri,
    }}

  >

    <App />
  </Auth0Provider>
  // </React.StrictMode>
);