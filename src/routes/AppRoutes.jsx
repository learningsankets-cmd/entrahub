// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import Home from "../features/Home";
import MyRequests from "../features/MyRequests";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/my-requests" element={<MyRequests />} />

      {/* <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      /> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
