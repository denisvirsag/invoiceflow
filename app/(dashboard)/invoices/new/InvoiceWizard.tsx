"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createInvoiceAction } from "../actions";
import type { Client } from "@prisma/client";

// --- Types ---
type LineItem = {
  id: string;
  description: string;
  qty: number;
  price: number;
  vat: number; // %
};

type FormData = {
  // Step 1
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  // Step 2
  lineItems: LineItem[];
  notes: string;
  // Recurrence
  isRecurring: boolean;
  frequency: string;
};

const VAT_OPTIONS = [0, 4, 5, 10, 22];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

// ============================================================
// STEP INDICATOR
// ============================================================
function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="wizard-steps" role="list" aria-label="Progressione wizard">
      {Array.from({ length: total }).map((_, i) => {
        const state = i < current ? "done" : i === current ? "active" : "pending";
        return (
          <div
            key={i}
            className={`wizard-step ${state}`}
            role="listitem"
            aria-current={state === "active" ? "step" : undefined}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="wizard-step-dot" aria-label={`Step ${i + 1}: ${labels[i]}`}>
                {state === "done" ? (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div className="wizard-step-label">{labels[i]}</div>
            </div>
            {i < total - 1 && (
              <div className={`wizard-step-connector${state === "done" ? " done" : ""}`} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// STEP 1 — Intestazione
// ============================================================
function Step1({
  data,
  onChange,
  clients,
}: {
  data: FormData;
  onChange: (d: Partial<FormData>) => void;
  clients: Client[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <div className="form-group">
        <label htmlFor="client-id" className="form-label required">Cliente</label>
        <select
          id="client-id"
          className="form-input"
          value={data.clientId || "unselected"}
          onChange={(e) => {
            const val = e.target.value;
            onChange({ clientId: val === "unselected" ? "" : val });
          }}
          required
        >
          <option value="unselected">Seleziona un cliente...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {clients.length === 0 && (
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-destructive)", marginTop: "var(--space-1)" }}>Nessun cliente registrato. Aggiungine uno prima di creare la fattura.</p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-5)" }}>
        <div className="form-group">
          <label htmlFor="invoice-number" className="form-label required">Numero fattura</label>
          <input
            id="invoice-number"
            className="form-input"
            type="text"
            placeholder="es. 2026/001"
            value={data.invoiceNumber}
            onChange={(e) => onChange({ invoiceNumber: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="issue-date" className="form-label required">Data emissione</label>
          <input
            id="issue-date"
            className="form-input"
            type="date"
            value={data.issueDate}
            onChange={(e) => onChange({ issueDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="due-date" className="form-label required">Data scadenza</label>
          <input
            id="due-date"
            className="form-input"
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Recurrence Config */}
      <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)", marginTop: "var(--space-2)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer", fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={data.isRecurring}
            onChange={(e) => onChange({ isRecurring: e.target.checked })}
            style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
          />
          Configura come fattura ricorrente (Modello)
        </label>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)", marginTop: "var(--space-1)", marginLeft: "var(--space-7)" }}>
          I modelli ricorrenti vengono visualizzati in una scheda dedicata e ti permettono di generare copie di questa fattura periodicamente con un solo click.
        </p>
      </div>

      {data.isRecurring && (
        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="recurrence-frequency" className="form-label required">Frequenza di ricorrenza</label>
          <select
            id="recurrence-frequency"
            className="form-input"
            value={data.frequency}
            onChange={(e) => onChange({ frequency: e.target.value })}
            style={{ maxWidth: "280px" }}
          >
            <option value="weekly">Settimanale</option>
            <option value="monthly">Mensile</option>
            <option value="yearly">Annuale</option>
          </select>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STEP 2 — Voci fattura
// ============================================================
function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (d: Partial<FormData>) => void;
}) {
  const items = data.lineItems;

  function addItem() {
    onChange({
      lineItems: [...items, { id: generateId(), description: "", qty: 1, price: 0, vat: 22 }],
    });
  }

  function updateItem(id: string, patch: Partial<LineItem>) {
    onChange({
      lineItems: items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }

  function removeItem(id: string) {
    if (items.length > 1) {
      onChange({ lineItems: items.filter((it) => it.id !== id) });
    }
  }

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const vatTotal = items.reduce((s, it) => s + it.qty * it.price * (it.vat / 100), 0);
  const total = subtotal + vatTotal;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div className="table-wrapper">
        <table className="table" aria-label="Editor voci fattura">
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
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Es. Consulenza strategica"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    aria-label={`Descrizione voce ${idx + 1}`}
                  />
                </td>
                <td>
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
                    onBlur={(e) => {
                      if (item.qty < 1) {
                        updateItem(item.id, { qty: 1 });
                      }
                    }}
                    aria-label={`Quantità voce ${idx + 1}`}
                  />
                </td>
                <td>
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
                    onFocus={(e) => {
                      if (item.price === 0) {
                        updateItem(item.id, { price: "" as any });
                      }
                    }}
                    onBlur={(e) => {
                      if (item.price === ("" as any) || isNaN(item.price)) {
                        updateItem(item.id, { price: 0 });
                      }
                    }}
                    aria-label={`Prezzo voce ${idx + 1}`}
                  />
                </td>
                <td>
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
                <td className="invoice-amount" style={{ textAlign: "right" }}>
                  {formatCurrency(item.qty * item.price * (1 + item.vat / 100))}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Rimuovi voce ${idx + 1}`}
                    disabled={items.length === 1}
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

      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={addItem}
        style={{ alignSelf: "flex-start" }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Aggiungi voce
      </button>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: "var(--color-muted)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5) var(--space-6)",
          minWidth: 280,
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
      <div className="form-group">
        <label htmlFor="invoice-notes" className="form-label">Note (opzionale)</label>
        <textarea
          id="invoice-notes"
          className="form-input form-textarea"
          placeholder="es. Pagamento entro 30 giorni dalla ricezione della fattura."
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}

// ============================================================
// STEP 3 — Anteprima & Invio
// ============================================================
function Step3({ data, client }: { data: FormData, client?: Client }) {
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{success: boolean; message: string} | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const { downloadInvoicePDF } = await import("@/lib/download-pdf");
    await downloadInvoicePDF(data.invoiceNumber);
    setIsGeneratingPdf(false);
  };

  const items = data.lineItems;
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const vatTotal = items.reduce((s, it) => s + it.qty * it.price * (it.vat / 100), 0);
  const total = subtotal + vatTotal;

  async function handleSendEmail() {
    setIsSending(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/invoices/test-id/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client?.name || "",
          clientEmail: client?.email || "",
          invoiceNumber: data.invoiceNumber,
          dueDate: data.dueDate,
          totalAmount: formatCurrency(total),
          companyName: "La tua azienda",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setSendResult({ success: true, message: result.message || "Email inviata!" });
      } else {
        setSendResult({ success: false, message: result.error || "Errore invio" });
      }
    } catch (err) {
      setSendResult({ success: false, message: "Errore di rete" });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
      {/* Invoice preview */}
      <div
        className="invoice-print-container"
        style={{
          gridColumn: "1 / -1",
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-8)",
          boxShadow: "var(--shadow-sm)",
        }}
        aria-label="Anteprima fattura"
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-8)" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--color-primary)", letterSpacing: "-0.04em" }}>
              Invoice<span style={{ color: "var(--color-accent)" }}>Flow</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--color-foreground)" }}>
              FATTURA
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              {data.invoiceNumber}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)", marginTop: "var(--space-1)" }}>
              Emessa: {data.issueDate} · Scade: {data.dueDate}
            </div>
          </div>
        </div>

        {/* Client */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)" }}>
            Fatturato a
          </div>
          <div style={{ fontWeight: 700, fontSize: "var(--text-base)" }}>{client?.name || "—"}</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>{client?.email}</div>
        </div>

        {/* Items */}
        <div className="table-wrapper" style={{ marginBottom: "var(--space-6)" }}>
          <table className="table" aria-label="Voci fattura">
            <thead>
              <tr>
                <th scope="col">Descrizione</th>
                <th scope="col" style={{ textAlign: "right" }}>Q.tà</th>
                <th scope="col" style={{ textAlign: "right" }}>Prezzo</th>
                <th scope="col" style={{ textAlign: "right" }}>IVA</th>
                <th scope="col" style={{ textAlign: "right" }}>Totale</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ cursor: "default" }}>
                  <td>{it.description || "—"}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.qty}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(it.price)}</td>
                  <td style={{ textAlign: "right" }}>{it.vat}%</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(it.qty * it.price * (1 + it.vat / 100))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ minWidth: 240, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>Imponibile</span><span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>Totale IVA</span><span>{formatCurrency(vatTotal)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: "var(--color-border)", margin: "var(--space-1) 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-lg)", fontWeight: 800 }}>
              <span>Totale Documento</span><span style={{ color: "var(--color-primary)" }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "var(--space-2)", gridColumn: "1 / -1", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
        {sendResult && (
          <div className={`alert alert-${sendResult.success ? "success" : "error"}`} style={{ width: "100%", gridColumn: "1 / -1" }}>
            {sendResult.message}
          </div>
        )}
        {client?.email && (
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="btn btn-primary"
            id="wizard-send-email-btn"
            type="button"
          >
            {isSending ? (
              "Invio..."
            ) : (
              <>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Invia via email
              </>
            )}
          </button>
        )}
        <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="btn btn-outline" id="wizard-download-pdf-btn" type="button">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isGeneratingPdf ? "Generazione..." : "Scarica fattura"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN WIZARD PAGE
// ============================================================
const STEPS = ["Intestazione", "Voci", "Anteprima"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function in30daysStr() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export default function InvoiceWizard({
  clients,
  suggestedInvoiceNumber = "",
}: {
  clients: Client[];
  suggestedInvoiceNumber?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    clientId: "",
    invoiceNumber: suggestedInvoiceNumber || "",
    issueDate: todayStr(),
    dueDate: in30daysStr(),
    lineItems: [{ id: generateId(), description: "", qty: 1, price: 0, vat: 22 }],
    notes: "",
    isRecurring: false,
    frequency: "monthly",
  });

  function patchForm(patch: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function canProceed() {
    if (step === 0) {
      return (
        form.clientId &&
        form.invoiceNumber &&
        form.invoiceNumber.trim() !== "" &&
        form.issueDate &&
        form.dueDate
      );
    }
    if (step === 1) {
      return form.lineItems.every((it) => it.description && it.description.trim() !== "" && it.price >= 0);
    }
    return true;
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await createInvoiceAction(form);
      router.push("/invoices");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Errore durante il salvataggio della fattura");
      setIsSaving(false);
    }
  }

  const selectedClient = clients.find(c => c.id === form.clientId);

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Nuova fattura</h1>
          <p className="page-subtitle">Compila i dati per creare la tua fattura</p>
        </div>
        <Link href="/invoices" className="btn btn-ghost" id="new-invoice-cancel-btn">
          Annulla
        </Link>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        {/* Step indicator */}
        <StepIndicator current={step} total={STEPS.length} labels={STEPS} />

        {/* Step content */}
        <div style={{ minHeight: 320 }}>
          {step === 0 && <Step1 data={form} onChange={patchForm} clients={clients} />}
          {step === 1 && <Step2 data={form} onChange={patchForm} />}
          {step === 2 && <Step3 data={form} client={selectedClient} />}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "var(--space-10)",
            paddingTop: "var(--space-6)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => (step === 0 ? router.push("/invoices") : setStep((s) => s - 1))}
            id="wizard-back-btn"
          >
            {step === 0 ? "Annulla" : "← Indietro"}
          </button>

          {step < STEPS.length - 1 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-1)" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                id="wizard-next-btn"
              >
                Continua →
              </button>
              {!canProceed() && step === 0 && (
                <span style={{ fontSize: "10px", color: "var(--color-destructive)", marginTop: "4px" }}>
                  Campi mancanti: {[
                    !form.clientId && "Cliente",
                    (!form.invoiceNumber || !form.invoiceNumber.trim()) && "Numero fattura",
                    !form.issueDate && "Data emissione",
                    !form.dueDate && "Data scadenza"
                  ].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-accent"
              id="wizard-finish-btn"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {isSaving ? "Salvataggio..." : "Salva fattura"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
