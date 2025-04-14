import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Phone, FileText } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { partnerFormSchema, type PartnerFormData } from "@/api/partner/types";
import { partnerApi } from "@/api/partner/partner.api";
import GeneralSection from "@/components/partner/partner-registration/GeneralSection";
import ContactSection from "@/components/partner/partner-registration/ContactSection";
import PoliciesSection from "@/components/partner/partner-registration/PoliciesSection";
import { ApiError } from "@/api/auth/types";

const RegisterPartner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: registerPartner, isPending } = useMutation({
    mutationFn: partnerApi.registerPartner,
    onSuccess: () => {
      toast.success(t("register_partner.success"));
      // Chuyển hướng đến trang xác nhận sau 2 giây
      setTimeout(() => {
        navigate("/partner/registration-success");
      }, 2000);
    },
    onError: (error: ApiError) => {
      // Xử lý lỗi chi tiết
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("register_partner.error"));
      }

      // Hiển thị lỗi validation nếu có
      const errorData = error.response?.data as {
        errors?: Record<string, string[]>;
      };
      if (errorData?.errors) {
        const errors = errorData.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key].join(", ")}`);
        });
      }
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      // Thông tin người dùng
      name: "",
      email: "",
      phone: "",

      // Thông tin khách sạn
      hotelName: "",
      hotelAddress: "",
      hotelDescription: "",
      locationId: "",
      hotelLocationDescription: "",
      hotelAmenities: [],
      hotelWebsite: "",

      // Chính sách khách sạn
      checkInTime: "",
      checkOutTime: "",
      cancellationPolicy: "",
      childrenPolicy: "",
      childrenAgeDefinition: 12,
      petPolicy: "",
      smokingPolicy: "",

      // Hình ảnh
      featuredImage: undefined,
      hotelImages: [],
    },
  });

  const onSubmit = async (values: PartnerFormData) => {
    registerPartner(values);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("register_partner.title")}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Phần thông tin cơ bản */}
              <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {t("register_partner.sections.general.title")}
                  </h2>
                </div>
                <GeneralSection form={form} />
              </div>

              {/* Phần thông tin liên hệ */}
              <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {t("register_partner.sections.contact.title")}
                  </h2>
                </div>
                <ContactSection form={form} />
              </div>

              {/* Phần chính sách và quy định */}
              <div className="bg-card p-6 rounded-lg space-y-6 dark:border dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {t("register_partner.sections.policies.title")}
                  </h2>
                </div>
                <PoliciesSection form={form} />
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending
                  ? t("register_partner.submitting")
                  : t("register_partner.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPartner;
