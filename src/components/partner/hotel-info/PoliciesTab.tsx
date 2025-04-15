import { useTranslation } from "react-i18next";
import { Clock, Calendar, Baby, Dog, Cigarette, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Hotel } from "../../../types/hotel";

interface PoliciesTabProps {
  hotel: Hotel;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const PoliciesTab = ({
  hotel,
  isEditing,
  onInputChange,
}: PoliciesTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Thời gian check-in/check-out */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-4 h-4 text-primary" />
            {t("hotelInfo.policies.checkInOut")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="checkInTime"
                className="text-sm font-medium text-gray-700"
              >
                {t("hotelInfo.policies.checkInTime")}
              </Label>
              <div className="relative">
                <Input
                  id="checkInTime"
                  name="checkInTime"
                  value={hotel.policies.checkInTime}
                  onChange={onInputChange}
                  disabled={!isEditing}
                  placeholder="14:00"
                  className="h-10 text-base border-gray-200 focus:border-primary focus:ring-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Info className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="checkOutTime"
                className="text-sm font-medium text-gray-700"
              >
                {t("hotelInfo.policies.checkOutTime")}
              </Label>
              <div className="relative">
                <Input
                  id="checkOutTime"
                  name="checkOutTime"
                  value={hotel.policies.checkOutTime}
                  onChange={onInputChange}
                  disabled={!isEditing}
                  placeholder="12:00"
                  className="h-10 text-base border-gray-200 focus:border-primary focus:ring-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Info className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chính sách hủy phòng */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Calendar className="w-4 h-4 text-primary" />
            {t("hotelInfo.policies.cancellation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="cancellationPolicy"
              className="text-sm font-medium text-gray-700"
            >
              {t("hotelInfo.policies.content")}
            </Label>
            <Textarea
              id="cancellationPolicy"
              name="cancellationPolicy"
              value={hotel.policies.cancellationPolicy}
              onChange={onInputChange}
              disabled={!isEditing}
              placeholder={t("hotelInfo.policies.cancellation")}
              className="min-h-[100px] text-base border-gray-200 focus:border-primary focus:ring-primary resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chính sách trẻ em */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Baby className="w-4 h-4 text-primary" />
            {t("hotelInfo.policies.children")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="childrenPolicy"
              className="text-sm font-medium text-gray-700"
            >
              {t("hotelInfo.policies.content")}
            </Label>
            <Textarea
              id="childrenPolicy"
              name="childrenPolicy"
              value={hotel.policies.childrenPolicy}
              onChange={onInputChange}
              disabled={!isEditing}
              placeholder={t("hotelInfo.policies.children")}
              className="min-h-[100px] text-base border-gray-200 focus:border-primary focus:ring-primary resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chính sách thú cưng */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Dog className="w-4 h-4 text-primary" />
            {t("hotelInfo.policies.pet")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="petPolicy"
              className="text-sm font-medium text-gray-700"
            >
              {t("hotelInfo.policies.content")}
            </Label>
            <Textarea
              id="petPolicy"
              name="petPolicy"
              value={hotel.policies.petPolicy}
              onChange={onInputChange}
              disabled={!isEditing}
              placeholder={t("hotelInfo.policies.pet")}
              className="min-h-[100px] text-base border-gray-200 focus:border-primary focus:ring-primary resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chính sách hút thuốc */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Cigarette className="w-4 h-4 text-primary" />
            {t("hotelInfo.policies.smoking")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="smokingPolicy"
              className="text-sm font-medium text-gray-700"
            >
              {t("hotelInfo.policies.content")}
            </Label>
            <Textarea
              id="smokingPolicy"
              name="smokingPolicy"
              value={hotel.policies.smokingPolicy}
              onChange={onInputChange}
              disabled={!isEditing}
              placeholder={t("hotelInfo.policies.smoking")}
              className="min-h-[100px] text-base border-gray-200 focus:border-primary focus:ring-primary resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
