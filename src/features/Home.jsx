import React from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const Home = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => console.error(e));
  };

  const showUserDetails = () => {
    navigate("/user-details");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Welcome Home</h2>
        <button
          onClick={showUserDetails}
          className="px-4 py-2 bg-blue-600 text-white font-medium mr-2 hover:bg-blue-700 transition-colors"
        >
          Show User Details
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;