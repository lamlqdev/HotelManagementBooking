import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setUser, resetAuth } from "@/features/auth/authSlice";
import { authApi } from "@/api/auth/auth.api";

const OAuthCallback = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const error = searchParams.get("error");
      const message = searchParams.get("message");

      if (error) {
        toast.error(
          decodeURIComponent(message || t("auth.login.error.generic"))
        );
        navigate("/login");
        return;
      }

      try {
        const userResponse = await authApi.getMe();
        if (userResponse.success && userResponse.data) {
          if (userResponse.data.status !== "active") {
            dispatch(resetAuth());
            toast.error(t("auth.login.error.accountInactive"));
            navigate("/login");
            return;
          }

          dispatch(setUser(userResponse.data));
          toast.success(t("auth.login.success"));

          const role = userResponse.data.role;
          switch (role) {
            case "admin":
              navigate("/admin/partners");
              break;
            case "partner":
              navigate("/partner/hotels/info");
              break;
            case "user":
              navigate("/");
              break;
            default:
              navigate("/");
          }
        } else {
          throw new Error("Phản hồi người dùng không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi callback OAuth:", error);
        dispatch(resetAuth());
        toast.error(t("auth.login.error.fetchUser"));
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, dispatch, navigate, t]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>{t("auth.login.processing")}</p>
    </div>
  );
};

export default OAuthCallback;
