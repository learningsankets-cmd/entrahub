import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Snackbar, Alert } from "@mui/material";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react"; // MSAL hook for authentication
import { db } from "../services/firebase"; // Firebase setup

import { addDoc, collection } from "firebase/firestore";

import AdminHeader from "../layout/AdminHeader";

function NewService() {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePath, setServicePath] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Admin check state
  const [loading, setLoading] = useState(false); // Loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity
  const navigate = useNavigate();

  const { instance, accounts } = useMsal(); // Access MSAL instance and current account

  const account = accounts[0];

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (accounts.length === 0) {
        navigate("/login"); // If no user is logged in, navigate to login
        return;
      }

      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["Directory.Read.All"], // Required scope to read directory roles
          account,
        });

        const token = response.accessToken;

        // Fetch the roles using Microsoft Graph API
        const graphRes = await fetch(
          "https://graph.microsoft.com/v1.0/me/memberOf",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await graphRes.json();

        // Extract roles from the response
        const roles =
          data.value
            ?.filter(
              (r) => r["@odata.type"] === "#microsoft.graph.directoryRole"
            )
            .map((r) => r.displayName?.toLowerCase()) || [];

        // Check if the user is an admin
        if (roles.includes("global administrator")) {
          setIsAdmin(true); // Set admin state
        } else {
          navigate("/home"); // Redirect to home if not an admin
        }
      } catch (error) {
        console.error("Role check failed:", error);
        navigate("/login"); // If role check fails, navigate to login
      }
    };

    if (account) {
      checkRoleAndRedirect();
    } else {
      navigate("/login"); // Ensure navigation to login if no account is found
    }
  }, [account, accounts, instance, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    if (!serviceName || !serviceDescription || !servicePath) {
      setSnackbarSeverity("error");
      setSnackbarMessage("All fields are required.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    const newServiceData = {
      title: serviceName,
      description: serviceDescription,
      path: servicePath,
    };

    try {
      // Push data to Firebase collection 'serviceData'
      const docRef = await addDoc(
        collection(db, "serviceData"),
        newServiceData
      );
      console.log("Document written with ID: ", docRef.id);

      // Reset form after successful submission
      setServiceName("");
      setServiceDescription("");
      setServicePath("");

      setSnackbarSeverity("success");
      setSnackbarMessage("Service created successfully!");
      setOpenSnackbar(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      setSnackbarSeverity("error");
      setSnackbarMessage("Error creating service. Please try again.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <AdminHeader />
      {isAdmin ? (
        <div className="p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
            <Typography
              variant="h3"
              className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
            >
              Craft Your New Service
            </Typography>
            <Typography
              variant="body2"
              className="text-sm sm:text-base text-gray-600 italic"
            >
              Create new customized service request
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Service Name"
              variant="outlined"
              fullWidth
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Service Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Service Path"
              variant="outlined"
              fullWidth
              value={servicePath}
              onChange={(e) => setServicePath(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<ScheduleOutlinedIcon />}
              disabled={loading}
            >
              {loading ? "Creating Service..." : "Create Service"}
            </Button>
          </form>
        </div>
      ) : (
        <Typography variant="h6" color="error">
          You do not have permission to access this page. Please log in as an
          admin.
        </Typography>
      )}

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position the Snackbar at bottom-right
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default NewService;
