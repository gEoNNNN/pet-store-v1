"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import type { ActionState } from "./actions";
import styles from "./Admin.module.css";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAction,
    null,
  );

  return (
    <form action={formAction}>
      {state?.error ? (
        <div className={styles.errorBox} role="alert">
          {state.error}
        </div>
      ) : null}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="admin-password">
          Parola administratorului
        </label>
        <input
          className={styles.input}
          id="admin-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </div>
      <div className={styles.actionsRow}>
        <button className={styles.btnPrimary} type="submit" disabled={pending}>
          {pending ? "Se verifică…" : "Intră în panou"}
        </button>
      </div>
    </form>
  );
}
