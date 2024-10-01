import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { role } = useSelector((state) => state.auth);
  let homePage;
  if (role === "admin") {
    homePage = "/admin/dashboards";
  } else if (role === "client") {
    homePage = "/client/create-user";
  } else if (role === "user") {
    homePage = "/user/pan-validation"; 
  } else{
    homePage = "/login"; 
  }
  return role ? <Navigate to={homePage} /> : <Outlet />;
};

export default PublicRoute;
