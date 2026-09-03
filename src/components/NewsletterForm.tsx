"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "./icons";
import styles from "./Footer.module.css";

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      className={styles.newsletterForm}
      onSubmit={(event) => {
        event.preventDefault();
        setSubscribed(true);
        event.currentTarget.reset();
      }}
    >
      <label htmlFor="footer-email">Abonează-te la noutăți</label>
      <div className={styles.newsletterField}>
        <input
          id="footer-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Adresa ta de email"
          required
        />
        <button type="submit" aria-label="Abonează-te">
          <ArrowRightIcon />
        </button>
      </div>
      <p className={styles.newsletterStatus} aria-live="polite">
        {subscribed && (
          <>
            <CheckCircleIcon /> Mulțumim pentru abonare.
          </>
        )}
      </p>
    </form>
  );
}
