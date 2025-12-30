import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/hooks";

import { selectIsAuthenticated } from "@/features/auth/authSelector";

const PublicRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
