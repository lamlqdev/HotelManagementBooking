import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAmenities } from "@/hooks/useAmenities";
import { getAmenityIcon } from "@/utils/amenityIcons";
import { Skeleton } from "@/components/ui/skeleton";

interface AddRoomDialogProps {
  onAdd: (room: {
    name: string;
    type: string;
    description: string;
    floor: number;
    bedType: string;
    capacity: number;
    size: string;
    price: number;
    images: string[];
    amenities: string[];
  }) => void;
}

export function AddRoomDialog({ onAdd }: AddRoomDialogProps) {
  const { t } = useTranslation();
  const { data: amenities, isLoading } = useAmenities();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAdd({
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      floor: Number(formData.get("floor")),
      bedType: formData.get("bedType") as string,
      capacity: Number(formData.get("capacity")),
      size: formData.get("size") as string,
      price: Number(formData.get("price")),
      images: [],
      amenities: selectedAmenities,
    });
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  // Lọc chỉ lấy tiện ích phòng
  const roomAmenities =
    amenities?.filter((amenity) => amenity.type === "room") || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t("room.dialog.add.title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("room.dialog.add.title")}</DialogTitle>
          <DialogDescription>
            {t("room.dialog.add.description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.basic_info")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.name")}</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.type")}</Label>
                <Input name="type" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("room.dialog.edit.description")}</Label>
                <Textarea name="description" rows={4} required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.floor")}</Label>
                <Input name="floor" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.bed_type")}</Label>
                <Input name="bedType" required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.capacity")}</Label>
                <Input name="capacity" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.size")}</Label>
                <Input name="size" required />
              </div>
              <div className="space-y-2">
                <Label>{t("room.detail.price")}</Label>
                <div className="relative">
                  <Input name="price" type="number" className="pl-8" required />
                  <span className="absolute left-3 top-2.5 text-muted-foreground">
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.images")}</h3>
            <div className="relative h-32 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    // Handle multiple file uploads here
                  }
                }}
              />
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.amenities")}</h3>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {roomAmenities.map((amenity) => (
                  <div
                    key={amenity._id}
                    className="flex items-center space-x-2 p-3 bg-secondary/5 border border-border rounded-lg hover:bg-secondary/10 transition-colors"
                  >
                    <Checkbox
                      id={amenity._id}
                      checked={selectedAmenities.includes(amenity._id)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity._id, checked as boolean)
                      }
                      className="border-primary"
                    />
                    <div className="flex items-center gap-2">
                      {amenity.icon && getAmenityIcon(amenity.icon)}
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
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
            <Button type="submit" className="w-full">
              {t("room.dialog.add.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
