import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import ServiceCard from "../components/ServiceCard";
import {
  ScheduleOutlined,
  SettingsOutlined,
  ShieldOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { Typography, Snackbar, Button } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ThreeDots } from "react-loader-spinner";
import { query, where } from "firebase/firestore";

// Map string icon names to actual components
const iconMap = {
  ScheduleOutlined: ScheduleOutlined,
  SettingsOutlined: SettingsOutlined,
  ShieldOutlined: ShieldOutlined,
  TextSnippetOutlined: TextSnippetOutlined,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const { accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const account = accounts[0];

  // Fetch service data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const serviceSnap = await getDocs(collection(db, "serviceData"));
      const requestSnap = await getDocs(collection(db, "requests"));

      const userRequests = requestSnap.docs
        .filter((doc) => doc.data().userId === account.username)
        .map((doc) => doc.data().servicePath);

      const services = serviceSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          icon: iconMap[doc.data().icon],
        }))
        .filter((service) => !userRequests.includes(service.path)); // Filter out requested services

      setServices(services);
      setIsPageLoaded(true);
    };

    fetchData();
  }, [account.username]);

  const handleRequestClick = async (path, e) => {
    e.preventDefault();

    try {
      setIsRequesting(true);
      setRequestStatus("Checking existing requests...");

      // Check if request already exists
      const q = query(
        collection(db, "requests"),
        where("userId", "==", account.username),
        where("servicePath", "==", path)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setSnackbarMessage("You've already sent a request for this service.");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        setIsRequesting(false);
        return;
      }

      // Proceed to send request
      const service = services.find((s) => s.path === path);
      await addDoc(collection(db, "requests"), {
        userId: account.username,
        servicePath: path,
        resourceName: service?.title || "Unknown",
        status: "Pending",
        timestamp: serverTimestamp(),
      });

      setSnackbarMessage("Request sent successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setIsRequesting(false);
      navigate("/my-requests");
    } catch (error) {
      console.error("Error sending request:", error);
      setSnackbarMessage("Failed to send request.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setIsRequesting(false);
    }
  };
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Header />
      <div className="container space-y-6 p-2">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl font-bold text-blue-400"
          >
            Dashboard
          </Typography>
          <Typography
            variant="body2"
            className="text-sm sm:text-base text-gray-600"
          >
            Welcome to EntraHub. Request and manage your services.
          </Typography>
        </div>

        {requestStatus && (
          <div className="text-center p-2 text-sm text-gray-600">
            {requestStatus}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className="service-card-enter">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  onClick={(e) => handleRequestClick(service.path, e)} // Pass event to prevent refresh
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isRequesting} // Disable button when requesting
                    fullWidth
                  >
                    {isRequesting ? "Request Sent" : "Send Request"}
                  </Button>
                </ServiceCard>
              </div>
            ))
          ) : (
            <Typography className="text-center text-gray-600">
              No services available for request.
            </Typography>
          )}
        </div>

        {isRequesting && (
          <div className="flex justify-center mt-4">
            <ThreeDots
              height="100"
              width="100"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              visible={isRequesting}
            />
          </div>
        )}

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
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
    </div>
  );
};

export default Home;
