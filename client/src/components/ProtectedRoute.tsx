import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
