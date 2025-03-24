import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/store/hooks";

interface PrivateRouteProps {
  role: "user" | "admin" | "partner";
}

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng không có thông tin user hoặc role
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role có phù hợp không
  if (user.role !== role) {
    // Chuyển hướng về trang chủ tương ứng với role của user
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "partner":
        return <Navigate to="/partner" replace />;
      case "user":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Nếu đã đăng nhập và có đúng role -> cho phép truy cập
  return <Outlet />;
};

export default PrivateRoute;
