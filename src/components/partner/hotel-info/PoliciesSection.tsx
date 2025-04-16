import {
  FileText,
  Clock,
  Calendar,
  Baby,
  Dog,
  Cigarette,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hotel } from "@/types/hotel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  generateTimeOptions,
  formatTimeDisplay,
  getTimeSelectPlaceholder,
} from "@/utils/timeUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PoliciesSectionProps {
  hotel: Hotel;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  editedData: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    childrenPolicy?: string;
    petPolicy?: string;
    smokingPolicy?: string;
  };
}

export const PoliciesSection = ({
  hotel,
  isEditing,
  onInputChange,
  editedData,
}: PoliciesSectionProps) => {
  const { t } = useTranslation();
  const timeOptions = generateTimeOptions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {t("hotelInfo.policies.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thời gian check-in/check-out */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <Label className="text-base font-semibold">
              {t("hotelInfo.policies.checkInOut")}
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="checkInTime"
                className="text-sm font-medium text-gray-700"
              >
                {t("hotelInfo.policies.checkInTime")}
              </Label>
              <div className="relative">
                {isEditing ? (
                  <Select
                    value={
                      editedData.checkInTime ?? hotel.policies.checkInTime ?? ""
                    }
                    onValueChange={(value) =>
                      onInputChange("checkInTime", value)
                    }
                  >
                    <SelectTrigger className="h-10 text-base border-gray-200 focus:border-primary focus:ring-primary">
                      <SelectValue
                        placeholder={getTimeSelectPlaceholder("check-in")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTimeDisplay(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="checkInTime"
                    name="checkInTime"
                    value={hotel.policies.checkInTime}
                    disabled
                    className="h-10 text-base border-gray-200"
                  />
                )}
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
                {isEditing ? (
                  <Select
                    value={
                      editedData.checkOutTime ??
                      hotel.policies.checkOutTime ??
                      ""
                    }
                    onValueChange={(value) =>
                      onInputChange("checkOutTime", value)
                    }
                  >
                    <SelectTrigger className="h-10 text-base border-gray-200 focus:border-primary focus:ring-primary">
                      <SelectValue
                        placeholder={getTimeSelectPlaceholder("check-out")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTimeDisplay(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="checkOutTime"
                    name="checkOutTime"
                    value={hotel.policies.checkOutTime}
                    disabled
                    className="h-10 text-base border-gray-200"
                  />
                )}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Info className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chính sách hủy phòng */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <Label className="text-base font-semibold">
              {t("hotelInfo.policies.cancellation")}
            </Label>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="cancellationPolicy"
              className="text-sm font-medium text-gray-700"
            >
              {t("hotelInfo.policies.content")}
            </Label>
            {isEditing ? (
              <Select
                value={
                  editedData.cancellationPolicy ??
                  hotel.policies.cancellationPolicy ??
                  ""
                }
                onValueChange={(value) =>
                  onInputChange("cancellationPolicy", value)
                }
              >
                <SelectTrigger className="h-10 text-base border-gray-200 focus:border-primary focus:ring-primary">
                  <SelectValue placeholder="Chọn chính sách hủy phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h-full-refund">
                    Hoàn tiền 100% nếu hủy trước 24h
                  </SelectItem>
                  <SelectItem value="24h-half-refund">
                    Hoàn tiền 50% nếu hủy trước 24h
                  </SelectItem>
                  <SelectItem value="no-refund">
                    Không hoàn tiền khi hủy
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Textarea
                id="cancellationPolicy"
                name="cancellationPolicy"
                value={hotel.policies.cancellationPolicy}
                disabled
                className="min-h-[100px] text-base border-gray-200 resize-none"
              />
            )}
          </div>
        </div>

        {/* Các chính sách khác */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <Label className="text-base font-semibold">
              {t("hotelInfo.policies.otherPolicies")}
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chính sách trẻ em */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Baby className="w-4 h-4 text-primary" />
                <Label className="font-medium">
                  {t("hotelInfo.policies.children")}
                </Label>
              </div>
              {isEditing ? (
                <RadioGroup
                  value={
                    editedData.childrenPolicy ??
                    hotel.policies.childrenPolicy ??
                    "no"
                  }
                  onValueChange={(value) =>
                    onInputChange("childrenPolicy", value)
                  }
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="yes" id="children-yes" />
                    <Label htmlFor="children-yes" className="font-normal">
                      {t("hotelInfo.policies.childrenAllowed")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="no" id="children-no" />
                    <Label htmlFor="children-no" className="font-normal">
                      {t("hotelInfo.policies.childrenNotAllowed")}
                    </Label>
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {hotel.policies.childrenPolicy === "yes"
                    ? t("hotelInfo.policies.childrenAllowed")
                    : t("hotelInfo.policies.childrenNotAllowed")}
                </p>
              )}
            </div>

            {/* Chính sách thú cưng */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Dog className="w-4 h-4 text-primary" />
                <Label className="font-medium">
                  {t("hotelInfo.policies.pet")}
                </Label>
              </div>
              {isEditing ? (
                <RadioGroup
                  value={
                    editedData.petPolicy ?? hotel.policies.petPolicy ?? "no"
                  }
                  onValueChange={(value) => onInputChange("petPolicy", value)}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="yes" id="pet-yes" />
                    <Label htmlFor="pet-yes" className="font-normal">
                      {t("hotelInfo.policies.petsAllowed")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="no" id="pet-no" />
                    <Label htmlFor="pet-no" className="font-normal">
                      {t("hotelInfo.policies.petsNotAllowed")}
                    </Label>
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {hotel.policies.petPolicy === "yes"
                    ? t("hotelInfo.policies.petsAllowed")
                    : t("hotelInfo.policies.petsNotAllowed")}
                </p>
              )}
            </div>

            {/* Chính sách hút thuốc */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Cigarette className="w-4 h-4 text-primary" />
                <Label className="font-medium">
                  {t("hotelInfo.policies.smoking")}
                </Label>
              </div>
              {isEditing ? (
                <RadioGroup
                  value={
                    editedData.smokingPolicy ??
                    hotel.policies.smokingPolicy ??
                    "no"
                  }
                  onValueChange={(value) =>
                    onInputChange("smokingPolicy", value)
                  }
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="yes" id="smoking-yes" />
                    <Label htmlFor="smoking-yes" className="font-normal">
                      {t("hotelInfo.policies.smokingAllowed")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="no" id="smoking-no" />
                    <Label htmlFor="smoking-no" className="font-normal">
                      {t("hotelInfo.policies.smokingNotAllowed")}
                    </Label>
                  </div>
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {hotel.policies.smokingPolicy === "yes"
                    ? t("hotelInfo.policies.smokingAllowed")
                    : t("hotelInfo.policies.smokingNotAllowed")}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
