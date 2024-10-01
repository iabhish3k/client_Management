import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";

const NotFound = () => {
  const token = useSelector(selectToken);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      {token ? (
        <Link to="/">
          <Button type="primary">Go Back Home</Button>
        </Link>
      ) : (
        <Link to="/">
          <Button type="primary">Go to Login</Button>
        </Link>
      )}
    </div>
  );
};

export default NotFound;
