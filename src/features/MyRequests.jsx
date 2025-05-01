import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import Header from "../layout/Header";
import ResourceTable from "../components/ResourceTable";
import { Typography } from "@mui/material";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const account = accounts[0];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("userId", "==", account.username),
          orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            resourceName: d.resourceName,
            status: d.status,
            dateRequested: d.timestamp?.toDate().toISOString().split("T")[0],
          };
        });

        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
        // Optional: show error UI or fallback
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchRequests();
  }, [account.username, isAuthenticated]);

  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => console.error(e));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl font-bold text-blue-500"
          >
            My Requests
          </Typography>
          <Typography
            variant="body2"
            className="text-sm sm:text-base text-gray-600"
          >
            View and track your submitted service requets.
          </Typography>
        </div>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <Typography className="text-center text-gray-600">
              Loading...
            </Typography>
          ) : requests.length === 0 ? (
            <Typography className="text-center text-gray-600">
              No requests available.
            </Typography>
          ) : (
            <ResourceTable requests={requests} />
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRequests;
