import React from "react";
import { useTranslation } from "react-i18next";
import HeroBanner from "../components/sections/home/HeroBanner";
import step1 from "../assets/images/booking_steps/step1.png";
import step2 from "../assets/images/booking_steps/step2.png";
import step3 from "../assets/images/booking_steps/step3.png";
import step4 from "../assets/images/booking_steps/step4.png";
import step5 from "../assets/images/booking_steps/step5.png";
import step6 from "../assets/images/booking_steps/step6.png";

const BookingGuidePage: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    { image: step1, step: 1 },
    { image: step2, step: 2 },
    { image: step3, step: 3 },
    { image: step4, step: 4 },
    { image: step5, step: 5 },
    { image: step6, step: 6 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner
        title={t("bookingGuide.title")}
        description={t("bookingGuide.description")}
        imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {/* Cột trái - Bước 1-2-3 */}
            <div className="space-y-12">
              {steps.slice(0, 3).map((step) => (
                <div
                  key={step.step}
                  className="flex flex-col md:flex-row gap-8 items-start relative"
                >
                  {/* Cột hình ảnh */}
                  <div className="w-full md:w-[200px] shrink-0">
                    <img
                      src={step.image}
                      alt={`${t("bookingGuide.steps." + step.step + ".title")}`}
                      className="w-full rounded-lg border border-border shadow-sm bg-card"
                    />
                  </div>

                  {/* Thanh nối */}
                  <div className="hidden md:block absolute left-[200px] top-[18px] w-8 h-[2px] bg-primary/30" />

                  {/* Cột nội dung */}
                  <div className="flex-1">
                    <div className="bg-card rounded-lg shadow-sm border border-border p-4 max-w-[300px]">
                      <div className="flex gap-3 mb-2.5">
                        <div className="shrink-0">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {step.step}
                          </div>
                        </div>
                        <h3 className="text-base font-semibold text-foreground leading-tight">
                          {t("bookingGuide.steps." + step.step + ".title")}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-[15px] pl-9 leading-relaxed">
                        {t("bookingGuide.steps." + step.step + ".description")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải - Bước 4-5-6 */}
            <div className="space-y-12 lg:mt-0 mt-12">
              {steps.slice(3).map((step) => (
                <div
                  key={step.step}
                  className="flex flex-col md:flex-row gap-8 items-start relative"
                >
                  {/* Cột hình ảnh */}
                  <div className="w-full md:w-[200px] shrink-0">
                    <img
                      src={step.image}
                      alt={`${t("bookingGuide.steps." + step.step + ".title")}`}
                      className="w-full rounded-lg border border-border shadow-sm bg-card"
                    />
                  </div>

                  {/* Thanh nối */}
                  <div className="hidden md:block absolute left-[200px] top-[18px] w-8 h-[2px] bg-primary/30" />

                  {/* Cột nội dung */}
                  <div className="flex-1">
                    <div className="bg-card rounded-lg shadow-sm border border-border p-4 max-w-[300px]">
                      <div className="flex gap-3 mb-2.5">
                        <div className="shrink-0">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                            {step.step}
                          </div>
                        </div>
                        <h3 className="text-base font-semibold text-foreground leading-tight">
                          {t("bookingGuide.steps." + step.step + ".title")}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-[15px] pl-9 leading-relaxed">
                        {t("bookingGuide.steps." + step.step + ".description")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingGuidePage;
