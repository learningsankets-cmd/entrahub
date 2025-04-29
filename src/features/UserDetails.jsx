import React from "react";
import { useMsal } from "@azure/msal-react";

const UserDetails = () => {
  const { accounts } = useMsal();

  // Check if there are any accounts (user is logged in)
  if (!accounts || accounts.length === 0) {
    return <p>No user is currently logged in.</p>;
  }

  // Get the first account (assuming single sign-in)
  const account = accounts[0];
  const userDetails = {
    name: account.name || "Not provided",
    username: account.username || "Not provided",
    id: account.localAccountId || "Not provided",
  };

  // Print details to console
  console.log("Current Logged-in User Details:", userDetails);

  return (
    <div className="p-4 border">
      <h3 className="text-lg font-bold">User Details</h3>
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Username/Email:</strong> {userDetails.username}</p>
      <p><strong>User ID:</strong> {userDetails.id}</p>
    </div>
  );
};

export default UserDetails;