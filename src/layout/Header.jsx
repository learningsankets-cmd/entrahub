import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import { AccountCircle, FactCheckOutlined } from "@mui/icons-material";
import { useMsal } from "@azure/msal-react";

const Header = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md z-50"
    >
      <Toolbar className="flex justify-between items-center px-4">
        {/* Left Logo Section */}
        <Box className="flex items-center space-x-2">
          <Link
            className="transition-transform duration-300 hover:scale-105"
            to={"/"}
          >
            <div className="flex">
              <div className="flex flex-col items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  Entra<span className="text-yellow-400">Hub</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 italic">
                  Empower your access.
                </p>
              </div>
              <img
                src="/entrahub.svg"
                alt="EntraHub Logo"
                className="h-12 sm:h-12 w-auto object-contain"
              />
            </div>
          </Link>
        </Box>

        {/* Right Navigation Section */}
        <Box className="flex space-x-6">
          <IconButton
            size="large"
            onClick={() => navigate("/my-requests")}
            className="flex flex-col items-center !text-white hover:bg-blue-700 rounded-lg transition-colors p-2"
          >
            <FactCheckOutlined fontSize="large" />
            <Typography variant="body2">My Requests</Typography>
          </IconButton>

          <IconButton
            size="large"
            onClick={() => navigate("/user-details")}
            className="flex flex-col items-center !text-white hover:bg-blue-700 rounded-lg transition-colors p-2"
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
