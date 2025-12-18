import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

import HeroBanner from "@/components/common/HeroBanner";

const ContactUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        title={t("contact.hero.title")}
        description={t("contact.hero.subtitle")}
      />

      {/* Main Content */}
      <div className="w-full md:max-w-7xl mx-auto px-4 md:py-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-start space-x-6">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  {t("contact.contact_info.title")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t("contact.contact_info.description")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FaPhone className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t("contact.contact_info.hotline.label")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("contact.contact_info.hotline.value")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FaEnvelope className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t("contact.contact_info.email.label")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("contact.contact_info.email.value")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="font-semibold mb-4 text-foreground">
                {t("contact.contact_info.social.title")}
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-3 bg-card border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <FaFacebook className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-card border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <FaTwitter className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-card border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <FaInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-lg shadow-lg p-4 md:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
                alt="Support Agent"
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  {t("contact.contact_form.title")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("contact.contact_form.subtitle")}
                </p>
              </div>
            </div>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {t("contact.contact_form.fields.name.label")}
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-background border-input border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground"
                  placeholder={t(
                    "contact.contact_form.fields.name.placeholder"
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {t("contact.contact_form.fields.email.label")}
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-background border-input border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground"
                  placeholder={t(
                    "contact.contact_form.fields.email.placeholder"
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {t("contact.contact_form.fields.subject.label")}
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 bg-background border-input border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground"
                  placeholder={t(
                    "contact.contact_form.fields.subject.placeholder"
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-muted-foreground mb-1"
                >
                  {t("contact.contact_form.fields.message.label")}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 bg-background border-input border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground placeholder:text-muted-foreground"
                  placeholder={t(
                    "contact.contact_form.fields.message.placeholder"
                  )}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent transition-colors"
              >
                {t("contact.contact_form.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
