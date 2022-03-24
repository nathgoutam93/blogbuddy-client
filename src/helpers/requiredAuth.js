import { Outlet, Navigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

export default function RequiredAuth() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div className="loader" />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
