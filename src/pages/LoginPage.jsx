import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { instance, accounts } = useMsal(); // Access MSAL instance and accounts
  const isAuthenticated = useIsAuthenticated(); // Check authentication status
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigate to home page if already authenticated
  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      navigate("/home"); // Redirect to home page after login
    }
  }, [isAuthenticated, accounts, navigate]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loginRequest = {
        scopes: ["User.Read"], // Request the necessary scopes
        prompt: "select_account", // Force account selection
      };

      await instance.loginRedirect(loginRequest); // Use loginRedirect for a seamless flow
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Login with Azure AD</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-gray-600">Logging in...</p>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            Log in with Azure AD
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;