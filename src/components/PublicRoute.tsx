import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/hooks";

const PublicRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
