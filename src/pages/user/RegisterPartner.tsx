import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { partnerFormSchema, type PartnerFormData } from "@/api/partner/types";

import HotelInfoSection from "@/components/partner/partner-registration/HotelInfoSection";
import AddressSection from "@/components/partner/partner-registration/AddressSection";
import ContactSection from "@/components/partner/partner-registration/ContactSection";
import BusinessSection from "@/components/partner/partner-registration/BusinessSection";
import LicenseSection from "@/components/partner/partner-registration/LicenseSection";

const RegisterPartner = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      hotelName: "",
      businessType: "",
      taxId: "",
      website: "",
      starRating: "",
      roomCount: "",
      hotelAmenities: "",
      hotelImages: undefined,
      address: "",
      district: "",
      city: "",
      country: "",
      locationDescription: "",
      contactName: "",
      position: "",
      email: "",
      phone: "",
      priceRange: "",
      targetGuests: "",
      businessDescription: "",
      marketingPlans: "",
      businessLicense: "",
      certifications: "",
      certificateImages: undefined,
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
            <HotelInfoSection form={form} />
            <AddressSection form={form} />
            <ContactSection form={form} />
            <BusinessSection form={form} />
            <LicenseSection form={form} />

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
