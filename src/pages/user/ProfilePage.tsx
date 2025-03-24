import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { userApi } from "@/api/user/user.api";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(t("profile.avatar_upload_success"));
    },
    onError: () => {
      toast.error(t("profile.avatar_upload_error"));
    },
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("profile.file_too_large"));
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        toast.error(t("profile.invalid_file_type"));
        return;
      }

      // Tạo URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadAvatarMutation.mutate(file);
    }
  };

  return (
    <div className="container mx-auto py-8 mt-24">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                <img
                  src={
                    previewUrl ||
                    (user?.avatar
                      ? user.avatar === "default-avatar.jpg"
                        ? "/images/default-avatar.png"
                        : `${
                            import.meta.env.VITE_API_URL
                          }/public/uploads/profiles/${user.avatar}`
                      : "/images/default-avatar.jpg")
                  }
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
                  className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </div>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground">
              {t("profile.member_since")} 2024
            </p>
          </div>
        </Card>

        {/* Right Column - Personal Information */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {t("profile.personal_info")}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User2 className="h-4 w-4 text-muted-foreground" />
                  {t("profile.full_name")}
                </label>
                <Input defaultValue={user?.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {t("profile.email")}
                </label>
                <Input defaultValue={user?.email} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {t("profile.phone")}
                </label>
                <Input placeholder="+84" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {t("profile.birth_date")}
                </label>
                <Input type="date" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {t("profile.gender")}
                </label>
                <Select>
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
                <Input placeholder={t("profile.enter_address")} />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline">{t("common.cancel")}</Button>
              <Button>{t("common.save_changes")}</Button>
            </div>
          </div>
        </Card>

        {/* Additional Information Cards */}
        <Card className="p-6 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">
            {t("profile.travel_preferences")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">{t("profile.preferred_airline")}</h3>
              <p className="text-muted-foreground">
                Vietnam Airlines, Bamboo Airways
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">
                {t("profile.preferred_hotel_type")}
              </h3>
              <p className="text-muted-foreground">4-5 Star Hotels</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">{t("profile.meal_preferences")}</h3>
              <p className="text-muted-foreground">{t("profile.vegetarian")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
