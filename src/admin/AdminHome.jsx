import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import RequestCard from "../components/RequestCard";
import AdminHeader from "../layout/AdminHeader";

const AdminHome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // NEW STATE
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "requests"));
      const requestsList = [];
      querySnapshot.forEach((doc) => {
        requestsList.push({ ...doc.data(), id: doc.id });
      });
      setRequests(requestsList);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const requestRef = doc(db, "requests", id);
    await updateDoc(requestRef, {
      status: action,
    });

    setRequests((prev) => prev.filter((request) => request.id !== id));

    if (action === "Accepted") {
      setSnackbarMessage("Request Accepted!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage("Request Denied!");
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 2000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getDefaultValue = (value, defaultValue) => {
    return value && value.trim() !== "" ? value : defaultValue;
  };

  // Filter and sort requests
  const filteredRequests = requests
    .filter(
      (request) =>
        request.resourceName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.requesterName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aTime = a.timestamp?.seconds || 0;
      const bTime = b.timestamp?.seconds || 0;
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="mx-auto px-4 py-10 space-y-10">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl font-bold text-blue-500"
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body2"
            className="text-sm sm:text-base text-gray-600 italic"
          >
            A single place to track, approve, and take charge of all service
            requests.
          </Typography>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <TextField
            label="Search Requests"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white ml-auto"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Sort by Time"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ minWidth: 180 }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </TextField>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests
              .filter((request) => request.status !== "Accepted")
              .map((request) => (
                <RequestCard
                  key={request.id}
                  request={{
                    ...request,
                    resourceName: getDefaultValue(
                      request.resourceName,
                      "No Resource Name"
                    ),
                    requesterName: getDefaultValue(
                      request.requesterName,
                      "Unknown Requester"
                    ),
                    status: getDefaultValue(request.status, "Pending"),
                  }}
                  handleAction={handleAction}
                  formatTimestamp={formatTimestamp}
                />
              ))}
          </div>
        )}

        {/* Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AdminHome;
