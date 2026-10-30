"use client";

import { useState } from "react";
import { CheckCircleIcon } from "./icons";
import { useI18n } from "@/i18n/provider";
import styles from "./Contact.module.css";

type FormStatus = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const { t } = useI18n();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    setStatus("sending");

    // Placeholder submit — wire this to your API/route handler later.
    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
    }, 900);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label={t("form.aria")}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name">{t("form.name")}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("form.namePlaceholder")}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">{t("form.email")}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("form.emailPlaceholder")}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-phone">{t("form.phone")}</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("form.phonePlaceholder")}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-subject">{t("form.subject")}</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder={t("form.subjectPlaceholder")}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">{t("form.message")}</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder={t("form.messagePlaceholder")}
          required
        />
      </div>

      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        {status === "sending" ? t("form.sending") : t("form.submit")}
      </button>

      <p className={styles.status} aria-live="polite">
        {status === "sent" && (
          <>
            <CheckCircleIcon className={styles.statusIcon} />
            {t("form.success")}
          </>
        )}
      </p>
    </form>
  );
}
