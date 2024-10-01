import React from "react";

export const APP_PREFIX_PATH = "/app";
const AdminDashboard = React.lazy(() => import("../views/admin/Dashboard"));


// Admin Routes
export const adminRoutes = [
  {
    key: "dashboard.admin",
    path: `admin/dashboards`,
    component: AdminDashboard,
  },
  {
    key: "dashboard",
    path: `/`,
    component: AdminDashboard,
  },
  {
    key: "createclient",
    path: `admin/create-client`,
    component: React.lazy(() => import("../views/admin/CreateClient")),
  },
  {
    key: "createuser",
    path: `admin/create-user`,
    component: React.lazy(() => import("../views/CreteUser")),
  },
  {
    key: "panvalidarion",
    path: `admin/pan-validation`,
    component: React.lazy(() => import("../views/Panvalidation")),
  },
];

// Client Routes
export const clientRoutes = [
  {
    key: "createuser",
    path: `client/create-user`,
    component: React.lazy(() => import("../views/CreteUser")),
  },
  {
    key: "create",
    path: `/`,
    component: React.lazy(() => import("../views/CreteUser")),
  },
  {
    key: "panvalidarion",
    path: `client/pan-validation`,
    component: React.lazy(() => import("../views/Panvalidation")),
  },
];

// Client Routes
export const userRoutes = [
  {
    key: "panvalidarion",
    path: `user/pan-validation`,
    component: React.lazy(() => import("../views/Panvalidation")),
  },
  {
    key: "panvalidarion1",
    path: `/`,
    component: React.lazy(() => import("../views/Panvalidation")),
  },
];

// Public Routes
export const publicRoutes = [
  {
    key: "login",
    path: "/login",
    component: React.lazy(() => import("../views/auth/Login")),
  },
  {
    key: "login1",
    path: "/",
    component: React.lazy(() => import("../views/auth/Login")),
  },
];

export default {
  adminRoutes,
  clientRoutes,
  publicRoutes,
};
