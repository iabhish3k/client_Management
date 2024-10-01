import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import {
  adminRoutes,
  clientRoutes,
  userRoutes,
  publicRoutes,
} from "./RoutesConfig";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "./NotFound"; // Assuming you have a NotFound component
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const { role } = useSelector((state) => state.auth);
  let mainRoute = [];

  if (role === "admin") {
    mainRoute = adminRoutes;
  }
  if (role === "client") {
    mainRoute = clientRoutes;
  }
  if (role === "user") {
    mainRoute = userRoutes;
  }

  const renderRoutes = (routes) => {
    return routes.map((route) => (
      <Route
        key={route.key}
        path={route.path}
        element={
          <Suspense
            fallback={
              <div
                style={{
                  backgroundColor: "#343a40",
                }}
              ></div>
            }
          >
            <route.component />
          </Suspense>
        }
      />
    ));
  };
console.log('here in approut',mainRoute)
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      backgroundColor: "#343a40",
                    }}
                  ></div>
                }
              >
                <route.component />
              </Suspense>
            }
          />
        ))}
      </Route>

      <Route element={<ProtectedRoute />}>{renderRoutes(mainRoute)}</Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
