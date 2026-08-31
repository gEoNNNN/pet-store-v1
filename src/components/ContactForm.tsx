"use client";

import { useState } from "react";
import { CheckCircleIcon } from "./icons";
import styles from "./Contact.module.css";

type FormStatus = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

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
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Formular de contact">
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Nume</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Maria Popescu"
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="maria@exemplu.com"
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-phone">Telefon</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+40 700 000 000"
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-subject">Subiect</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Întrebare despre un produs"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Mesaj</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Cum te putem ajuta pe tine și animalul tău?"
          required
        />
      </div>

      <button type="submit" className={styles.submit} disabled={status === "sending"}>
        {status === "sending" ? "Se trimite…" : "Trimite mesajul"}
      </button>

      <p className={styles.status} aria-live="polite">
        {status === "sent" && (
          <>
            <CheckCircleIcon className={styles.statusIcon} />
            Îți mulțumim! Îți vom răspunde în cel mult o zi lucrătoare.
          </>
        )}
      </p>
    </form>
  );
}
