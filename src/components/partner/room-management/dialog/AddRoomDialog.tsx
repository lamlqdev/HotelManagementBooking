import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Plus, Trash2, Loader2 } from "lucide-react";

import { amenitiesApi } from "@/api/amenities/amenities.api";
import { createRoomSchema, type CreateRoomFormData } from "@/api/room/types";
import { getAmenityIcon } from "@/utils/amenityIcons";
import { useAppSelector } from "@/store/hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface AddRoomDialogProps {
  onAdd: (room: CreateRoomFormData) => void;
  isLoading?: boolean;
}

export function AddRoomDialog({
  onAdd,
  isLoading = false,
}: AddRoomDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { currentHotel } = useAppSelector((state) => state.hotel);
  const { data: amenitiesResponse, isLoading: amenitiesLoading } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => amenitiesApi.getAmenities(),
  });
  const amenities = amenitiesResponse?.data || [];
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      hotelId: currentHotel?._id || "",
      name: "",
      description: "",
      floor: 1,
      roomType: "Standard",
      bedType: "Single",
      price: 250000,
      capacity: 2,
      squareMeters: 20,
      amenities: [],
      images: [],
      cancellationPolicy: "flexible",
      status: "available",
    },
  });

  useEffect(() => {
    if (currentHotel?._id) {
      form.setValue("hotelId", currentHotel._id);
    }
  }, [currentHotel?._id, form]);

  const handleSubmit = (data: CreateRoomFormData) => {
    if (!currentHotel?._id) {
      toast.error(t("info.noHotelSelected"));
      return;
    }
    onAdd({
      ...data,
      images: selectedImages,
    });
    // Reset form và đóng dialog
    form.reset();
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Kiểm tra số lượng ảnh
    if (selectedImages.length + newFiles.length > 10) {
      toast.error(t("room.dialog.edit.max_images_error"));
      return;
    }

    // Kiểm tra kích thước và định dạng ảnh
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    newFiles.forEach((file) => {
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

    const updatedImages = [...selectedImages, ...validFiles];
    setSelectedImages(updatedImages);
    setImagePreviewUrls([...imagePreviewUrls, ...validUrls]);
    form.setValue("images", updatedImages);
  };

  const removeImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreviewUrls = [...imagePreviewUrls];

    // Hủy URL object để tránh rò rỉ bộ nhớ
    URL.revokeObjectURL(newImagePreviewUrls[index]);

    newSelectedImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setImagePreviewUrls(newImagePreviewUrls);
    form.setValue("images", newSelectedImages);
  };

  // Lọc chỉ lấy tiện ích phòng
  const roomAmenities = Array.isArray(amenities)
    ? amenities.filter((amenity) => amenity.type === "room")
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("room.dialog.add.adding")}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {t("room.dialog.add.title")}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("room.dialog.add.title")}</DialogTitle>
          <DialogDescription>
            {t("room.dialog.add.description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("room.dialog.edit.basic_info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>{t("room.dialog.edit.description")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("room.dialog.edit.select_type")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard">
                            Phòng Tiêu Chuẩn
                          </SelectItem>
                          <SelectItem value="Superior">
                            Phòng Superior
                          </SelectItem>
                          <SelectItem value="Deluxe">Phòng Deluxe</SelectItem>
                          <SelectItem value="Suite">Phòng Suite</SelectItem>
                          <SelectItem value="Family">Phòng Gia Đình</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.floor")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.bed_type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "room.dialog.edit.select_bed_type"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">1 Giường Đơn</SelectItem>
                          <SelectItem value="Double">1 Giường Đôi</SelectItem>
                          <SelectItem value="Twin">2 Giường Đơn</SelectItem>
                          <SelectItem value="Queen">1 Giường Queen</SelectItem>
                          <SelectItem value="King">1 Giường King</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.capacity")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="squareMeters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.dialog.edit.size")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("room.detail.price")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="pl-8"
                          />
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Images */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {t("room.dialog.edit.images")}
                </h3>
                <Badge variant="outline">
                  {selectedImages.length}/10 {t("room.dialog.edit.images")}
                </Badge>
              </div>
              {form.formState.errors.images && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.images.message}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-full">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t("room.dialog.edit.upload_images")}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      {t("room.dialog.edit.upload_hint")}
                    </p>
                  </div>
                </div>

                {/* Image previews */}
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("room.dialog.edit.amenities")}
              </h3>
              {form.formState.errors.amenities && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amenities.message}
                </p>
              )}
              {amenitiesLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {roomAmenities.map((amenity) => (
                      <FormField
                        key={amenity._id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(amenity._id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValue,
                                      amenity._id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (id: string) => id !== amenity._id
                                      )
                                    );
                                  }
                                }}
                                className="border-primary"
                              />
                            </FormControl>
                            <div className="flex items-center gap-2">
                              {amenity.icon && getAmenityIcon(amenity.icon)}
                              <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {amenity.name}
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("room.dialog.add.adding")}
                  </>
                ) : (
                  t("room.dialog.add.add")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
