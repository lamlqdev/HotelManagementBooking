import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { bookingApi } from "@/api/booking/booking.api";
import { toast } from "sonner";

const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVNPayReturn = async () => {
      try {
        // Lấy các tham số từ VNPay callback
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
        const vnpOrderInfo = searchParams.get("vnp_OrderInfo");

        // Kiểm tra tính hợp lệ của giao dịch
        if (vnpResponseCode === "00" && vnpTransactionNo) {
          // Xác nhận thanh toán với backend
          await bookingApi.confirmPayment(vnpTransactionNo, "vnpay");

          // Chuyển hướng đến trang kết quả thanh toán thành công
          navigate(
            `/payment-result?status=success&bookingId=${
              vnpOrderInfo?.split("#")[1]
            }`
          );
        } else {
          // Chuyển hướng đến trang kết quả thanh toán thất bại
          navigate(
            `/payment-result?status=failed&bookingId=${
              vnpOrderInfo?.split("#")[1]
            }`
          );
        }
      } catch (error) {
        console.error("Error processing VNPay return:", error);
        toast.error("Có lỗi xảy ra khi xử lý kết quả thanh toán");
        navigate("/payment-result?status=failed");
      }
    };

    handleVNPayReturn();
  }, [searchParams, navigate]);

  // Trang này sẽ không hiển thị gì vì nó chỉ xử lý callback và chuyển hướng
  return null;
};

export default VNPayReturnPage;
