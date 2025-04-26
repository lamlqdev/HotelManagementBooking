import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Loader2,
  Ruler,
  Shield,
  Tag,
  Users,
  Dog,
  Ban,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

import { roomApi } from "@/api/room/room.api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { AddPromotionDialog } from "@/components/partner/room-management/dialog/AddPromotionDialog";
import { DeleteRoomDialog } from "@/components/partner/room-management/dialog/DeleteRoomDialog";
import { EditRoomDialog } from "@/components/partner/room-management/dialog/EditRoomDialog";
import { UpdatePriceDialog } from "@/components/partner/room-management/dialog/UpdatePriceDialog";
import { getAmenityIcon } from "@/utils/amenityIcons";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemovingDiscount, setIsRemovingDiscount] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const queryClient = useQueryClient();
  const { currentHotel } = useAppSelector((state) => state.hotel);

  const {
    data: roomResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["room", id],
    queryFn: () => roomApi.getRoom(id || ""),
    enabled: !!id,
  });

  const room = roomResponse?.data;

  // Mutation để xóa phòng
  const deleteRoomMutation = useMutation({
    mutationFn: () => roomApi.deleteRoom(id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("room.dialog.delete.success"));
      setIsDeleting(false);
      navigate("/partner/hotels/rooms");
    },
    onError: (error: Error) => {
      toast.error(error.message || t("room.dialog.delete.error"));
      setIsDeleting(false);
    },
  });

  // Mutation để xóa khuyến mãi
  const removeDiscountMutation = useMutation({
    mutationFn: () => roomApi.removeRoomDiscount(id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
      toast.success(t("room.dialog.remove_discount.success"));
      setIsRemovingDiscount(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("room.dialog.remove_discount.error"));
      setIsRemovingDiscount(false);
    },
  });

  const handleDelete = () => {
    if (confirmName !== room?.roomName) {
      toast.error(t("room.dialog.delete.name_mismatch"));
      return;
    }

    deleteRoomMutation.mutate();
  };

  const handleRemoveDiscount = () => {
    setIsRemovingDiscount(true);
    removeDiscountMutation.mutate();
  };

  const handleConfirmNameChange = (name: string) => {
    setConfirmName(name);
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (isError || !room) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/partner/hotels/rooms">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("room.detail.title")}
            </h1>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error.title")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : t("error.loadRoomFailed")}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {t("common.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/partner/hotels/rooms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("room.detail.title")}
          </h1>
        </div>
        <div className="flex gap-3">
          <EditRoomDialog
            room={room}
            isOpen={isEditing}
            onOpenChange={setIsEditing}
          />
          <DeleteRoomDialog
            isOpen={isDeleting}
            onOpenChange={setIsDeleting}
            onDelete={handleDelete}
            onConfirmNameChange={handleConfirmNameChange}
          />
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <div className="relative h-[600px]">
          <img
            src={room.images[currentImageIndex]?.url || ""}
            alt={`${room.roomName} - Hình ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-4xl font-bold text-white mb-2">
                {room.roomName}
              </h2>
              <p className="text-xl text-white/90">{room.roomType}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev - 1 + room.images.length) % room.images.length
              )
            }
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
            onClick={() =>
              setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
            }
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-white">
            <ImageIcon className="w-4 h-4" />
            <span>
              {currentImageIndex + 1}/{room.images.length}
            </span>
          </div>
        </div>
        <div className="p-4 flex gap-2 overflow-x-auto">
          {room.images.map((image, index) => (
            <div
              key={index}
              className={`relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
                currentImageIndex === index ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Room Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {t("room.detail.basic_info")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {room.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("room.dialog.edit.floor")}
                      </p>
                      <p className="font-medium">{room.floor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <BedDouble className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("room.dialog.edit.bed_type")}
                      </p>
                      <p className="font-medium">{room.bedType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("room.dialog.edit.capacity")}
                      </p>
                      <p className="font-medium">
                        {room.capacity} {t("common.people")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("room.dialog.edit.size")}
                      </p>
                      <p className="font-medium">{room.squareMeters}m²</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {t("room.detail.amenities")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 text-primary rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  >
                    {amenity.icon && getAmenityIcon(amenity.icon)}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {t("room.detail.settings")}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">
                      {t("room.detail.check_in_out.title")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t("room.detail.check_in")}:{" "}
                      {currentHotel?.policies.checkInTime}
                      <br />
                      {t("room.detail.check_out")}:{" "}
                      {currentHotel?.policies.checkOutTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">
                      {t("room.detail.cancel_policy.title")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t(
                        `room.detail.cancel_policy.${currentHotel?.policies.cancellationPolicy}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">
                      {t("room.detail.children_policy.title")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t(
                        `room.detail.children_policy.${currentHotel?.policies.childrenPolicy}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Dog className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">
                      {t("room.detail.pet_policy.title")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t(
                        `room.detail.pet_policy.${currentHotel?.policies.petPolicy}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">
                      {t("room.detail.smoking_policy.title")}
                    </h4>
                    <p className="text-muted-foreground">
                      {t(
                        `room.detail.smoking_policy.${currentHotel?.policies.smokingPolicy}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Pricing & Promotions */}
        <div className="space-y-6">
          {/* Price */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {t("room.detail.price")}
              </h3>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary">
                  {room.discountPercent > 0
                    ? (
                        room.price *
                        (1 - room.discountPercent / 100)
                      ).toLocaleString()
                    : room.price.toLocaleString()}
                  đ
                </p>
                <p className="text-muted-foreground">
                  {t("room.detail.per_night")}
                </p>
                {room.discountPercent > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground line-through">
                      {room.price.toLocaleString()}đ
                    </p>
                    <p className="text-sm font-medium text-destructive">
                      -{room.discountPercent}% {t("room.detail.discount")}
                    </p>
                    {room.discountStartDate && room.discountEndDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("room.detail.valid_until")}:{" "}
                        {new Date(room.discountEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <UpdatePriceDialog
                roomId={id || ""}
                price={room.price}
                isOpen={isUpdatingPrice}
                onOpenChange={setIsUpdatingPrice}
              />
            </CardContent>
          </Card>

          {/* Promotions */}
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  {t("room.detail.promotions")}
                </h3>
                <AddPromotionDialog roomId={id || ""} />
              </div>
              <div className="space-y-4">
                {/* Promotions sẽ được thêm sau khi có API */}
                {room.discountPercent > 0 ? (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <h4 className="font-medium">
                        {t("room.detail.current_discount")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("room.detail.valid_until")}:{" "}
                        {new Date(
                          room.discountEndDate || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">
                        -{room.discountPercent}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={handleRemoveDiscount}
                        disabled={isRemovingDiscount}
                      >
                        {isRemovingDiscount ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {t("room.detail.no_promotions")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
