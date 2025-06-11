import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/logo";

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo section */}
          <div>
            <Link to="/" className="flex items-center" onClick={scrollToTop}>
              <Logo className="h-32" showDot={false} />
            </Link>
          </div>

          {/* Company section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {t("footer.company.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.company.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/booking-guide"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.company.booking_guide")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {t("footer.services.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/booking"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.services.booking")}
                </Link>
              </li>
              <li>
                <Link
                  to="/partnership"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.services.management")}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.services.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {t("footer.support.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.support.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={scrollToTop}
                >
                  {t("footer.support.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
