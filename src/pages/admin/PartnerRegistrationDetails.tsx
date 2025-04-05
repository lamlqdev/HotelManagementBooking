import { useTranslation } from "react-i18next";
import { Building2, Phone, FileText } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApprovePartnerModal from "@/components/admin/modal/ApprovePartnerModal";
import RejectPartnerModal from "@/components/admin/modal/RejectPartnerModal";

// Mock data - sẽ được thay thế bằng dữ liệu thực từ API
const mockPartnerData = {
  id: "1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123456789",
  hotelName: "Grand Hotel",
  hotelAddress: "123 Đường ABC, Quận 1, TP.HCM",
  hotelDescription: "Khách sạn 5 sao với view đẹp...",
  hotelLocationName: "Quận 1",
  hotelLocationDescription: "Gần các điểm du lịch nổi tiếng...",
  hotelAmenities: ["wifi", "parking", "pool", "restaurant"],
  hotelWebsite: "https://grandhotel.com",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  cancellationPolicy: "Hủy phòng trước 24h được hoàn tiền 100%",
  childrenPolicy: "Trẻ em dưới 6 tuổi được miễn phí",
  childrenAgeDefinition: 6,
  petPolicy: "Không cho phép mang thú cưng",
  smokingPolicy: "Không hút thuốc trong phòng",
  featuredImage: "https://example.com/image1.jpg",
  galleryImages: [
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ],
  status: "pending",
  submittedAt: "2024-03-20T10:00:00Z",
};

const PartnerRegistrationDetails = () => {
  const { t } = useTranslation();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({
    incomplete: false,
    invalid: false,
    duplicate: false,
    other: false,
  });
  const [rejectDetails, setRejectDetails] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApprove = () => {
    // TODO: Implement approve logic
    console.log("Approving partner registration:", mockPartnerData.id);
    setShowApproveModal(false);
  };

  const handleReject = (reasons: typeof rejectReasons, details: string) => {
    // TODO: Implement reject logic
    console.log("Rejecting partner registration:", {
      id: mockPartnerData.id,
      reasons,
      details,
    });
    setShowRejectModal(false);
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-8">
          {t("admin.partners.approval.details.title")}
        </h1>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.general.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.hotel_info.hotel_name")}
                </h3>
                <p>{mockPartnerData.hotelName}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.hotel_info.description")}
                </h3>
                <p>{mockPartnerData.hotelDescription}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.address.address")}
                </h3>
                <p>{mockPartnerData.hotelAddress}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.address.tourist_spot")}
                </h3>
                <p>{mockPartnerData.hotelLocationName}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.address.location_desc")}
                </h3>
                <p>{mockPartnerData.hotelLocationDescription}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.hotel_info.amenities")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockPartnerData.hotelAmenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {t(`amenities.${amenity}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Thông tin liên hệ */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.contact.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.contact_info.name")}
                </h3>
                <p>{mockPartnerData.name}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.contact_info.email")}
                </h3>
                <p>{mockPartnerData.email}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.contact_info.phone")}
                </h3>
                <p>{mockPartnerData.phone}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.contact_info.website")}
                </h3>
                <p>{mockPartnerData.hotelWebsite}</p>
              </div>
            </div>
          </Card>

          {/* Chính sách */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.policies.title")}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.check_in_time")}
                </h3>
                <p>{mockPartnerData.checkInTime}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.check_out_time")}
                </h3>
                <p>{mockPartnerData.checkOutTime}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.cancellation")}
                </h3>
                <p>{mockPartnerData.cancellationPolicy}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.children")}
                </h3>
                <p>{mockPartnerData.childrenPolicy}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.pets")}
                </h3>
                <p>{mockPartnerData.petPolicy}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("register_partner.policies.smoking")}
                </h3>
                <p>{mockPartnerData.smokingPolicy}</p>
              </div>
            </div>
          </Card>

          {/* Thông tin bổ sung */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">
                  {t("admin.partners.approval.details.submittedAt")}
                </h3>
                <p>{formatDate(mockPartnerData.submittedAt)}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {t("admin.partners.approval.details.status")}
                </h3>
                <p className="capitalize">{mockPartnerData.status}</p>
              </div>
            </div>
          </Card>

          {/* Nút thao tác */}
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={() => setShowRejectModal(true)}>
              {t("admin.partners.approval.details.actions.reject")}
            </Button>
            <Button onClick={() => setShowApproveModal(true)}>
              {t("admin.partners.approval.details.actions.approve")}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận duyệt */}
      <ApprovePartnerModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        onApprove={handleApprove}
      />

      {/* Modal xác nhận từ chối */}
      <RejectPartnerModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        onReject={handleReject}
        rejectReasons={rejectReasons}
        onRejectReasonsChange={setRejectReasons}
        rejectDetails={rejectDetails}
        onRejectDetailsChange={setRejectDetails}
      />
    </div>
  );
};

export default PartnerRegistrationDetails;
