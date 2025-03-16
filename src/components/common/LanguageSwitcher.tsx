import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <h2 className="text-lg font-semibold">{t("language")}</h2>
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${
            i18n.language === "en"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeLanguage("en")}
        >
          {t("english")}
        </button>
        <button
          className={`px-4 py-2 rounded ${
            i18n.language === "vi"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changeLanguage("vi")}
        >
          {t("vietnamese")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
