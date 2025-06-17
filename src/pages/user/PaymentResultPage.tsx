import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const bookingId = searchParams.get("booking");

  const isSuccess = status === "success";

  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <div className="text-center space-y-6">
        {isSuccess ? (
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        )}

        <h1 className="text-3xl font-bold">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          {isSuccess
            ? `Đơn đặt phòng của bạn (ID: ${bookingId}) đã được xác nhận.`
            : "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
        </p>

        <Button onClick={() => navigate("/")} className="mt-4">
          Trở về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default PaymentResultPage;
