import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { hotelApi } from "@/api/hotel/hotel.api";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { useAppSelector } from "@/store/hooks";
import { Amenity } from "@/types/amenity";
import { BasicInfoSection } from "@/components/partner/hotel-info/BasicInfoSection";
import { ImagesSection } from "@/components/partner/hotel-info/ImagesSection";
import { PoliciesSection } from "@/components/partner/hotel-info/PoliciesSection";
import { AmenitiesSection } from "@/components/partner/hotel-info/AmenitiesSection";

interface EditedHotelData {
  name?: string;
  description?: string;
  address?: string;
  locationId?: string;
  locationDescription?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
  childrenPolicy?: string;
  petPolicy?: string;
  smokingPolicy?: string;
  amenities?: string[];
  featuredImage?: File;
  images?: File[];
}

const HotelInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedHotelData>({});
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: hotels,
    isLoading: isLoadingHotels,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel"],
    queryFn: () => hotelApi.getMyHotels({ ownerId: user?.id }),
  });

  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  const updateHotelMutation = useMutation({
    mutationFn: (data: EditedHotelData) => {
      if (!hotel?._id) throw new Error("Hotel ID is required");
      return hotelApi.updateHotel(hotel._id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotel"] });
      toast.success(t("hotelInfo.messages.updateSuccess"));
      setIsEditing(false);
      setEditedData({});
    },
    onError: (error: Error) => {
      toast.error(error.message || t("hotelInfo.messages.updateFailed"));
    },
  });

  const hotel = hotels?.data[0];
  const availableAmenities = (amenitiesData?.data || []).filter(
    (amenity: Amenity) => amenity.type === "hotel"
  );

  const handleInputChange = (field: keyof EditedHotelData, value: string) => {
    console.log("Changing field:", field, "to value:", value);
    setEditedData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("New edited data:", newData);
      return newData;
    });
  };

  const handleSave = () => {
    if (!hotel?._id) return;

    // Tách các trường chính sách ra khỏi editedData
    const {
      checkInTime,
      checkOutTime,
      cancellationPolicy,
      childrenPolicy,
      petPolicy,
      smokingPolicy,
      ...otherData
    } = editedData;

    // Tạo object policies riêng
    const policies = {
      checkInTime: checkInTime || hotel.policies.checkInTime,
      checkOutTime: checkOutTime || hotel.policies.checkOutTime,
      cancellationPolicy:
        cancellationPolicy || hotel.policies.cancellationPolicy,
      childrenPolicy: childrenPolicy || hotel.policies.childrenPolicy,
      petPolicy: petPolicy || hotel.policies.petPolicy,
      smokingPolicy: smokingPolicy || hotel.policies.smokingPolicy,
    };

    // Tạo dữ liệu cập nhật với policies được đóng gói
    const dataToUpdate = {
      ...otherData,
      policies: policies,
    };

    console.log("Data to update:", dataToUpdate);
    updateHotelMutation.mutate(dataToUpdate);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setEditedData((prev) => {
      const currentAmenities = prev.amenities || hotel?.amenities || [];
      const newAmenities = currentAmenities.includes(amenityId)
        ? currentAmenities.filter((id) => id !== amenityId)
        : [...currentAmenities, amenityId];

      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };

  const handleImageChange = (
    type: "main" | "gallery",
    file: File,
    index?: number
  ) => {
    setEditedData((prev) => {
      if (type === "main") {
        return {
          ...prev,
          featuredImage: file,
        };
      } else {
        // Nếu là gallery
        const currentImages = prev.images || [];
        if (typeof index === "number") {
          // Cập nhật ảnh tại vị trí index
          const newImages = [...currentImages];
          newImages[index] = file;
          return {
            ...prev,
            images: newImages,
          };
        } else {
          // Thêm ảnh mới
          return {
            ...prev,
            images: [...currentImages, file],
          };
        }
      }
    });
  };

  const handleRemoveImage = (type: "main" | "gallery", index?: number) => {
    if (type === "main") {
      setEditedData((prev) => ({
        ...prev,
        featuredImage: undefined,
      }));
    } else if (typeof index === "number") {
      setEditedData((prev) => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index),
      }));
    }
  };

  if (isLoadingHotels || isLoadingAmenities) {
    return (
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (hotelError) {
    return (
      <div className="container mx-auto px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>{t("error.loadHotelFailed")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("info.title")}</AlertTitle>
          <AlertDescription>{t("info.noHotelFound")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("hotelInfo.title")}</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t("hotelInfo.buttons.cancel")}
              </Button>
              <Button onClick={handleSave}>
                {t("hotelInfo.buttons.save")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              {t("hotelInfo.buttons.edit")}
            </Button>
          )}
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <BasicInfoSection
        hotel={hotel}
        isEditing={isEditing}
        onInputChange={(field: string, value: string) =>
          handleInputChange(field as keyof EditedHotelData, value)
        }
        editedData={editedData}
      />

      {/* Phần ảnh */}
      <ImagesSection
        hotel={hotel}
        isEditing={isEditing}
        onImageChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
      />

      {/* Phần chính sách */}
      <PoliciesSection
        hotel={hotel}
        isEditing={isEditing}
        onInputChange={(field: string, value: string) =>
          handleInputChange(field as keyof EditedHotelData, value)
        }
        editedData={editedData}
      />

      {/* Phần tiện nghi */}
      <AmenitiesSection
        hotel={hotel}
        isEditing={isEditing}
        availableAmenities={availableAmenities}
        editedData={editedData}
        onAmenityToggle={handleAmenityToggle}
      />
    </div>
  );
};

export default HotelInfoPage;
