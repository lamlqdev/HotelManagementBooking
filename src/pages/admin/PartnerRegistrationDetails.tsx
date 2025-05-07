import { useTranslation } from "react-i18next";
import { Building2, Phone, FileText, Image, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ApprovePartnerModal from "@/components/admin/partner-register-management/ApprovePartnerModal";
import RejectPartnerModal from "@/components/admin/partner-register-management/RejectPartnerModal";

import { partnerApi } from "@/api/partner/partner.api";
import { Partner } from "@/api/partner/types";
import { formatDate } from "@/utils/timeUtils";

const PartnerRegistrationDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const partner = location.state?.partner as Partner;

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({
    incomplete: false,
    invalid: false,
    duplicate: false,
    other: false,
  });
  const [rejectDetails, setRejectDetails] = useState("");

  if (!partner) {
    navigate("/admin/partners");
    return null;
  }

  const handleBack = () => {
    navigate("/admin/partners");
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const loadingToast = toast.loading(
        t("admin.partners.approval.approving")
      );

      await partnerApi.approvePartner(partner.user._id);

      toast.dismiss(loadingToast);
      toast.success(t("admin.partners.approval.approveSuccess"));
      setShowApproveModal(false);
      navigate("/admin/partners");
    } catch (error) {
      toast.error(t("admin.partners.approval.approveError"));
      console.error("Error approving partner:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const loadingToast = toast.loading(
        t("admin.partners.approval.rejecting")
      );

      await partnerApi.rejectPartner(partner.user._id, rejectDetails);

      toast.dismiss(loadingToast);
      toast.success(t("admin.partners.approval.rejectSuccess"));
      setShowRejectModal(false);
      navigate("/admin/partners");
    } catch (error) {
      toast.error(t("admin.partners.approval.rejectError"));
      console.error("Error rejecting partner:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {t("admin.partners.approval.details.title")}
            </h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(true)}
                disabled={isRejecting || isApproving}
              >
                {isRejecting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    {t("common.rejecting")}
                  </div>
                ) : (
                  t("admin.partners.approval.details.actions.reject")
                )}
              </Button>
              <Button
                onClick={() => setShowApproveModal(true)}
                disabled={isRejecting || isApproving}
              >
                {isApproving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    {t("common.approving")}
                  </div>
                ) : (
                  t("admin.partners.approval.details.actions.approve")
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Hình ảnh khách sạn */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Image className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.images.title")}
              </h2>
            </div>
            <div className="space-y-8">
              {/* Ảnh đại diện */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t("register_partner.sections.images.featured")}
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={partner.hotel.featuredImage.url}
                    alt={partner.hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Thư viện ảnh */}
              {partner.hotel.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {t("register_partner.sections.images.gallery")}
                  </h3>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {partner.hotel.images.map((image) => (
                        <CarouselItem
                          key={image.publicId}
                          className="basis-1/3"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image.url}
                              alt={image.filename}
                              className="w-full h-full object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              )}
            </div>
          </Card>

          {/* Thông tin cơ bản */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.general.title")}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.hotel_info.hotel_name")}
                </h3>
                <p className="text-base">{partner.hotel.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.address.address")}
                </h3>
                <p className="text-base">{partner.hotel.address}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.hotel_info.description")}
                </h3>
                <p className="text-base">{partner.hotel.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.address.tourist_spot")}
                </h3>
                <p className="text-base">{partner.hotel.locationName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.address.location_desc")}
                </h3>
                <p className="text-base">{partner.hotel.locationDescription}</p>
              </div>
            </div>
          </Card>

          {/* Thông tin liên hệ */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.contact.title")}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.contact_info.name")}
                </h3>
                <p className="text-base">{partner.user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.contact_info.phone")}
                </h3>
                <p className="text-base">{partner.user.phone}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.contact_info.email")}
                </h3>
                <p className="text-base">{partner.user.email}</p>
              </div>
            </div>
          </Card>

          {/* Chính sách */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {t("register_partner.sections.policies.title")}
              </h2>
            </div>
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("register_partner.policies.check_in_time")}
                  </h3>
                  <p className="text-base">
                    {partner.hotel.policies.checkInTime}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("register_partner.policies.check_out_time")}
                  </h3>
                  <p className="text-base">
                    {partner.hotel.policies.checkOutTime}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("register_partner.policies.cancellation")}
                </h3>
                <p className="text-base">
                  {partner.hotel.policies.cancellationPolicy}
                </p>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("register_partner.policies.children")}
                  </h3>
                  <p className="text-base">
                    {partner.hotel.policies.childrenPolicy === "yes"
                      ? t("register_partner.sections.policies.yes")
                      : t("register_partner.sections.policies.no")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("register_partner.policies.pets")}
                  </h3>
                  <p className="text-base">
                    {partner.hotel.policies.petPolicy === "yes"
                      ? t("register_partner.sections.policies.yes")
                      : t("register_partner.sections.policies.no")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t("register_partner.policies.smoking")}
                  </h3>
                  <p className="text-base">
                    {partner.hotel.policies.smokingPolicy === "yes"
                      ? t("register_partner.sections.policies.yes")
                      : t("register_partner.sections.policies.no")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Thông tin bổ sung */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {t("admin.partners.approval.details.submittedAt")}
                </h3>
                <p className="text-base">
                  {formatDate(partner.hotel.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ApprovePartnerModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        onApprove={handleApprove}
        isLoading={isApproving}
      />
      <RejectPartnerModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        onReject={handleReject}
        rejectReasons={rejectReasons}
        onRejectReasonsChange={setRejectReasons}
        rejectDetails={rejectDetails}
        onRejectDetailsChange={setRejectDetails}
        isLoading={isRejecting}
      />
    </div>
  );
};

export default PartnerRegistrationDetails;
