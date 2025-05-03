import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { amenitiesApi } from "@/api/amenities/amenities.api";
import { hotelApi } from "@/api/hotel/hotel.api";
import { locationApi } from "@/api/location/location.api";

import { AmenitiesSection } from "@/components/partner/hotel-info/AmenitiesSection";
import { BasicInfoSection } from "@/components/partner/hotel-info/BasicInfoSection";
import { ImagesSection } from "@/components/partner/hotel-info/ImagesSection";
import { PoliciesSection } from "@/components/partner/hotel-info/PoliciesSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { setCurrentHotel } from "@/features/hotel/hotelSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Amenity } from "@/types/amenity";

import { AlertCircle, Loader2, Power } from "lucide-react";

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
  status?: "active" | "inactive";
}

const HotelInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<EditedHotelData>({});
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data: hotels,
    isLoading: isLoadingHotels,
    error: hotelError,
  } = useQuery({
    queryKey: ["hotel"],
    queryFn: () => hotelApi.getMyHotels({ ownerId: user?.id }),
    gcTime: 10 * 60 * 1000, // Giữ cache trong 10 phút
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
  });

  const { data: amenitiesData, isLoading: isLoadingAmenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  const hotel = hotels?.data[0];

  // Thêm query để lấy thông tin location
  const { data: locationData, isLoading: isLoadingLocation } = useQuery({
    queryKey: ["location", hotel?.locationId],
    queryFn: () => locationApi.getLocation(hotel?.locationId || ""),
    enabled: !!hotel?.locationId,
  });

  // Lưu thông tin hotel vào Redux khi lấy được dữ liệu
  useEffect(() => {
    if (hotels?.data?.[0]) {
      dispatch(setCurrentHotel(hotels.data[0]));
    }
  }, [hotels, dispatch]);

  const updateHotelMutation = useMutation({
    mutationFn: (data: EditedHotelData) => {
      if (!hotel?._id) throw new Error("Hotel ID is required");
      return hotelApi.updateHotel(hotel._id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["hotel"] });

      // Cập nhật Redux store với thông tin khách sạn mới
      if (response.success && response.data) {
        dispatch(setCurrentHotel(response.data));
      }

      toast.success(t("hotelInfo.messages.updateSuccess"));
      setIsEditing(false);
      setEditedData({});
    },
    onError: (error: Error) => {
      toast.error(error.message || t("hotelInfo.messages.updateFailed"));
    },
  });

  const toggleHotelStatusMutation = useMutation({
    mutationFn: (newStatus: "active" | "inactive") => {
      if (!hotel?._id) throw new Error("Hotel ID is required");
      const data: Partial<EditedHotelData> = { status: newStatus };
      return hotelApi.updateHotel(hotel._id, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["hotel"] });

      if (response.success && response.data) {
        dispatch(setCurrentHotel(response.data));
      }

      toast.success(
        response.data.status === "inactive"
          ? t("hotelInfo.messages.deactivateSuccess")
          : t("hotelInfo.messages.activateSuccess")
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t("hotelInfo.messages.updateFailed"));
    },
  });

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
    const policies: Record<string, string> = {};
    policies.checkInTime = checkInTime || hotel.policies.checkInTime;
    policies.checkOutTime = checkOutTime || hotel.policies.checkOutTime;
    policies.cancellationPolicy =
      cancellationPolicy || hotel.policies.cancellationPolicy;
    policies.childrenPolicy = childrenPolicy || hotel.policies.childrenPolicy;
    policies.petPolicy = petPolicy || hotel.policies.petPolicy;
    policies.smokingPolicy = smokingPolicy || hotel.policies.smokingPolicy;

    // Tạo dữ liệu cập nhật với policies được đóng gói
    const dataToUpdate = {
      ...otherData,
      policies,
    };

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
    setEditedData((prev) => {
      if (type === "main") {
        return {
          ...prev,
          featuredImage: undefined,
        };
      } else if (typeof index === "number") {
        // Xóa ảnh tại vị trí index
        const currentImages = [...(prev.images || [])];
        currentImages.splice(index, 1);
        return {
          ...prev,
          images: currentImages,
        };
      }
      return prev;
    });
  };

  const handleToggleStatus = () => {
    const newStatus = hotel?.status === "active" ? "inactive" : "active";
    toggleHotelStatusMutation.mutate(newStatus);
  };

  if (isLoadingHotels || isLoadingAmenities || isLoadingLocation) {
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
          <Button
            variant="ghost"
            className={`flex items-center gap-2 ${
              hotel?.status === "active"
                ? "bg-red-100 hover:bg-red-200 text-red-600"
                : "bg-green-100 hover:bg-green-200 text-green-600"
            }`}
            onClick={handleToggleStatus}
            disabled={toggleHotelStatusMutation.isPending}
          >
            {toggleHotelStatusMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Power className="h-4 w-4" />
            )}
            {hotel?.status === "active"
              ? t("hotelInfo.buttons.deactivate")
              : t("hotelInfo.buttons.activate")}
          </Button>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t("hotelInfo.buttons.cancel")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateHotelMutation.isPending}
                className="flex items-center gap-2"
              >
                {updateHotelMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("hotelInfo.buttons.saving")}
                  </>
                ) : (
                  t("hotelInfo.buttons.save")
                )}
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
        location={locationData?.data}
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
