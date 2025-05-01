import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import InfoDialog from "../components/InfoDialog";

const LoginPage = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  // Function to get user roles from Microsoft Graph
  const getUserRoles = async (accessToken) => {
    try {
      const response = await fetch(
        "https://graph.microsoft.com/v1.0/me/memberOf",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("Raw memberOf data:", data);

      if (!data.value) return [];

      const roles = data.value.filter(
        (item) => item["@odata.type"] === "#microsoft.graph.directoryRole"
      );

      return roles.map((role) => role.displayName);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      return [];
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loginRequest = {
        scopes: ["User.Read", "Directory.Read.All"],
        prompt: "select_account",
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
    const checkForRedirectResponse = async () => {
      try {
        const response = await instance.handleRedirectPromise();

        if (response) {
          console.log("Login successful:", response);

          const account = response.account || accounts[0];

          const tokenResponse = await instance.acquireTokenSilent({
            scopes: ["Directory.Read.All"],
            account,
          });

          const accessToken = tokenResponse.accessToken;
          console.log("Access Token:", accessToken);

          const roles = await getUserRoles(accessToken);
          console.log("Fetched Roles:", roles);

          setUserRoles(roles);

          if (roles.some((r) => r.toLowerCase() === "global administrator")) {
            console.log("Redirecting to /admin");
            navigate("/admin");
          } else {
            console.log("Redirecting to /user-details");
            navigate("/home");
          }
        }
      } catch (err) {
        console.error("Error during redirect handling:", err);
        setError("Login failed. Please try again.");
      }
    };

    checkForRedirectResponse();
  }, [instance, accounts, navigate]);

  // Prevent redirect loop if already authenticated
  useEffect(() => {
    if (isAuthenticated && accounts.length > 0 && !isRedirecting) {
      setIsRedirecting(true);
      navigate("/home");
    }
  }, [isAuthenticated, accounts, navigate, isRedirecting]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppBar
        position="sticky"
        Career
        Goals
        className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
      >
        <Toolbar className="container">
          <Box className="flex items-center cursor-pointer">
            <div className="flex">
              <div className="flex flex-col items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Entra<span className="text-yellow-400">Hub</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 italic">
                  Empower your access.
                </p>
              </div>
              <img
                src="/entrahub.svg"
                alt="EntraHub Logo"
                className="h-12 sm:h-12 w-auto object-contain"
              />
            </div>
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
              <button
                onClick={() => setOpenPrivacy(true)}
                className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Privacy Policy
              </button>{" "}
              and{" "}
              <button
                onClick={() => setOpenTerms(true)}
                className="underline text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Terms of Service
              </button>
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

      <InfoDialog
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        title="Privacy Policy"
        content="We collect zero cookies, don’t spy on your clicks, and have no idea what your favorite color is. Your data is respected—because honestly, I don’t even know what to do with it. Built with good vibes and localhost energy."
      />

      <InfoDialog
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        title="Terms of Service"
        content="By using this app, you agree not to summon ancient bugs, break the UI with 1000 tabs, or blame the developer (me) for your life decisions. This project was built with ☕, sleepless nights, and a desire to pad my resume. Use wisely, click responsibly, and may the bugs be ever in your favor."
      />
    </div>
  );
};

export default LoginPage;
