import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { bookingApi } from "@/api/booking/booking.api";
import { toast } from "sonner";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các tham số từ VNPay callback
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
  const vnpOrderInfo = searchParams.get("vnp_OrderInfo");

  // Trích xuất bookingId từ vnpOrderInfo (format: "Thanh toan dat phong #bookingId")
  const bookingId = vnpOrderInfo?.split("#")[1];

  const isSuccess = vnpResponseCode === "00";

  useEffect(() => {
    const confirmPayment = async () => {
      if (vnpTransactionNo && bookingId) {
        try {
          await bookingApi.confirmPayment(vnpTransactionNo, "vnpay");
        } catch (error) {
          console.error("Error confirming payment:", error);
          toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
        }
      }
    };

    confirmPayment();
  }, [vnpTransactionNo, bookingId]);

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
