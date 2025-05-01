import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./features/Home";
import UserDetails from "./features/UserDetails";
import MyRequests from "./features/MyRequests";
import AdminHome from "./admin/AdminHome";
import AllRequests from "./admin/AllRequests";
import NewService from "./admin/NewService";

const App = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/all-requests" element={<AllRequests />} />
          <Route path="/new-service" element={<NewService />} />
          <Route path="/login" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </UnauthenticatedTemplate>
    </>
  );
};

export default App;
