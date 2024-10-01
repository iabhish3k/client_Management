import React from "react";
import { useSelector, useDispatch } from "react-redux"; // Combine imports for clarity
import { logout, selectToken } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const token = useSelector(selectToken); // Check if the user is logged in (has a token)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky-top bg-dark text-white p-3">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-0">Client Management</h1>
        {token && (
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-light ms-2"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
