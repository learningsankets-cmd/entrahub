import React from "react";
import { createRoot } from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID, // Use Vite env variable
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID
    }`, // Use Vite env variable
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI, // Use Vite env variable
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const pca = new PublicClientApplication(msalConfig);

const root = createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={pca}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>
);
