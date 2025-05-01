import React, { useState, useEffect } from "react";
import { db } from "../services/firebase"; // Assuming you've exported your firebase setup
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import AdminHeader from "../layout/AdminHeader";

// AllRequests Component to fetch and display requests
function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch requests from Firestore
  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "requests"));
      const requestsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <AdminHeader />

      {/* Table to display requests */}
      <div className="overflow-x-auto p-6">
        {loading ? (
          <Typography variant="h6">Loading requests...</Typography>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
              <Typography
                variant="h3"
                className="text-2xl sm:text-3xl font-bold text-blue-500"
              >
                All Requests
              </Typography>
              <Typography
                variant="body2"
                className="text-sm sm:text-base text-gray-600 italic"
              >
                View and track all service requets.
              </Typography>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-semibold">
                      Resource Name
                    </TableCell>
                    <TableCell className="font-semibold">User</TableCell>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell className="font-semibold">
                      Service Path
                    </TableCell>
                    <TableCell className="font-semibold">
                      Requested On
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.resourceName || "Request"}</TableCell>
                      <TableCell>{request.userId}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>{request.servicePath}</TableCell>
                      <TableCell>
                        {new Date(
                          request.timestamp.seconds * 1000
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRequests;
