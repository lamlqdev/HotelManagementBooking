import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { LanguageToggle } from "@/components/setting/LanguageToggle";
import { ModeToggle } from "@/components/setting/ModeToggle";
import { ChangePasswordModal } from "@/components/setting/ChangePasswordModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const isPartnerRoute = location.pathname.startsWith("/partner");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div
      className={`container mx-auto mb-12 ${
        !isPartnerRoute && !isAdminRoute ? "mt-32" : ""
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">{t("settings.title")}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("settings.theme")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.themeDescription")}
                </p>
              </div>
              <ModeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t("settings.language")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.languageDescription")}
                </p>
              </div>
              <LanguageToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.account")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {t("settings.changePassword.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.changePassword.description")}
                </p>
              </div>
              <ChangePasswordModal />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
