import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockHotelData, availableAmenities } from "@/mock/hotelData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Save,
  Wifi,
  Waves,
  Utensils,
  Dumbbell,
  Heart,
  ParkingCircle,
  Phone,
  Mail,
  Globe,
  Building2,
  ContactRound,
  FileText,
  Snowflake,
  Wine,
  Lock,
  Sun,
  Coffee,
  Bell,
  Users,
  Briefcase,
  Presentation,
  MapPin,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function HotelInfoPage() {
  const [hotel, setHotel] = useState(mockHotelData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case "wifi":
        return <Wifi className="w-5 h-5" />;
      case "parking":
        return <ParkingCircle className="w-5 h-5" />;
      case "elevator":
        return <Building2 className="w-5 h-5" />;
      case "air-conditioning":
        return <Snowflake className="w-5 h-5" />;
      case "minibar":
        return <Wine className="w-5 h-5" />;
      case "safe":
        return <Lock className="w-5 h-5" />;
      case "balcony":
        return <Sun className="w-5 h-5" />;
      case "ocean-view":
        return <Waves className="w-5 h-5" />;
      case "pool":
        return <Waves className="w-5 h-5" />;
      case "gym":
        return <Dumbbell className="w-5 h-5" />;
      case "spa":
        return <Heart className="w-5 h-5" />;
      case "tennis":
        return <Dumbbell className="w-5 h-5" />;
      case "restaurant":
        return <Utensils className="w-5 h-5" />;
      case "bar":
        return <Wine className="w-5 h-5" />;
      case "cafe":
        return <Coffee className="w-5 h-5" />;
      case "room-service":
        return <Bell className="w-5 h-5" />;
      case "meeting-room":
        return <Users className="w-5 h-5" />;
      case "business-center":
        return <Briefcase className="w-5 h-5" />;
      case "conference-hall":
        return <Presentation className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setHotel((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thông tin khách sạn</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        ) : (
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </Button>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="inline-flex h-12 items-center justify-center rounded-md bg-secondary p-1 text-secondary-foreground w-full max-w-md">
          <TabsTrigger
            value="general"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex-1"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Chung
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex-1"
          >
            <ContactRound className="w-4 h-4 mr-2" />
            Liên hệ
          </TabsTrigger>
          <TabsTrigger
            value="policies"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Chính sách
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Building2 className="w-4 h-4" />
                  <Label htmlFor="name">Tên khách sạn</Label>
                </div>
                <Input
                  id="name"
                  name="name"
                  value={hotel.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <MapPin className="w-4 h-4" />
                  <Label htmlFor="address">Địa chỉ</Label>
                </div>
                <Input
                  id="address"
                  name="address"
                  value={hotel.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 min-w-[120px] pt-2">
                  <FileText className="w-4 h-4" />
                  <Label htmlFor="description">Mô tả</Label>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={hotel.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ảnh khách sạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <Label className="text-base">Ảnh đại diện</Label>
                </div>
                <div className="relative group">
                  <img
                    src={hotel.mainImage}
                    alt="Ảnh đại diện khách sạn"
                    className="w-full h-[400px] object-cover rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Thay đổi ảnh
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Ảnh đại diện sẽ được hiển thị ở vị trí nổi bật nhất của khách
                  sạn
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <Label className="text-base">Ảnh mô tả</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hotel.galleryImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={image}
                        alt={`Ảnh mô tả ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Thêm ảnh
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Thêm các ảnh mô tả chi tiết về khách sạn của bạn
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiện nghi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {["basic", "room", "entertainment", "dining", "business"].map(
                (category) => (
                  <div key={category} className="space-y-3">
                    <Label className="text-base font-semibold">
                      {category === "basic" && "Tiện nghi cơ bản"}
                      {category === "room" && "Tiện nghi phòng"}
                      {category === "entertainment" && "Tiện nghi giải trí"}
                      {category === "dining" && "Tiện nghi ăn uống"}
                      {category === "business" && "Tiện nghi kinh doanh"}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableAmenities
                        .filter((amenity) => amenity.category === category)
                        .map((amenity) => (
                          <div
                            key={amenity.id}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            <Checkbox
                              id={amenity.id}
                              checked={hotel.amenities.includes(amenity.id)}
                              onCheckedChange={() =>
                                handleAmenityToggle(amenity.id)
                              }
                              disabled={!isEditing}
                            />
                            <div className="flex items-center gap-2">
                              {getAmenityIcon(amenity.icon)}
                              <Label
                                htmlFor={amenity.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {amenity.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Phone className="w-4 h-4" />
                  <Label htmlFor="phone">Số điện thoại</Label>
                </div>
                <Input
                  id="phone"
                  name="phone"
                  value={hotel.contactInfo.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Mail className="w-4 h-4" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={hotel.contactInfo.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Globe className="w-4 h-4" />
                  <Label htmlFor="website">Website</Label>
                </div>
                <Input
                  id="website"
                  name="website"
                  value={hotel.contactInfo.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chính sách khách sạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giờ check-in</Label>
                  <Input
                    value={hotel.policies.checkIn}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giờ check-out</Label>
                  <Input
                    value={hotel.policies.checkOut}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Chính sách hủy phòng</Label>
                <Textarea
                  value={hotel.policies.cancellation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>Chính sách trẻ em</Label>
                <Textarea
                  value={hotel.policies.children}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>Chính sách thú cưng</Label>
                <Textarea
                  value={hotel.policies.pets}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>Chính sách hút thuốc</Label>
                <Textarea
                  value={hotel.policies.smoking}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
