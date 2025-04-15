import { useTranslation } from "react-i18next";
import { Phone, Mail, Globe, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TabProps } from "../../../types/hotel";
import { useAppSelector } from "@/store/hooks";

export function ContactTab({ hotel, isEditing, onInputChange }: TabProps) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("hotelInfo.contact.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <User className="w-4 h-4" />
            <Label htmlFor="representativeName">
              {t("hotelInfo.contact.representativeName")}
            </Label>
          </div>
          <Input
            id="representativeName"
            name="representativeName"
            value={user?.name || ""}
            onChange={onInputChange}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.contact.representativeName")}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Phone className="w-4 h-4" />
            <Label htmlFor="phone">{t("hotelInfo.contact.phone")}</Label>
          </div>
          <Input
            id="phone"
            name="phone"
            value={user?.phone || ""}
            onChange={onInputChange}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.contact.phone")}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Mail className="w-4 h-4" />
            <Label htmlFor="email">{t("hotelInfo.contact.email")}</Label>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={user?.email || ""}
            onChange={onInputChange}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.contact.email")}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 w-[180px]">
            <Globe className="w-4 h-4" />
            <Label htmlFor="website">{t("hotelInfo.contact.website")}</Label>
          </div>
          <Input
            id="website"
            name="website"
            value={hotel.website}
            onChange={onInputChange}
            disabled={!isEditing}
            className="flex-1"
            placeholder={t("hotelInfo.contact.website")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
