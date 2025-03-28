import { useTranslation } from "react-i18next";
import HeroBanner from "@/components/common/HeroBanner";
import {
  Search,
  Calendar,
  CreditCard,
  Headphones,
  Users,
  Building2,
  Shield,
  Award,
} from "lucide-react";

const AboutPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Search,
      title: t("about.features.search.title"),
      description: t("about.features.search.description"),
    },
    {
      icon: Calendar,
      title: t("about.features.booking.title"),
      description: t("about.features.booking.description"),
    },
    {
      icon: CreditCard,
      title: t("about.features.payment.title"),
      description: t("about.features.payment.description"),
    },
    {
      icon: Headphones,
      title: t("about.features.support.title"),
      description: t("about.features.support.description"),
    },
  ];

  const achievements = [
    {
      icon: Users,
      title: t("about.achievements.users.title"),
      description: t("about.achievements.users.description"),
      subtext: t("about.achievements.users.subtext"),
    },
    {
      icon: Building2,
      title: t("about.achievements.partners.title"),
      description: t("about.achievements.partners.description"),
      subtext: t("about.achievements.partners.subtext"),
    },
    {
      icon: Award,
      title: t("about.achievements.satisfaction.title"),
      description: t("about.achievements.satisfaction.description"),
      subtext: t("about.achievements.satisfaction.subtext"),
    },
    {
      icon: Shield,
      title: t("about.achievements.security.title"),
      description: t("about.achievements.security.description"),
      subtext: t("about.achievements.security.subtext"),
    },
  ];

  return (
    <>
      <div className="relative">
        <HeroBanner
          imageUrl="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
          title={t("banner.about.title")}
          description={t("banner.about.description")}
        />
      </div>

      {/* Features Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-primary/5 to-background rounded-3xl -z-10" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("about.features.title")}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {t("about.features.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-primary/5 via-background to-primary/5 rounded-3xl -z-10" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("about.introduction.title")}
          </h2>

          {/* First Introduction Block */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                alt="Khách sạn sang trọng"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-2xl font-semibold">
                {t("about.introduction.block1.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.introduction.block1.description1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.introduction.block1.description2")}
              </p>
            </div>
          </div>

          {/* Second Introduction Block */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-2xl font-semibold">
                {t("about.introduction.block2.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.introduction.block2.description1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.introduction.block2.description2")}
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
                alt="Dịch vụ khách hàng"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background rounded-3xl -z-10" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            {t("about.achievements.title")}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {t("about.achievements.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <achievement.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground font-medium mb-1">
                  {achievement.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {achievement.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
