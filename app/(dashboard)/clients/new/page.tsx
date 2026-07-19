"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createClient } from "../actions";

export default function NewClientPage() {
  const [state, action, isPending] = useActionState(createClient, undefined);

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Nuovo Cliente</h1>
          <p className="page-subtitle">Aggiungi un nuovo cliente alla tua anagrafica</p>
        </div>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.08s", maxWidth: 800 }}>
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {state?.error && (
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-status-overdue-bg)", color: "var(--color-destructive)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)" }}>
              {state.error}
            </div>
          )}
          
          <div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Dati Principali</h3>
            <div className="form-grid-2col" style={{ display: "grid", gap: "var(--space-4)" }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="name" className="form-label required">Ragione Sociale / Nome e Cognome</label>
                <input id="name" name="name" type="text" className="form-input" required autoFocus />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" name="email" type="email" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="vatNumber" className="form-label">Partita IVA / C.F.</label>
                <input id="vatNumber" name="vatNumber" type="text" className="form-input" />
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

          <div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Indirizzo</h3>
            <div className="form-grid-2col" style={{ display: "grid", gap: "var(--space-4)" }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="address" className="form-label">Indirizzo Completo</label>
                <input id="address" name="address" type="text" className="form-input" placeholder="Via Roma, 1" />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="form-label">Città</label>
                <input id="city" name="city" type="text" className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="zip" className="form-label">CAP</label>
                <input id="zip" name="zip" type="text" className="form-input" />
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

          <div className="form-group">
            <label htmlFor="notes" className="form-label">Note</label>
            <textarea id="notes" name="notes" className="form-input" rows={3} placeholder="Note interne opzionali..."></textarea>
          </div>

          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
            <Link href="/clients" className="btn btn-ghost">Annulla</Link>
            <button type="submit" disabled={isPending} className="btn btn-primary">
              {isPending ? "Salvataggio..." : "Salva Cliente"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
