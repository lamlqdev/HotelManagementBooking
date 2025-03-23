import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/hooks";

const PrivateRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
