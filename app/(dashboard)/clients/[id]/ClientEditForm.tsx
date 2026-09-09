"use client";

import { useActionState } from "react";
import { updateClient } from "../actions";

export default function ClientEditForm({ client }: { client: any }) {
  const updateClientWithId = updateClient.bind(null, client.id);
  const [state, action, isPending] = useActionState(updateClientWithId, undefined);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {state?.error && (
        <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-status-overdue-bg)", color: "var(--color-destructive)", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)" }}>
          {state.error}
        </div>
      )}
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="name" className="form-label required">Ragione Sociale / Nome</label>
          <input id="name" name="name" type="text" className="form-input" defaultValue={client.name} required />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" name="email" type="email" className="form-input" defaultValue={client.email || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="vatNumber" className="form-label">Partita IVA / C.F.</label>
          <input id="vatNumber" name="vatNumber" type="text" className="form-input" defaultValue={client.vatNumber || ""} />
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="address" className="form-label">Indirizzo Completo</label>
          <input id="address" name="address" type="text" className="form-input" defaultValue={client.address || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="city" className="form-label">Città</label>
          <input id="city" name="city" type="text" className="form-input" defaultValue={client.city || ""} />
        </div>
        <div className="form-group">
          <label htmlFor="zip" className="form-label">CAP</label>
          <input id="zip" name="zip" type="text" className="form-input" defaultValue={client.zip || ""} />
        </div>
      </div>

      <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

      <div className="form-group">
        <label htmlFor="notes" className="form-label">Note</label>
        <textarea id="notes" name="notes" className="form-input" rows={3} defaultValue={client.notes || ""}></textarea>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Salvataggio..." : "Salva Modifiche"}
        </button>
      </div>
    </form>
  );
}
