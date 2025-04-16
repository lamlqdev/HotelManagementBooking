import { Camera, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/types/hotel";
import { useRef, useState, useEffect } from "react";

interface ImagesSectionProps {
  hotel: Hotel;
  isEditing: boolean;
  onImageChange: (type: "main" | "gallery", file: File, index?: number) => void;
  onRemoveImage: (type: "main" | "gallery", index?: number) => void;
}

export const ImagesSection = ({
  hotel,
  isEditing,
  onImageChange,
  onRemoveImage,
}: ImagesSectionProps) => {
  const { t } = useTranslation();
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<{
    [key: number]: string;
  }>({});
  const [removedImages, setRemovedImages] = useState<number[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRefs = useRef<{
    [key: number]: HTMLInputElement | null;
  }>({});
  const newImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hotel.images) {
      const newPreviews: { [key: number]: string } = {};
      hotel.images.forEach((image, index) => {
        if (!removedImages.includes(index)) {
          newPreviews[index] = image.url;
        }
      });
      setGalleryImagePreviews(newPreviews);
    }
  }, [hotel.images, removedImages]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleImageChange = (
    type: "main" | "gallery",
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "main") {
        setMainImagePreview(previewUrl);
      } else if (index !== undefined) {
        setGalleryImagePreviews((prev) => ({
          ...prev,
          [index]: previewUrl,
        }));
        setRemovedImages((prev) => prev.filter((i) => i !== index));
      }
      onImageChange(type, file, index);
    }
  };

  const handleDrop = (
    type: "main" | "gallery",
    e: React.DragEvent,
    index?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "main") {
        setMainImagePreview(previewUrl);
      } else if (index !== undefined) {
        setGalleryImagePreviews((prev) => ({
          ...prev,
          [index]: previewUrl,
        }));
        setRemovedImages((prev) => prev.filter((i) => i !== index));
      }
      onImageChange(type, file, index);
    }
  };

  const handleRemoveImage = (type: "main" | "gallery", index?: number) => {
    if (type === "main") {
      setMainImagePreview(null);
      onRemoveImage(type);
    } else if (index !== undefined) {
      setRemovedImages((prev) => [...prev, index]);
      setGalleryImagePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[index];
        return newPreviews;
      });
      onRemoveImage(type, index);
    }
  };

  const setGalleryInputRef = (
    index: number,
    element: HTMLInputElement | null
  ) => {
    galleryImageInputRefs.current[index] = element;
  };

  const handleAddNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newIndex =
        (hotel.images?.length || 0) + Object.keys(galleryImagePreviews).length;
      const previewUrl = URL.createObjectURL(file);
      setGalleryImagePreviews((prev) => ({
        ...prev,
        [newIndex]: previewUrl,
      }));
      onImageChange("gallery", file, newIndex);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          {t("hotelInfo.general.images")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <Label className="text-base">
              {t("hotelInfo.general.mainImage")}
            </Label>
          </div>
          <div
            className={`relative group ${
              dragActive ? "border-primary bg-primary/10" : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop("main", e)}
          >
            <img
              src={mainImagePreview || hotel.featuredImage?.url}
              alt={t("hotelInfo.general.mainImageAlt")}
              className="w-full h-[400px] object-cover rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={mainImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageChange("main", e)}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex items-center gap-2"
                      onClick={() => mainImageInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      {t("hotelInfo.general.changeImage")}
                    </Button>
                    {mainImagePreview && (
                      <Button
                        variant="destructive"
                        size="lg"
                        className="flex items-center gap-2"
                        onClick={() => handleRemoveImage("main")}
                      >
                        <X className="w-4 h-4" />
                        {t("hotelInfo.general.removeImage")}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <Label className="text-base">
              {t("hotelInfo.general.galleryImages")}
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotel.images?.map((image, index) => {
              if (removedImages.includes(index)) return null;

              return (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={galleryImagePreviews[index] || image.url}
                    alt={t("hotelInfo.general.galleryImageAlt", {
                      index: index + 1,
                    })}
                    className="w-full h-full object-cover rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={(el) => setGalleryInputRef(index, el)}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange("gallery", e, index)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                            onClick={() =>
                              galleryImageInputRefs.current[index]?.click()
                            }
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleRemoveImage("gallery", index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {isEditing && (
              <>
                <input
                  type="file"
                  ref={newImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAddNewImage}
                />
                <div
                  className={`aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer relative group ${
                    dragActive ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => newImageInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const newIndex = hotel.images?.length || 0;
                      const previewUrl = URL.createObjectURL(file);
                      setGalleryImagePreviews((prev) => ({
                        ...prev,
                        [newIndex]: previewUrl,
                      }));
                      onImageChange("gallery", file, newIndex);
                    }
                  }}
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {t("hotelInfo.general.addImage")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
