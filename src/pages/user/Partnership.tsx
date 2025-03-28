import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Users,
  BarChart,
  Shield,
  Zap,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router";
import HeroBanner from "@/components/common/HeroBanner";
import step1 from "@/assets/images/partner_register_steps/step1.svg";
import step2 from "@/assets/images/partner_register_steps/step2.svg";
import step3 from "@/assets/images/partner_register_steps/step3.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Partnership = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
        title={t("partnership.hero.title")}
        description={t("partnership.hero.subtitle")}
      ></HeroBanner>

      <div className="container mx-auto px-4 py-12">
        {/* Why Partner With Us Section */}
        <section className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl -z-10" />
          <div className="container mx-auto px-8 py-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t("partnership.why.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("partnership.why.reach.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("partnership.why.reach.description")}
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("partnership.why.growth.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("partnership.why.growth.description")}
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("partnership.why.trust.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("partnership.why.trust.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-primary/5 to-background rounded-3xl -z-10" />
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t("partnership.benefits.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-4">
                  {t("partnership.benefits.business.title")}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.business.item1")}
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.business.item2")}
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.business.item3")}
                  </li>
                </ul>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-4">
                  {t("partnership.benefits.management.title")}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.management.item1")}
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.management.item2")}
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    {t("partnership.benefits.management.item3")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Apply Section */}
        <section className="mb-12 relative">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_var(--tw-gradient-stops))] from-primary/5 via-background to-primary/5 rounded-3xl -z-10" />
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("partnership.how.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="w-40 h-40 mx-auto mb-6">
                  <img src={step1} alt="Step 1" className="w-full h-full" />
                </div>
                <div className="text-center">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4 mx-auto">
                    1
                  </span>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("partnership.how.step1.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("partnership.how.step1.description")}
                  </p>
                </div>
                {/* Connection line */}
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20" />
              </div>

              {/* Step 2 */}
              <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="w-40 h-40 mx-auto mb-6">
                  <img src={step2} alt="Step 2" className="w-full h-full" />
                </div>
                <div className="text-center">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4 mx-auto">
                    2
                  </span>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("partnership.how.step2.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("partnership.how.step2.description")}
                  </p>
                </div>
                {/* Connection lines */}
                <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-primary/20" />
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20" />
              </div>

              {/* Step 3 */}
              <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="w-40 h-40 mx-auto mb-6">
                  <img src={step3} alt="Step 3" className="w-full h-full" />
                </div>
                <div className="text-center">
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4 mx-auto">
                    3
                  </span>
                  <h3 className="text-xl font-semibold mb-3">
                    {t("partnership.how.step3.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("partnership.how.step3.description")}
                  </p>
                </div>
                {/* Connection line */}
                <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-0.5 bg-primary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background rounded-3xl -z-10" />
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("partnership.faq.title")}
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg">
                    {t("partnership.faq.q1")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t("partnership.faq.a1")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg">
                    {t("partnership.faq.q2")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t("partnership.faq.a2")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg">
                    {t("partnership.faq.q3")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t("partnership.faq.a3")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg">
                    {t("partnership.faq.q4")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t("partnership.faq.a4")}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg">
                    {t("partnership.faq.q5")}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t("partnership.faq.a5")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Additional Questions */}
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  {t("partnership.faq.more_questions.title")}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t("partnership.faq.more_questions.description")}
                </p>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    {t("partnership.faq.more_questions.button")}
                    <HelpCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-background rounded-3xl -z-10" />
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-6">
              {t("partnership.cta.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("partnership.cta.description")}
            </p>
            <Button size="lg" asChild>
              <Link to="/register-partner">
                {t("partnership.cta.button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Partnership;
