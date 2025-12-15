# i18next Guide - Hotel Booking Management Project

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Installation & Setup](#2-installation--setup)
- [3. Configuration](#3-configuration)
- [4. Translation Files](#4-translation-files)
- [5. Using Translations in Components](#5-using-translations-in-components)
- [6. Changing Languages](#6-changing-languages)
- [7. Advanced Features](#7-advanced-features)
- [8. Common Patterns in This Project](#8-common-patterns-in-this-project)

---

## 1. Introduction

### What is i18next?

i18next is a popular internationalization (i18n) framework for JavaScript and React. It provides a complete solution for translating your application into multiple languages.

### Why Use i18next?

- **Multi-language Support**: Easily support multiple languages
- **Pluralization**: Handle singular/plural forms correctly
- **Interpolation**: Insert variables into translations
- **Namespace Support**: Organize translations into namespaces
- **Language Detection**: Automatically detect user's preferred language
- **React Integration**: Seamless integration with React via react-i18next

### Versions Used

This project uses:

- **i18next v24.2.3**
- **react-i18next v15.4.1**
- **i18next-browser-languagedetector v8.0.4**

---

## 2. Installation & Setup

### Step 1: Install Packages

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Step 2: Create Translation Files

Create translation files for each language in `src/locales/`:

```
src/locales/
├── en/
│   └── translation.json
└── vi/
    └── translation.json
```

### Step 3: Configure i18next

**File: `lib/i18n.ts`**

```tsx
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "../locales/en/translation.json";
import viTranslation from "../locales/vi/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      vi: {
        translation: viTranslation,
      },
    },
    fallbackLng: "vi",
    lng: "vi",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
```

### Step 4: Import i18n in Main Entry

**File: `main.tsx`**

```tsx
import "./lib/i18n"; // Import i18n configuration

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 3. Configuration

### Configuration Options

**File: `lib/i18n.ts`**

```tsx
i18n.init({
  // Language resources
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
  },

  // Default language
  fallbackLng: "vi",
  lng: "vi",

  // Debug mode (set to false in production)
  debug: true,

  // Interpolation settings
  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Language detection
  detection: {
    order: ["localStorage", "navigator"], // Check localStorage first, then browser
    caches: ["localStorage"], // Cache detected language
  },

  // React-specific settings
  react: {
    useSuspense: false, // Don't use Suspense for loading translations
  },
});
```

**Key Options:**

- `resources`: Translation files for each language
- `fallbackLng`: Language to use if translation is missing
- `lng`: Default language
- `debug`: Enable debug mode for development
- `detection`: Configure automatic language detection
- `interpolation`: Configure variable interpolation

---

## 4. Translation Files

### JSON Structure

Translation files are JSON objects with nested keys for organization.

**File: `locales/en/translation.json`**

```json
{
  "welcome": "Welcome",
  "language": "Language",
  "common": {
    "logo_alt": "BookIt Logo",
    "view_all": "View all",
    "reviews": "reviews",
    "create": "Create",
    "back": "Back",
    "all": "All",
    "search": "Search",
    "login": "Login",
    "register": "Register",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings"
  },
  "auth": {
    "login": {
      "title": "Login",
      "welcome": "Hello!",
      "form": {
        "email": {
          "label": "Enter Email",
          "placeholder": "Enter your email"
        },
        "password": {
          "label": "Password",
          "placeholder": "Enter your password"
        }
      }
    }
  }
}
```

**File: `locales/vi/translation.json`**

```json
{
  "welcome": "Xin chào",
  "language": "Ngôn ngữ",
  "common": {
    "logo_alt": "Logo BookIt",
    "view_all": "Xem tất cả",
    "reviews": "đánh giá",
    "create": "Tạo",
    "back": "Quay lại",
    "all": "Tất cả",
    "search": "Tìm kiếm",
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "logout": "Đăng xuất",
    "profile": "Hồ sơ",
    "settings": "Cài đặt"
  },
  "auth": {
    "login": {
      "title": "Đăng nhập",
      "welcome": "Xin chào!",
      "form": {
        "email": {
          "label": "Nhập Email",
          "placeholder": "Nhập email của bạn"
        },
        "password": {
          "label": "Mật khẩu",
          "placeholder": "Nhập mật khẩu của bạn"
        }
      }
    }
  }
}
```

**Best Practices:**

- Use nested objects for organization
- Keep keys consistent across languages
- Use descriptive key names
- Group related translations together

---

## 5. Using Translations in Components

### useTranslation Hook

Use the `useTranslation` hook to access translation function and i18n instance.

**Basic Example:**

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("common.description")}</p>
    </div>
  );
};
```

### Accessing Nested Keys

Use dot notation to access nested translation keys.

```tsx
const { t } = useTranslation();

// Access nested keys
t("auth.login.title"); // "Login" or "Đăng nhập"
t("auth.login.form.email.label"); // "Enter Email" or "Nhập Email"
```

**Real Example: LoginPage**

**File: `pages/auth/LoginPage.tsx`**

```tsx
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("auth.login.title")}</h2>
      <Form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.login.form.email.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("auth.login.form.email.placeholder")}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};
```

### Translation with Variables

Use interpolation to insert variables into translations.

**Translation File:**

```json
{
  "greeting": "Hello, {{name}}!",
  "items": "You have {{count}} items",
  "welcome_message": "Welcome to {{appName}}, {{user}}!"
}
```

**Component:**

```tsx
const { t } = useTranslation();

// Simple interpolation
t("greeting", { name: "John" }); // "Hello, John!"

// Multiple variables
t("welcome_message", {
  appName: "BookIt",
  user: "John",
}); // "Welcome to BookIt, John!"

// With count for pluralization
t("items", { count: 5 }); // "You have 5 items"
```

---

## 6. Changing Languages

### Programmatic Language Change

Use `i18n.changeLanguage()` to change the language programmatically.

**Basic Example:**

```tsx
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
    </div>
  );
};
```

**Real Example: LanguageSwitcher Component**

**File: `components/setting/LanguageSwitcher.tsx`**

```tsx
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
```

### Getting Current Language

```tsx
const { i18n } = useTranslation();

const currentLanguage = i18n.language; // "en" or "vi"
const isEnglish = i18n.language === "en";
```

### Language Persistence

With `LanguageDetector` configured, the selected language is automatically saved to `localStorage` and restored on page reload.

---

## 7. Advanced Features

### Pluralization

Handle singular and plural forms automatically.

**Translation File:**

```json
{
  "items_one": "{{count}} item",
  "items_other": "{{count}} items"
}
```

**Component:**

```tsx
const { t } = useTranslation();

t("items", { count: 1 }); // "1 item"
t("items", { count: 5 }); // "5 items"
```

### Context

Use context for different variations of the same translation.

**Translation File:**

```json
{
  "save": "Save",
  "save_context_edit": "Update",
  "save_context_create": "Create"
}
```

**Component:**

```tsx
t("save", { context: "edit" }); // "Update"
t("save", { context: "create" }); // "Create"
```

### Default Values

Provide default values if translation is missing.

```tsx
t("missing.key", { defaultValue: "Default text" });
```

### Translation with HTML

Since `escapeValue: false` is set, you can use HTML in translations (be careful with XSS).

**Translation File:**

```json
{
  "welcome": "Welcome to <strong>BookIt</strong>!"
}
```

**Component:**

```tsx
<div dangerouslySetInnerHTML={{ __html: t("welcome") }} />
```

> **⚠️ Warning**: Only use HTML in translations if you trust the content. Consider using React components instead.

### Namespaces

Organize translations into namespaces for better structure.

**Configuration:**

```tsx
resources: {
  en: {
    common: commonEn,
    auth: authEn,
    hotel: hotelEn,
  },
  vi: {
    common: commonVi,
    auth: authVi,
    hotel: hotelVi,
  },
},
```

**Usage:**

```tsx
const { t } = useTranslation("auth");
t("login.title"); // Uses auth namespace
```

---

## 8. Common Patterns in This Project

### Pattern 1: Form Labels and Placeholders

```tsx
const { t } = useTranslation();

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("auth.login.form.email.label")}</FormLabel>
      <FormControl>
        <Input
          {...field}
          placeholder={t("auth.login.form.email.placeholder")}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

### Pattern 2: Button Text

```tsx
const { t } = useTranslation();

<Button>{t("common.save")}</Button>
<Button>{t("common.cancel")}</Button>
<Button>{t("common.create")}</Button>
```

### Pattern 3: Error Messages

```tsx
const { t } = useTranslation();

toast.error(t("auth.login.error.generic"));
toast.success(t("auth.login.success"));
```

### Pattern 4: Conditional Translation Based on Language

```tsx
const { t, i18n } = useTranslation();

const isVietnamese = i18n.language === "vi";
const greeting = isVietnamese ? t("greeting.vi") : t("greeting.en");
```

### Pattern 5: Translation in Validation Schemas

```tsx
import { z } from "zod";
import i18n from "@/lib/i18n";

export const loginSchema = z.object({
  email: z.string().email(i18n.t("auth.login.form.error.email")),
  password: z.string().min(1, i18n.t("auth.login.form.error.password")),
});
```

### Pattern 6: Dynamic Translation Keys

```tsx
const { t } = useTranslation();

const getStatusText = (status: string) => {
  return t(`common.status.${status}`);
};

getStatusText("active"); // Uses "common.status.active"
getStatusText("inactive"); // Uses "common.status.inactive"
```

---

## Troubleshooting

### Translation Not Showing

**Problem**: Translation key shows instead of translated text

**Solutions**:

- ✅ Check translation key exists in JSON file
- ✅ Verify key path is correct (use dot notation)
- ✅ Ensure translation file is imported in i18n config
- ✅ Check language is set correctly
- ✅ Verify JSON syntax is valid

### Language Not Changing

**Problem**: Language doesn't change when clicking button

**Solutions**:

- ✅ Check `i18n.changeLanguage()` is called
- ✅ Verify language code matches resource keys
- ✅ Check `LanguageDetector` is configured
- ✅ Ensure `localStorage` is accessible
- ✅ Check browser console for errors

### Missing Translations

**Problem**: Some translations show fallback language

**Solutions**:

- ✅ Add missing keys to translation files
- ✅ Check `fallbackLng` is set correctly
- ✅ Verify all languages have same key structure
- ✅ Use `debug: true` to see missing keys

### Translation with Variables Not Working

**Problem**: Variables not replaced in translation

**Solutions**:

- ✅ Check variable names match in translation and component
- ✅ Use double curly braces: `{{variableName}}`
- ✅ Verify `interpolation.escapeValue` setting
- ✅ Check variable is passed to `t()` function

---

## Summary

i18next provides a powerful solution for internationalization in React applications. Key takeaways:

1. **Configuration** sets up languages and detection
2. **Translation Files** store translations as JSON
3. **useTranslation** hook provides `t()` function and `i18n` instance
4. **Nested Keys** accessed with dot notation
5. **Interpolation** inserts variables into translations
6. **Language Switching** via `i18n.changeLanguage()`
7. **Persistence** handled automatically by LanguageDetector

### Common Hooks

#### useTranslation

Access translation function and i18n instance.

```tsx
const { t, i18n } = useTranslation();

// Translate
t("key");
t("nested.key");
t("key", { variable: "value" });

// Change language
i18n.changeLanguage("en");

// Get current language
i18n.language;
```

### Common Patterns

#### Basic Translation

```tsx
const { t } = useTranslation();
<h1>{t("welcome")}</h1>;
```

#### Nested Keys

```tsx
const { t } = useTranslation();
<Label>{t("auth.login.form.email.label")}</Label>;
```

#### With Variables

```tsx
const { t } = useTranslation();
<p>{t("greeting", { name: "John" })}</p>;
```

#### Language Switcher

```tsx
const { t, i18n } = useTranslation();
<button onClick={() => i18n.changeLanguage("en")}>{t("english")}</button>;
```

This project demonstrates a production-ready i18next setup with automatic language detection, persistence, and comprehensive translation coverage.

---

## Additional Resources

- [i18next Official Docs](https://www.i18next.com/)
- [react-i18next Docs](https://react.i18next.com/)
- [i18next Browser Language Detector](https://github.com/i18next/i18next-browser-languagedetector)
- [i18next Best Practices](https://www.i18next.com/principles/fallback)
