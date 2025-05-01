import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import LoadingSvg from "@/assets/illustration/Loading.svg";

interface PrivateRouteProps {
  role: "user" | "admin" | "partner";
  allowMultipleRoles?: boolean;
}

const PrivateRoute = ({
  role,
  allowMultipleRoles = false,
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Đợi một khoảng thời gian ngắn để AuthProvider hoàn thành việc khôi phục phiên đăng nhập
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <img src={LoadingSvg} alt="Loading" className="w-96 h-96" />
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng không có thông tin user hoặc role
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Nếu allowMultipleRoles là true, cho phép truy cập nếu user đã đăng nhập
  if (allowMultipleRoles) {
    return <Outlet />;
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
