import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import { AccountCircle, FactCheckOutlined } from "@mui/icons-material";
import { useMsal } from "@azure/msal-react";

const Header = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="!bg-white shadow-md">
      <Toolbar className="flex justify-between items-center">
        <Box className="flex items-center space-x-2">
          <Link to={"/"}>
            <img
              src="/logo1.png"
              alt="EntraHub Logo"
              className="h-24 w-max object-contain"
            />
          </Link>
        </Box>

        <Box className="flex">
          <IconButton
            size="large"
            onClick={() => navigate("/my-requests")}
            className="flex flex-col items-center"
          >
            <FactCheckOutlined fontSize="large" />
            <Typography variant="body2">My Requests</Typography>
          </IconButton>

          <IconButton
            size="large"
            onClick={() => navigate("/user-details")}
            className="flex flex-col items-center"
          >
            <AccountCircle fontSize="large" />
            <Typography variant="body2">My Profile</Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
