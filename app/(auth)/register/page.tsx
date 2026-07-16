"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "./actions";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, undefined);

  return (
    <div className="auth-layout">
      <div className="auth-card animate-fade-in-up">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon" aria-hidden="true">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="auth-logo-name">Invoice<span>Flow</span></span>
        </div>

        <h1 className="auth-heading">Crea il tuo account</h1>
        <p className="auth-subheading">Gratis per sempre fino a 5 fatture/mese</p>

        <form action={action} aria-label="Modulo di registrazione" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {state?.error && (
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-status-overdue-bg)", color: "var(--color-destructive)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", border: "1px solid var(--color-destructive)" }}>
              {state.error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div className="form-group">
              <label htmlFor="register-firstname" className="form-label required">Nome</label>
              <input
                id="register-firstname"
                name="firstname"
                type="text"
                className="form-input"
                placeholder="Mario"
                autoComplete="given-name"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-lastname" className="form-label required">Cognome</label>
              <input
                id="register-lastname"
                name="lastname"
                type="text"
                className="form-input"
                placeholder="Rossi"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email" className="form-label required">Email di lavoro</label>
            <input
              id="register-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="mario@azienda.it"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-company" className="form-label">Azienda o nome freelance</label>
            <input
              id="register-company"
              name="company"
              type="text"
              className="form-input"
              placeholder="es. Rossi Studio"
              autoComplete="organization"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password" className="form-label required">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Min. 8 caratteri"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <span className="form-hint">Usa almeno 8 caratteri con lettere e numeri</span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-accent"
            id="register-submit-btn"
            style={{ width: "100%", height: 48, fontSize: "var(--text-base)", marginTop: "var(--space-2)" }}
          >
            {isPending ? "Creazione in corso..." : "Crea account gratis"}
          </button>

          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)", textAlign: "center", lineHeight: 1.5 }}>
            Registrandoti accetti i{" "}
            <Link href="/terms" style={{ color: "var(--color-secondary)" }}>Termini di servizio</Link>{" "}
            e la{" "}
            <Link href="/privacy" style={{ color: "var(--color-secondary)" }}>Privacy Policy</Link>.
          </p>
        </form>

        <p className="auth-footer-text">
          Hai già un account?{" "}
          <Link href="/login" id="register-login-link" style={{ fontWeight: 600, color: "var(--color-primary)" }}>
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
