import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User2,
  Users,
  Save,
} from "lucide-react";
import { userApi } from "@/api/user/user.api";
import { updateMeSchema, type UpdateMeFormData } from "@/api/user/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setUser } from "@/features/auth/authSlice";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(t("profile.avatar_upload_success"));
    },
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { message: string }).message ||
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "bg-amber-600";
      case "Silver":
        return "bg-gray-400";
      case "Gold":
        return "bg-yellow-400";
      default:
        return "bg-amber-600";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Bronze":
        return "🥉";
      case "Silver":
        return "🥈";
      case "Gold":
        return "🥇";
      default:
        return "🥉";
    }
  };

  return (
    <div className="container mx-auto py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
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
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                {uploadAvatarMutation.isPending ? (
                  <Skeleton className="w-32 h-32 rounded-full" />
                ) : (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                    <img
                      src={
                        previewUrl ||
                        user?.avatar?.url ||
                        "/images/default-avatar.png"
                      }
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
              <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
            </div>
          </Card>

          {/* Tier Card */}
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full ${getTierColor(
                  user?.tier || "Bronze"
                )} flex items-center justify-center text-2xl mb-4`}
              >
                {getTierIcon(user?.tier || "Bronze")}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t("profile.membership_tier")}
              </h3>
              <p className="text-2xl font-bold text-primary">
                {user?.tier || "Bronze"}
              </p>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {t(
                  `profile.tier_description.${
                    user?.tier?.toLowerCase() || "bronze"
                  }`
                )}
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column - Personal Information */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {t("profile.personal_info")}
          </h2>

          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {t("profile.email")}
                  </label>
                  <Input defaultValue={user?.email} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {t("profile.birth_date")}
                  </label>
                  <Input type="date" disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {t("profile.gender")}
                  </label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder={t("profile.gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">
                        {t("profile.gender_options.male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("profile.gender_options.female")}
                      </SelectItem>
                      <SelectItem value="other">
                        {t("profile.gender_options.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {t("profile.address")}
                  </label>
                  <Input placeholder={t("profile.enter_address")} disabled />
                </div>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
