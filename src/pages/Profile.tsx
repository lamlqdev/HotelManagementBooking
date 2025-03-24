import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
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

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

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
                  src={`${import.meta.env.VITE_API_URL}/uploads/avatars/${
                    user?.avatar
                  }`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
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
