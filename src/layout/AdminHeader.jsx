import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Box, IconButton, Typography } from "@mui/material";
import {
  AccountCircle,
  AddCircleOutline,
  FactCheckOutlined,
} from "@mui/icons-material";
import { useMsal } from "@azure/msal-react";

const AdminHeader = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      Career
      Goals
      className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg"
    >
      <Toolbar className="flex justify-between items-center animate-fade-in">
        <Box className="flex items-center space-x-3">
          <Link
            to={"/"}
            className="transition-transform duration-300 hover:scale-105"
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

        <Box className="flex items-center space-x-2 sm:space-x-4">
          <IconButton
            size="large"
            onClick={() => navigate("/new-service")}
            className="flex flex-col items-center text-white hover:bg-blue-700 rounded-lg transition-colors p-2"
            aria-label="Navigate to New Service"
          >
            <AddCircleOutline fontSize="large" className="text-white" />
            <Typography
              variant="body2"
              className="text-xs sm:text-sm text-white mt-1"
            >
              New Service
            </Typography>
          </IconButton>
          <IconButton
            size="large"
            onClick={() => navigate("/all-requests")}
            className="flex flex-col items-center text-white hover:bg-blue-700 rounded-lg transition-colors p-2"
            aria-label="Navigate to All Requests"
          >
            <FactCheckOutlined fontSize="large" className="text-white" />
            <Typography
              variant="body2"
              className="text-xs sm:text-sm text-white mt-1"
            >
              All Requests
            </Typography>
          </IconButton>
          <IconButton
            size="large"
            onClick={() => navigate("/user-details")}
            className="flex flex-col items-center text-white hover:bg-blue-700 rounded-lg transition-colors p-2"
            aria-label="Navigate to My Profile"
          >
            <AccountCircle fontSize="large" className="text-white" />
            <Typography
              variant="body2"
              className="text-xs sm:text-sm text-white mt-1"
            >
              My Profile
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
