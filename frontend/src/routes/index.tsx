import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Lazy-loaded pages
const LandingPage = lazy(() => import("../pages/LandingPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const TasksPage = lazy(() => import("../pages/TasksPage"));
const ProofRegistryPage = lazy(() => import("../pages/ProofRegistryPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

export const router = createBrowserRouter([
  // Landing route at root
  {
    path: "/",
    element: <LandingPage />,
  },
  // Main dashboard layout for all other views
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "proof-registry",
        element: <ProofRegistryPage />,
      },
      {
        path: "activity",
        element: <ActivityPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      // Fallback redirect to dashboard
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
