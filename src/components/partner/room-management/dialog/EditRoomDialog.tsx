import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Loader2, X } from "lucide-react";
import { Room } from "@/types/room";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { roomApi } from "@/api/room/room.api";
import { UpdateRoomData } from "@/api/room/types";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { amenitiesApi } from "@/api/amenities/amenities.api";
import { Amenity } from "@/types/amenity";
import { getAmenityIcon } from "@/utils/amenityIcons";

interface EditRoomDialogProps {
  room: Room;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoomDialog({
  room,
  isOpen,
  onOpenChange,
}: EditRoomDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editedRoom, setEditedRoom] = useState<Room>(room);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEditedRoom(room);
      setNewImages([]);
      setImagePreviewUrls([]);
    }
  }, [isOpen, room]);

  // Lấy danh sách tiện nghi từ API
  const { data: amenitiesResponse } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });

  // Lọc chỉ lấy tiện nghi phòng
  const availableAmenities =
    amenitiesResponse?.data.filter(
      (amenity: Amenity) => amenity.type === "room"
    ) || [];

  // Lọc tiện nghi đã chọn và chưa chọn
  const selectedAmenities = availableAmenities.filter((amenity: Amenity) =>
    editedRoom.amenities.some((a) => a._id === amenity._id)
  );

  const unselectedAmenities = availableAmenities.filter(
    (amenity: Amenity) =>
      !editedRoom.amenities.some((a) => a._id === amenity._id)
  );

  const updateRoomMutation = useMutation({
    mutationFn: (data: UpdateRoomData) => {
      const formData = new FormData();

      // Thêm các trường thông tin cơ bản nếu có
      if (data.roomName) formData.append("roomName", data.roomName);
      if (data.floor) formData.append("floor", data.floor.toString());
      if (data.roomType) formData.append("roomType", data.roomType);
      if (data.bedType) formData.append("bedType", data.bedType);
      if (data.description) formData.append("description", data.description);
      if (data.capacity) formData.append("capacity", data.capacity.toString());
      if (data.squareMeters)
        formData.append("squareMeters", data.squareMeters.toString());
      if (data.status) formData.append("status", data.status);

      // Thêm amenities nếu có
      if (data.amenities && data.amenities.length > 0) {
        formData.append("amenities", JSON.stringify(data.amenities));
      }

      // Thêm danh sách ảnh cũ cần giữ lại
      const existingImages = editedRoom.images.filter((img) => img.publicId);
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Thêm hình ảnh mới
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      return roomApi.updateRoom(room._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", room._id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("room.dialog.edit.success"));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("room.dialog.edit.error"));
    },
  });

  const handleAmenityToggle = (amenityId: string) => {
    const isSelected = editedRoom.amenities.some((a) => a._id === amenityId);
    const amenity = availableAmenities.find((a) => a._id === amenityId);

    if (!amenity) return;

    if (isSelected) {
      setEditedRoom((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((a) => a._id !== amenityId),
      }));
    } else {
      setEditedRoom((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
  };

  const handleImageDelete = (imageUrl: string) => {
    // Chỉ cho phép xóa nếu còn ít nhất 1 hình
    if (editedRoom.images.length <= 1) {
      toast.error(t("room.dialog.edit.min_images_error"));
      return;
    }

    // Nếu là ảnh mới (không có publicId), xóa khỏi newImages
    const imageToDelete = editedRoom.images.find((img) => img.url === imageUrl);
    if (imageToDelete && !imageToDelete.publicId) {
      const fileToRemove = newImages.find(
        (file) => URL.createObjectURL(file) === imageUrl
      );
      if (fileToRemove) {
        setNewImages((prev) => prev.filter((file) => file !== fileToRemove));
      }
    }

    setEditedRoom((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== imageUrl),
    }));
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Kiểm tra số lượng ảnh tối đa (ví dụ: 10 ảnh)
      if (editedRoom.images.length + files.length > 10) {
        toast.error(t("room.dialog.edit.max_images_error"));
        return;
      }

      // Kiểm tra kích thước và định dạng ảnh
      const validFiles: File[] = [];
      const validUrls: string[] = [];

      Array.from(files).forEach((file) => {
        // Kiểm tra định dạng
        if (!file.type.startsWith("image/")) {
          toast.error(t("room.dialog.edit.invalid_image_format"));
          return;
        }

        // Kiểm tra kích thước (tối đa 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(t("room.dialog.edit.image_too_large"));
          return;
        }

        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      });

      setNewImages((prev) => [...prev, ...validFiles]);
      setImagePreviewUrls((prev) => [...prev, ...validUrls]);

      // Thêm ảnh mới vào editedRoom
      setEditedRoom((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          ...validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            publicId: "",
            filename: file.name,
          })),
        ],
      }));
    }
  };

  const handleSave = () => {
    // Kiểm tra số lượng hình ảnh tối thiểu
    if (editedRoom.images.length === 0) {
      toast.error(t("room.dialog.edit.min_images_error"));
      return;
    }

    const updateData: UpdateRoomData = {};

    if (editedRoom.roomName !== room.roomName)
      updateData.roomName = editedRoom.roomName;
    if (editedRoom.roomType !== room.roomType)
      updateData.roomType = editedRoom.roomType;
    if (editedRoom.bedType !== room.bedType)
      updateData.bedType = editedRoom.bedType;
    if (editedRoom.description !== room.description)
      updateData.description = editedRoom.description;
    if (editedRoom.capacity !== room.capacity)
      updateData.capacity = editedRoom.capacity;
    if (editedRoom.squareMeters !== room.squareMeters)
      updateData.squareMeters = editedRoom.squareMeters;
    if (editedRoom.status !== room.status)
      updateData.status = editedRoom.status;
    if (editedRoom.floor !== room.floor) updateData.floor = editedRoom.floor;
    if (
      JSON.stringify(editedRoom.amenities.map((a) => a._id)) !==
      JSON.stringify(room.amenities.map((a) => a._id))
    ) {
      updateData.amenities = editedRoom.amenities.map((a) => a._id);
    }

    updateRoomMutation.mutate(updateData);
  };

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          {t("room.detail.edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("room.dialog.edit.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.images")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {editedRoom.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={`${t("room.dialog.edit.images")} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.url)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="relative h-32 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageAdd}
                />
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.basic_info")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.name")}</Label>
                <Input
                  value={editedRoom.roomName || ""}
                  onChange={(e) =>
                    setEditedRoom((prev) => ({
                      ...prev,
                      roomName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.type")}</Label>
                <Select
                  value={editedRoom.roomType}
                  onValueChange={(value) =>
                    setEditedRoom((prev) => ({
                      ...prev,
                      roomType: value as Room["roomType"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("room.dialog.edit.select_type")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Phòng Tiêu Chuẩn</SelectItem>
                    <SelectItem value="Superior">Phòng Superior</SelectItem>
                    <SelectItem value="Deluxe">Phòng Deluxe</SelectItem>
                    <SelectItem value="Suite">Phòng Suite</SelectItem>
                    <SelectItem value="Family">Phòng Gia Đình</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("room.dialog.edit.description")}</Label>
                <Textarea
                  value={editedRoom.description || ""}
                  onChange={(e) =>
                    setEditedRoom((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.floor")}</Label>
                <Input
                  type="number"
                  value={editedRoom.floor || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value);
                    setEditedRoom((prev) => ({ ...prev, floor: value }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.bed_type")}</Label>
                <Select
                  value={editedRoom.bedType}
                  onValueChange={(value) =>
                    setEditedRoom((prev) => ({
                      ...prev,
                      bedType: value as Room["bedType"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("room.dialog.edit.select_bed_type")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">1 Giường Đơn</SelectItem>
                    <SelectItem value="Double">1 Giường Đôi</SelectItem>
                    <SelectItem value="Twin">2 Giường Đơn</SelectItem>
                    <SelectItem value="Queen">1 Giường Queen</SelectItem>
                    <SelectItem value="King">1 Giường King</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.capacity")}</Label>
                <Input
                  type="number"
                  value={editedRoom.capacity || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value);
                    setEditedRoom((prev) => ({ ...prev, capacity: value }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.size")}</Label>
                <Input
                  type="number"
                  value={editedRoom.squareMeters || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value);
                    setEditedRoom((prev) => ({ ...prev, squareMeters: value }));
                  }}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.amenities")}</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("hotelInfo.general.selectedAmenities")}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedAmenities.map((amenity) => (
                    <div
                      key={amenity._id}
                      className="flex items-center space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      <Checkbox
                        id={amenity._id}
                        checked={true}
                        onCheckedChange={() => handleAmenityToggle(amenity._id)}
                        className="border-primary"
                      />
                      <div className="flex items-center gap-2">
                        {getAmenityIcon(amenity.icon || "default-icon")}
                        <Label
                          htmlFor={amenity._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("hotelInfo.general.availableAmenities")}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {unselectedAmenities.map((amenity) => (
                    <div
                      key={amenity._id}
                      className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                    >
                      <Checkbox
                        id={amenity._id}
                        checked={false}
                        onCheckedChange={() => handleAmenityToggle(amenity._id)}
                      />
                      <div className="flex items-center gap-2">
                        {getAmenityIcon(amenity.icon || "default-icon")}
                        <Label
                          htmlFor={amenity._id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("room.dialog.edit.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={updateRoomMutation.isPending}>
            {updateRoomMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("room.dialog.edit.saving")}
              </>
            ) : (
              t("room.dialog.edit.save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
