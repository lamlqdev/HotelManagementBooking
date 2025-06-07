import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Không tìm thấy trang</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4" size="lg">
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
