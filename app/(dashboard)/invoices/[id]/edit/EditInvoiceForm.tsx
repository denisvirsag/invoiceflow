"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateInvoiceAction } from "../../actions";
import type { Client } from "@prisma/client";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  price: number;
  vat: number;
};

type InvoiceData = {
  id: string;
  number: string;
  status: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  lineItems: LineItem[];
};

const VAT_OPTIONS = [0, 4, 5, 10, 22];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

export default function EditInvoiceForm({
  invoice,
  clients,
}: {
  invoice: InvoiceData;
  clients: Client[];
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    clientId: invoice.clientId,
    invoiceNumber: invoice.number,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    notes: invoice.notes,
    lineItems: invoice.lineItems.map((item) => ({ ...item, id: item.id || generateId() })),
  });

  function patchForm(patch: Partial<typeof form>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function addItem() {
    patchForm({
      lineItems: [...form.lineItems, { id: generateId(), description: "", qty: 1, price: 0, vat: 22 }],
    });
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    patchForm({
      lineItems: form.lineItems.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }

  function removeItem(id: string) {
    if (form.lineItems.length > 1) {
      patchForm({ lineItems: form.lineItems.filter((it) => it.id !== id) });
    }
  }

  const subtotal = form.lineItems.reduce((s, it) => s + it.qty * it.price, 0);
  const vatTotal = form.lineItems.reduce((s, it) => s + it.qty * it.price * (it.vat / 100), 0);
  const total = subtotal + vatTotal;

  const canSave =
    form.clientId &&
    form.invoiceNumber.trim() &&
    form.issueDate &&
    form.dueDate &&
    form.lineItems.every((it) => it.description.trim() && it.price >= 0);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      await updateInvoiceAction(invoice.id, form);
      router.push(`/invoices/${invoice.id}`);
    } catch (err: any) {
      setError(err.message || "Errore durante il salvataggio.");
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <Link href={`/invoices/${invoice.id}`} style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)", display: "inline-block" }}>
            &larr; Torna alla fattura
          </Link>
          <h1 className="page-title">Modifica fattura {invoice.number}</h1>
          <p className="page-subtitle">Modifica i dati della fattura e salva le modifiche</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error animate-fade-in" style={{ marginBottom: "var(--space-4)" }}>
          {error}
        </div>
      )}

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        {/* Invoice header fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", marginBottom: "var(--space-8)" }}>
          <div className="form-group">
            <label htmlFor="edit-client-id" className="form-label required">Cliente</label>
            <select
              id="edit-client-id"
              className="form-input"
              value={form.clientId}
              onChange={(e) => patchForm({ clientId: e.target.value })}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-5)" }}>
            <div className="form-group">
              <label htmlFor="edit-invoice-number" className="form-label required">Numero fattura</label>
              <input
                id="edit-invoice-number"
                className="form-input"
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => patchForm({ invoiceNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-issue-date" className="form-label required">Data emissione</label>
              <input
                id="edit-issue-date"
                className="form-input"
                type="date"
                value={form.issueDate}
                onChange={(e) => patchForm({ issueDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-due-date" className="form-label required">Data scadenza</label>
              <input
                id="edit-due-date"
                className="form-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => patchForm({ dueDate: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Line items */}
        <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Voci fattura</h3>
        <div className="table-wrapper" style={{ marginBottom: "var(--space-4)" }}>
          <table className="table wizard-table-mobile" aria-label="Editor voci fattura">
            <thead>
              <tr>
                <th scope="col" style={{ width: "40%" }}>Descrizione</th>
                <th scope="col" style={{ width: "15%" }}>Quantità</th>
                <th scope="col" style={{ width: "15%" }}>Prezzo unit.</th>
                <th scope="col" style={{ width: "15%" }}>IVA</th>
                <th scope="col" style={{ width: "10%", textAlign: "right" }}>Totale</th>
                <th scope="col" style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {form.lineItems.map((item, idx) => (
                <tr key={item.id}>
                  <td data-label="Descrizione">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Es. Consulenza strategica"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      aria-label={`Descrizione voce ${idx + 1}`}
                    />
                  </td>
                  <td data-label="Quantità">
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      step="1"
                      value={item.qty === 0 ? "" : item.qty}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateItem(item.id, { qty: val === "" ? 0 : Math.max(1, Number(val)) });
                      }}
                      aria-label={`Quantità voce ${idx + 1}`}
                    />
                  </td>
                  <td data-label="Prezzo unit.">
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      step="0.01"
                      placeholder="0,00 €"
                      value={item.price === 0 ? "" : item.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateItem(item.id, { price: val === "" ? 0 : Number(val) });
                      }}
                      aria-label={`Prezzo voce ${idx + 1}`}
                    />
                  </td>
                  <td data-label="IVA">
                    <select
                      className="form-input"
                      value={item.vat}
                      onChange={(e) => updateItem(item.id, { vat: Number(e.target.value) })}
                      aria-label={`IVA voce ${idx + 1}`}
                    >
                      {VAT_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}%</option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Totale" className="invoice-amount" style={{ textAlign: "right" }}>
                    {formatCurrency(item.qty * item.price * (1 + item.vat / 100))}
                  </td>
                  <td data-label="Azioni">
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Rimuovi voce ${idx + 1}`}
                      disabled={form.lineItems.length === 1}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" className="btn btn-outline btn-sm" onClick={addItem} style={{ alignSelf: "flex-start", marginBottom: "var(--space-6)" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Aggiungi voce
        </button>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--space-6)" }}>
          <div style={{
            background: "var(--color-muted)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-5) var(--space-6)",
            minWidth: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>Imponibile</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>IVA</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(vatTotal)}</span>
            </div>
            <div style={{ height: 1, background: "var(--color-border)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-foreground)" }}>
              <span>Totale</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group" style={{ marginBottom: "var(--space-8)" }}>
          <label htmlFor="edit-notes" className="form-label">Note (opzionale)</label>
          <textarea
            id="edit-notes"
            className="form-input form-textarea"
            placeholder="es. Pagamento entro 30 giorni dalla ricezione della fattura."
            value={form.notes}
            onChange={(e) => patchForm({ notes: e.target.value })}
            rows={3}
          />
        </div>

        {/* Action buttons */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--color-border)",
        }}>
          <Link href={`/invoices/${invoice.id}`} className="btn btn-outline">
            Annulla
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !canSave}
            className="btn btn-accent"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {isSaving ? "Salvataggio..." : "Salva modifiche"}
          </button>
        </div>
      </div>
    </>
  );
}
