import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage"; // Using secureLocalStorage
import axios from "axios";
import { Card, Form, Button } from "react-bootstrap"; // Import Bootstrap components
import { baseUrl } from "../../utils/constants";
import { message } from "antd";
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true); 

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password,
      });
      const { token, role } = response.data.data;

      // Save token and role to secureLocalStorage
      secureLocalStorage.setItem("token", token);
      secureLocalStorage.setItem("role", role);

      // Dispatch login with token and role
      dispatch(login({ token, role }));

      let homePage;

      if (role === "admin") {
        homePage = "/admin/dashboards";
      } else if (role === "client") {
        homePage = "/client/create-user";
      } else if (role === "user") {
        homePage = "/user/pan-validation";
      } else {
        homePage = "/login";
      }

      // Redirect the user to the correct homepage
      navigate(homePage);
      setError(null);
    } catch (error) {
      message.error(error.response.data.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Card style={{ width: "25rem", backgroundColor: "white" }}>
        <Card.Body>
          <Card.Title className="text-center">Login</Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>

          {error && <p className="text-danger text-center">{error}</p>}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
