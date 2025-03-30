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
import { Plus, Pencil } from "lucide-react";
import { Room } from "@/types/room";
import { useTranslation } from "react-i18next";

interface EditRoomDialogProps {
  room: Room;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (room: Room) => void;
}

export function EditRoomDialog({
  room,
  isOpen,
  onOpenChange,
  onSave,
}: EditRoomDialogProps) {
  const { t } = useTranslation();

  const handleAmenityToggle = (index: number, amenities: Room["amenities"]) => {
    const newAmenities = [...amenities];
    newAmenities[index] = {
      ...newAmenities[index],
      selected: !newAmenities[index].selected,
    };
    return newAmenities;
  };

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
              {room.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${t("room.dialog.edit.images")} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-destructive/80 hover:bg-destructive"
                      onClick={() => {
                        const newImages = [...room.images];
                        newImages.splice(index, 1);
                        onSave({ ...room, images: newImages });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
              <div className="relative h-32 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const newImage = e.target?.result as string;
                        onSave({ ...room, images: [...room.images, newImage] });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
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
                  value={room.name}
                  onChange={(e) => onSave({ ...room, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.type")}</Label>
                <Input
                  value={room.type}
                  onChange={(e) => onSave({ ...room, type: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("room.dialog.edit.description")}</Label>
                <Textarea
                  value={room.description}
                  onChange={(e) =>
                    onSave({
                      ...room,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.floor")}</Label>
                <Input
                  type="number"
                  value={room.floor}
                  onChange={(e) =>
                    onSave({
                      ...room,
                      floor: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.bed_type")}</Label>
                <Input
                  value={room.bedType}
                  onChange={(e) =>
                    onSave({
                      ...room,
                      bedType: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.capacity")}</Label>
                <Input
                  type="number"
                  value={room.capacity}
                  onChange={(e) =>
                    onSave({
                      ...room,
                      capacity: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("room.dialog.edit.size")}</Label>
                <Input
                  value={room.size}
                  onChange={(e) => onSave({ ...room, size: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-medium">{t("room.dialog.edit.amenities")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg border"
                >
                  <Checkbox
                    id={`amenity-${index}`}
                    checked={amenity.selected}
                    onCheckedChange={() => {
                      const newAmenities = handleAmenityToggle(
                        index,
                        room.amenities
                      );
                      onSave({ ...room, amenities: newAmenities });
                    }}
                  />
                  <Label
                    htmlFor={`amenity-${index}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <amenity.icon className="w-4 h-4" />
                    {amenity.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-background border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("room.dialog.edit.cancel")}
          </Button>
          <Button onClick={() => onSave(room)}>
            {t("room.dialog.edit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
