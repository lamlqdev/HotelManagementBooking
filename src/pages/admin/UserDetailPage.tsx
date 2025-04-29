import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  Trash2,
  Pencil,
} from "lucide-react";
import { userApi } from "@/api/user/user.api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function UserDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deactivateReason, setDeactivateReason] = useState("");
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getUser(id!),
  });

  const deactivateMutation = useMutation({
    mutationFn: (reason: string) => userApi.deactivateUser(id!, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success(t("admin.users.deactivate.success"), {
        description: t("admin.users.deactivate.successMessage"),
      });
      setIsDeactivateDialogOpen(false);
      setDeactivateReason("");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(t("admin.users.deactivate.error"), {
        description: error.response?.data?.message || t("common.errorMessage"),
      });
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => userApi.activateUser(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success(t("admin.users.activate.success"), {
        description: t("admin.users.activate.successMessage"),
      });
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(t("admin.users.activate.error"), {
        description: error.response?.data?.message || t("common.errorMessage"),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => userApi.deleteUser(id!),
    onSuccess: () => {
      toast.success(t("admin.users.delete.success"), {
        description: t("admin.users.delete.successMessage"),
      });
      navigate("/admin/users");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(t("admin.users.delete.error"), {
        description: error.response?.data?.message || t("common.errorMessage"),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof editForm) => userApi.updateUser(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      toast.success(t("admin.users.edit.success"), {
        description: t("admin.users.edit.successMessage"),
      });
      setIsEditDialogOpen(false);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      toast.error(t("admin.users.edit.error"), {
        description: error.response?.data?.message || t("common.errorMessage"),
      });
    },
  });

  const handleDeactivate = () => {
    if (!deactivateReason.trim()) {
      toast.error(t("admin.users.deactivate.error"), {
        description: t("admin.users.deactivate.reasonRequired"),
      });
      return;
    }
    deactivateMutation.mutate(deactivateReason);
  };

  const handleEdit = () => {
    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.phone.trim()
    ) {
      toast.error(t("admin.users.edit.error"), {
        description: t("admin.users.edit.requiredFields"),
      });
      return;
    }
    updateMutation.mutate(editForm);
  };

  // Cập nhật form khi user data thay đổi
  useEffect(() => {
    if (user?.data) {
      setEditForm({
        name: user.data.name,
        email: user.data.email,
        phone: user.data.phone,
        role: user.data.role,
      });
    }
  }, [user?.data]);

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
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("admin.users.details.edit")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("admin.users.edit.title")}</DialogTitle>
                      <DialogDescription>
                        {t("admin.users.edit.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {t("admin.users.edit.name")}
                        </Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder={t("admin.users.edit.namePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t("admin.users.edit.email")}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder={t("admin.users.edit.emailPlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {t("admin.users.edit.phone")}
                        </Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder={t("admin.users.edit.phonePlaceholder")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">
                          {t("admin.users.edit.role")}
                        </Label>
                        <select
                          id="role"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={editForm.role}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                        >
                          <option value="user">
                            {t("admin.users.roles.user")}
                          </option>
                          <option value="admin">
                            {t("admin.users.roles.admin")}
                          </option>
                          <option value="hotel_owner">
                            {t("admin.users.roles.hotel_owner")}
                          </option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={handleEdit}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending
                          ? t("common.loading")
                          : t("admin.users.edit.save")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("admin.users.details.delete")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("admin.users.delete.title")}</DialogTitle>
                      <DialogDescription>
                        {t("admin.users.delete.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending
                          ? t("common.loading")
                          : t("admin.users.delete.confirm")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {user.data.status === "active" ? (
                  <Dialog
                    open={isDeactivateDialogOpen}
                    onOpenChange={setIsDeactivateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-amber-600 border-amber-600 hover:bg-amber-50"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {t("admin.users.details.deactivate")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {t("admin.users.deactivate.title")}
                        </DialogTitle>
                        <DialogDescription>
                          {t("admin.users.deactivate.description")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reason">
                          {t("admin.users.deactivate.reason")}
                        </Label>
                        <Input
                          id="reason"
                          value={deactivateReason}
                          onChange={(e) => setDeactivateReason(e.target.value)}
                          placeholder={t(
                            "admin.users.deactivate.reasonPlaceholder"
                          )}
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeactivateDialogOpen(false)}
                        >
                          {t("common.cancel")}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeactivate}
                          disabled={deactivateMutation.isPending}
                        >
                          {deactivateMutation.isPending
                            ? t("common.loading")
                            : t("admin.users.deactivate.confirm")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => activateMutation.mutate()}
                    disabled={activateMutation.isPending}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {activateMutation.isPending
                      ? t("common.loading")
                      : t("admin.users.details.activate")}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
