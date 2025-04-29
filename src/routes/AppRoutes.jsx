// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import Home from "../features/Home";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Home />} />

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
