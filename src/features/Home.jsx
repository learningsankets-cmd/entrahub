import React, { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import ServiceCard from "../components/ServiceCard";
import {
  Typography,
  Snackbar,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MuiAlert from "@mui/material/Alert";
import { ThreeDots } from "react-loader-spinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const account = accounts[0];

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["Directory.Read.All"],
          account,
        });
        const token = response.accessToken;

        const graphRes = await fetch(
          "https://graph.microsoft.com/v1.0/me/memberOf",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await graphRes.json();

        const roles =
          data.value
            ?.filter(
              (r) => r["@odata.type"] === "#microsoft.graph.directoryRole"
            )
            .map((r) => r.displayName?.toLowerCase()) || [];

        if (roles.includes("global administrator")) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Role check failed:", error);
      }
    };

    if (isAuthenticated && account) {
      checkRoleAndRedirect();
    }
  }, [isAuthenticated, account, instance, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;

      try {
        const serviceSnap = await getDocs(collection(db, "serviceData"));
        const requestSnap = await getDocs(collection(db, "requests"));

        const userRequests = requestSnap.docs
          .filter((doc) => doc.data().userId === account.username)
          .map((doc) => doc.data().servicePath);

        const services = serviceSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((service) => !userRequests.includes(service.path));

        setServices(services);
        setFilteredServices(services);
        setIsPageLoaded(true);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchData();
  }, [account]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = services.filter(
      (service) =>
        service.title?.toLowerCase().includes(value) ||
        service.description?.toLowerCase().includes(value)
    );

    setFilteredServices(filtered);
  };

  const handleRequestClick = async (path, e) => {
    e.preventDefault();
    try {
      setIsRequesting(true);
      setRequestStatus("Checking existing requests...");

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
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <Typography variant="h4" className="text-blue-600 font-semibold">
            EntraHub Dashboard
          </Typography>
          <Typography
            variant="body2"
            className="text-sm sm:text-base text-gray-600 italic"
          >
            {" "}
            Seamlessly explore and access enterprise services tailored for you.{" "}
          </Typography>
        </div>

        <div className="flex justify-center max-w-lg mx-auto">
          <TextField
            variant="outlined"
            placeholder="Search services..."
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {requestStatus && (
          <div className="text-center p-2 text-sm text-gray-600">
            {requestStatus}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div key={service.id} className="">
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  onClick={(e) => handleRequestClick(service.path, e)}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isRequesting}
                    fullWidth
                  >
                    {isRequesting ? "Request Sent" : "Send Request"}
                  </Button>
                </ServiceCard>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 ">
              <Typography variant="body1">
                No services found matching your search.
              </Typography>
            </div>
          )}
        </div>

        {isRequesting && (
          <div className="flex justify-center mt-4">
            <ThreeDots
              height="60"
              width="60"
              color="#1976D2"
              ariaLabel="three-dots-loading"
            />
          </div>
        )}

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
