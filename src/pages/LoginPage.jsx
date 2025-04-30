import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Link,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Header from "../layout/Header";

const LoginPage = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent multiple redirects

  useEffect(() => {
    // Check authentication status and navigate only if needed
    if (isAuthenticated && accounts.length > 0 && window.location.pathname !== "/home" && !isRedirecting) {
      setIsRedirecting(true);
      navigate("/home");
    }
  }, [isAuthenticated, accounts, navigate, isRedirecting]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loginRequest = {
        scopes: ["User.Read"],
        prompt: "select_account", // Always prompt to select an account
      };
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Handle the redirect response after a loginRedirect
    const checkForRedirectResponse = async () => {
      const response = await instance.handleRedirectPromise();
      if (response) {
        console.log("Login successful", response);
        // You can perform actions after successful login
      }
    };
    checkForRedirectResponse();
  }, [instance]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppBar
           position="static"
           className="h-24 !bg-white shadow-sm"
           sx={{ minHeight: { xs: "64px", sm: "80px", md: "96px" } }}
         >
           <Toolbar className="container">
             <Box className="flex items-center cursor-pointer">
               <img
                 src="logo1.png"
                 alt="EntraHub Logo"
                 className="h-52 w-max object-contain"
               />
             </Box>
           </Toolbar>
         </AppBar>
      <main className="flex-1 flex items-center justify-center">
        <section className="bg-white rounded-md p-4 flex flex-col items-center justify-center gap-4 sm:gap-6 w-max text-center shadow-lg">
          <Box className="space-y-2 sm:space-y-3">
            <Typography
              variant="h3"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-violet-600"
            >
              Welcome to EntraHub
            </Typography>
            <Typography
              variant="body1"
              className="mx-auto max-w-[90%] sm:max-w-[600px] text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl"
            >
              Your self-service portal for managing enterprise resources
            </Typography>
          </Box>

          <Box className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {isLoading ? (
              <CircularProgress size={32} />
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={isLoading}
                endIcon={<ArrowRightIcon />}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Login with Azure Entra ID
              </Button>
            )}
          </Box>

          {error && (
            <Typography
              variant="body2"
              className="text-red-500 mt-3 text-sm sm:text-base"
            >
              {error}
            </Typography>
          )}

          <Box className="mx-auto mt-4 sm:mt-6 max-w-[90%] sm:max-w-md text-gray-600">
            <Typography variant="body2" className="text-xs sm:text-sm">
              By logging in, you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-blue-600"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-of-service"
                className="underline hover:text-blue-600"
              >
                Terms of Service
              </Link>
              .
            </Typography>
          </Box>
        </section>
      </main>

      <div className="!bg-gray-100 py-4">
        <Box className="container mx-auto flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4 px-4 sm:px-6 lg:px-8 text-center">
          <Typography
            variant="body2"
            className="text-xs sm:text-sm text-gray-600"
          >
            © {new Date().getFullYear()} EntraHub. All rights reserved.
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
