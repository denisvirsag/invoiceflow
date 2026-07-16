"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

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

        <h1 className="auth-heading">Bentornato</h1>
        <p className="auth-subheading">Accedi al tuo account per gestire le fatture</p>

        <form action={action} aria-label="Modulo di accesso" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {state?.error && (
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-status-overdue-bg)", color: "var(--color-destructive)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", border: "1px solid var(--color-destructive)" }}>
              {state.error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="login-email" className="form-label required">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="mario@example.com"
              autoComplete="email"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="login-password" className="form-label required">Password</label>
              <Link href="/forgot-password" style={{ fontSize: "var(--text-xs)", color: "var(--color-secondary)" }} id="login-forgot-link">
                Password dimenticata?
              </Link>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary"
            id="login-submit-btn"
            style={{ width: "100%", height: 48, fontSize: "var(--text-base)", marginTop: "var(--space-2)" }}
          >
            {isPending ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="auth-footer-text">
          Non hai un account?{" "}
          <Link href="/register" id="login-register-link" style={{ fontWeight: 600, color: "var(--color-primary)" }}>
            Registrati gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
