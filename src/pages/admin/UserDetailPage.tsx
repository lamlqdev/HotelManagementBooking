import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { userApi } from "@/api/user/user.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUser(id!),
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">
            {t("common.error")}
          </h2>
          <p className="text-muted-foreground">{t("common.errorMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <h1 className="text-2xl font-bold">
            {t("admin.users.details.title")}
          </h1>
        </div>

        {isLoading ? (
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        ) : user ? (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("admin.users.details.basicInfo")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("admin.users.details.name")}
                    </label>
                    <p className="font-medium">{user.data.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("admin.users.details.email")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{user.data.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("admin.users.details.phone")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{user.data.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("admin.users.details.role")}
                    </label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">
                        {t(`admin.users.roles.${user.data.role}`)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mr-2">
                      {t("admin.users.details.status")}
                    </label>
                    <Badge
                      variant={
                        user.data.status === "active" ? "default" : "secondary"
                      }
                    >
                      {t(`admin.users.status.${user.data.status}`)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      {t("admin.users.details.emailVerified")}
                    </label>
                    <div className="flex items-center gap-2">
                      {user.data.isEmailVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <p className="font-medium">
                        {user.data.isEmailVerified
                          ? t("common.yes")
                          : t("common.no")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Thông tin bổ sung */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("admin.users.details.additionalInfo")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("admin.users.details.createdAt")}
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {format(
                        new Date(user.data.createdAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    {t("admin.users.details.updatedAt")}
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {format(
                        new Date(user.data.updatedAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Các thao tác */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("admin.users.details.actions")}
              </h2>
              <div className="flex gap-4">
                <Button variant="outline">
                  {t("admin.users.details.edit")}
                </Button>
                <Button variant="destructive">
                  {t("admin.users.details.delete")}
                </Button>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
