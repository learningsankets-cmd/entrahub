import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Button, Tooltip} from "@mui/material";
import {
  AccountCircle,
  Email,
  Phone,
  Business,
  People,
  ExitToApp,
} from "@mui/icons-material";
import Header from "../layout/Header";
import AdminHeader from "../layout/AdminHeader";

const UserDetails = () => {
  const { accounts, instance } = useMsal();
  const [userProfile, setUserProfile] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (accessToken) => {
    const res = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok ? res.json() : null;
  };

  const fetchUserRoles = async (accessToken) => {
    const res = await fetch("https://graph.microsoft.com/v1.0/me/memberOf", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      console.error("Failed to fetch roles");
      return [];
    }

    const data = await res.json();

    const roles =
      data.value
        ?.filter((r) => r["@odata.type"] === "#microsoft.graph.directoryRole")
        .map((r) => r.displayName) || [];

    return roles;
  };

  useEffect(() => {
    const fetchProfileAndRoles = async () => {
      if (!accounts?.length) return;
      const account = accounts[0];

      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["User.Read", "Directory.Read.All"],
          account,
        });

        const accessToken = response.accessToken;

        const profile = await fetchUserProfile(accessToken);
        const roles = await fetchUserRoles(accessToken);

        console.log(roles);

        setUserProfile(profile);
        setUserRoles(roles);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user profile or roles:", error);
        setLoading(false);
      }
    };

    fetchProfileAndRoles();
  }, [accounts, instance]);

  useEffect(() => {
    console.log("User Roles updated:", userRoles[0]);
  }, [userRoles]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <p>Loading roles...</p> // Show loading state if roles are still being fetched
      ) : userRoles.includes("Global Administrator") ? (
        <AdminHeader />
      ) : (
        <Header />
      )}
      <div className="mx-auto px-4 py-10 space-y-10">
        {/* Top Info */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {userProfile?.displayName}
            </h2>
            <p className="text-sm text-gray-500">
              {userProfile?.jobTitle || "Job Title not set"}
            </p>
            <p className="text-sm text-gray-500">
              {userProfile?.userPrincipalName}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToApp />}
              onClick={() => instance.logoutRedirect()}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          <InfoCard title="Personal Information" icon={<AccountCircle />}>
            <InfoItem label="Name" value={userProfile?.displayName} />
            <InfoItem
              label="Username (UPN)"
              value={userProfile?.userPrincipalName}
            />
            <InfoItem
              label="Preferred Language"
              value={userProfile?.preferredLanguage || "Not provided"}
            />
          </InfoCard>

          <InfoCard title="Contact Information" icon={<Phone />}>
            <InfoItem
              label="Email"
              value={userProfile?.mail || userProfile?.userPrincipalName}
            />
            <InfoItem
              label="Phone"
              value={userProfile?.mobilePhone || "Not Provided"}
            />
          </InfoCard>

          <InfoCard title="Company Information" icon={<Business />}>
            <InfoItem
              label="Department"
              value={userProfile?.department || "Not Provided"}
            />
            <InfoItem
              label="Office Location"
              value={userProfile?.officeLocation || "Not Provided"}
            />
            <InfoItem
              label="Job Title"
              value={userProfile?.jobTitle || "Not Provided"}
            />
          </InfoCard>

          <InfoCard title="Directory Roles" icon={<People />} spanFull>
            {userRoles.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {userRoles.map((role, idx) => (
                  <li key={idx}>{role}</li>
                ))}
              </ul>
            ) : loading ? (
              <p className="text-sm text-gray-500 italic">Loading roles...</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No roles assigned</p>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

// Card layout
const InfoCard = ({ title, icon, children, spanFull = false }) => (
  <div
    className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-3 ${
      spanFull ? "md:col-span-2 lg:col-span-3" : ""
    }`}
  >
    <div className="flex items-center text-blue-600 mb-2">
      <div className="text-xl mr-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

// Field inside card
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
      {label}
    </p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

export default UserDetails;
