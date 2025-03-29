import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Phone, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { partnerFormSchema, type PartnerFormData } from "@/api/partner/types";

import HotelInfoSection from "@/components/partner/partner-registration/GeneralSection";
import ContactSection from "@/components/partner/partner-registration/ContactSection";
import PoliciesSection from "@/components/partner/partner-registration/PoliciesSection";

const RegisterPartner = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      hotelName: "",
      description: "",
      mainImage: undefined,
      galleryImages: undefined,
      amenities: [],
      address: "",
      touristSpot: "",
      country: "",
      locationDescription: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",

      checkInTime: "",
      checkOutTime: "",
      cancellationPolicy: "",
      paymentPolicy: "",
      houseRules: "",
      childrenPolicy: "",
      petPolicy: "",
      smokingPolicy: "",
    },
  });

  const onSubmit = async (values: PartnerFormData) => {
    console.log(values);
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
                <HotelInfoSection form={form} />
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
              <Button type="submit" size="lg">
                {t("register_partner.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPartner;
