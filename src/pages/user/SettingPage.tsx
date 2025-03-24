import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/setting/ModeToggle";
import { LanguageToggle } from "@/components/setting/LanguageToggle";
import { Separator } from "@/components/ui/separator";

export default function SettingPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto mt-32 mb-12">
      <h1 className="text-3xl font-bold mb-6">{t("settings.title")}</h1>

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
      </div>
    </div>
  );
}
