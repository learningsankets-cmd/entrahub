import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button, Card, CardContent, Typography, Divider } from "@mui/material";
import Header from "../layout/Header";

const UserDetails = () => {
  const { accounts, instance } = useMsal();

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
    homeAccountId: account.homeAccountId || "Not provided",
    tenantId: account.tenantId || "Not provided",
  };

  // Handle logout
  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => console.error(e));
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="p-4 flex justify-center">
        <Card className="max-w-lg w-full shadow-lg rounded-md bg-white">
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              className="text-center font-semibold text-blue-600"
            >
              User Details
            </Typography>
            <Divider className="my-4" />

            <div className="space-y-4">
              <div>
                <Typography variant="body1">
                  <strong>Name:</strong> {userDetails.name}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <strong>Username/Email:</strong> {userDetails.username}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <strong>User ID:</strong> {userDetails.id}
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <strong>Home Account ID:</strong> {userDetails.homeAccountId}
                </Typography>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="flex justify-center mt-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                fullWidth
                size="large"
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetails;
