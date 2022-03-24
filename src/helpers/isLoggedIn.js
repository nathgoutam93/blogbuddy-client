import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function IsLoggedIn({ pathToRedirect }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div className="loader" />;

  return isAuthenticated ? (
    <Navigate to={pathToRedirect} replace />
  ) : (
    <Outlet />
  );
}
