import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Save, User2, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userApi } from "@/api/user/user.api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMeSchema, type UpdateMeFormData } from "@/api/user/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PartnerProfilePage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<UpdateMeFormData>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: () => {
      toast.success(t("profile.avatar_upload_success"));
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          t("profile.avatar_upload_error")
      );
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (response) => {
      if (response.success && response.data) {
        dispatch(setUser(response.data));
      }
      toast.success(t("profile.save_success"));
      setIsEditing(false);
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string })?.message ||
          t("profile.save_error")
      );
    },
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("profile.file_too_large"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(t("profile.invalid_file_type"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadAvatarMutation.mutate(file);
    }
  };

  const onSubmit = (data: UpdateMeFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("profile.title")}</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            {t("profile.edit")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              {t("profile.cancel")}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {t("profile.loading")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("profile.save_changes")}
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-center">{t("profile.avatar")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              {uploadAvatarMutation.isPending ? (
                <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    {t("profile.avatar_uploading")}
                  </span>
                </div>
              ) : (
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={
                      previewUrl ||
                      user?.avatar?.url ||
                      "/images/default-avatar.png"
                    }
                    alt={user?.name}
                  />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadAvatarMutation.isPending}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors ${
                      uploadAvatarMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {isEditing
                ? t("profile.avatar_change_hint")
                : t("profile.avatar_description")}
            </p>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("profile.personal_info")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-muted-foreground" />
                        {t("profile.full_name")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {t("profile.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user?.email || ""}
                    disabled={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("profile.email_change_disabled")}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {t("profile.phone")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    <p>
                      {t("profile.created_at")}:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p>
                      {t("profile.updated_at")}:{" "}
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
