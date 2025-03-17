import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/logo.png";
import { Button } from "../ui/button";
import { ModeToggle } from "../common/ModeToggle";
const Header = () => {
  const { t } = useTranslation();

  return (
    <header>
      <div className="container mx-auto bg-card rounded-lg p-2">
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt={t("common.logo_alt")} className="h-24" />
          </Link>

          <ModeToggle />

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/locations"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.locations")}
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/partnership"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t("nav.partnership")}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-primary" asChild>
              <Link to="/register">{t("auth.register_button")}</Link>
            </Button>
            <Button asChild>
              <Link to="/login">{t("auth.login_button")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
