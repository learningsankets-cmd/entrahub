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
    redirectUri:
      window.location.hostname === "localhost"
        ? "http://localhost:5173"
        : "https://entra-hub.vercel.app",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const pca = new PublicClientApplication(msalConfig);
console.log("ENV CHECK:", {
  clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
  tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
  redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
});
const root = createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={pca}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MsalProvider>
);
