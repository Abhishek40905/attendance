import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
   {/* <GoogleOAuthProvider clientId="932567518114-tbeoeo69o06do755s79s6ktudfomo7bv.apps.googleusercontent.com">
   </GoogleOAuthProvider> */}
   <App />
  </StrictMode>
);
