import { useTranslation } from "react-i18next";
import HeroBanner from "../components/sections/home/HeroBanner";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative">
        <HeroBanner
          imageUrl="/images/about-banner.jpg"
          title={t("banner.about.title")}
          description={t("banner.about.description")}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto mt-16 px-4">
        <div className="max-w-4xl mx-auto">
          <section className="prose prose-lg dark:prose-invert">
            {/* Nội dung trang About */}
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
