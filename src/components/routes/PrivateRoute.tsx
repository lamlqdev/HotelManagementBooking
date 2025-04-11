import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";

interface PrivateRouteProps {
  role: "user" | "admin" | "partner";
}

const PrivateRoute = ({ role }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

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
        return <Navigate to="/admin/partners" replace />;
      case "partner":
        return <Navigate to="/partner/hotels/info" replace />;
      case "user":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Kiểm tra xem đường dẫn hiện tại có thuộc quyền truy cập của role không
  const currentPath = location.pathname;

  if (role === "admin" && !currentPath.startsWith("/admin")) {
    return <Navigate to="/admin/partners" replace />;
  }

  if (role === "partner" && !currentPath.startsWith("/partner")) {
    return <Navigate to="/partner/hotels/info" replace />;
  }

  if (
    role === "user" &&
    (currentPath.startsWith("/admin") || currentPath.startsWith("/partner"))
  ) {
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập và có đúng role -> cho phép truy cập
  return <Outlet />;
};

export default PrivateRoute;
