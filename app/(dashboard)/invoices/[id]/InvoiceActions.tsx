"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { updateInvoiceStatusAction, deleteInvoiceAction } from "../actions";

export default function InvoiceActions({ invoiceId, invoiceNumber, clientName, clientEmail, dueDate, totalAmount, companyName, status }: {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string | null;
  dueDate: string;
  totalAmount: string;
  companyName: string;
  status: string;
}) {
  const [isSending, setIsSending] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);
  const router = useRouter();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const { downloadInvoicePDF } = await import("@/lib/download-pdf");
    await downloadInvoicePDF(invoiceNumber);
    setIsGeneratingPdf(false);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail: clientEmail || "",
          invoiceNumber,
          dueDate,
          totalAmount,
          companyName,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        await updateInvoiceStatusAction(invoiceId, "sent");
        setMessage({ success: true, text: result.message || "Email inviata al cliente con successo!" });
        router.refresh();
      } else {
        setMessage({ success: false, text: result.error || "Errore durante l'invio dell'email." });
      }
    } catch (error) {
      setMessage({ success: false, text: "Errore di connessione durante l'invio." });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendReminder = async () => {
    setIsSendingReminder(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail: clientEmail || "",
          invoiceNumber,
          dueDate,
          totalAmount,
          companyName,
          type: "reminder",
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage({ success: true, text: result.message || "Sollecito inviato con successo!" });
        router.refresh();
      } else {
        setMessage({ success: false, text: result.error || "Errore durante l'invio del sollecito." });
      }
    } catch (error) {
      setMessage({ success: false, text: "Errore di connessione durante l'invio." });
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setIsUpdatingStatus(true);
    setMessage(null);
    try {
      await updateInvoiceStatusAction(invoiceId, "paid");
      setMessage({ success: true, text: "Fattura segnata come pagata!" });
      router.refresh();
    } catch (error) {
      setMessage({ success: false, text: "Errore durante l'aggiornamento dello stato." });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage(null);
    try {
      await deleteInvoiceAction(invoiceId);
      router.push("/invoices");
    } catch (error) {
      setMessage({ success: false, text: "Errore durante l'eliminazione della fattura." });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {message && (
        <div className={`alert alert-${message.success ? "success" : "error"} animate-fade-in`} style={{ width: "100%" }}>
          {message.text}
        </div>
      )}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="btn btn-outline" type="button">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isGeneratingPdf ? "Generazione..." : "Scarica fattura"}
        </button>
        {status !== "cancelled" && (
          <button onClick={handleSendEmail} disabled={isSending} className="btn btn-primary" type="button">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isSending ? "Invio in corso..." : (status === "draft" ? "Invia al cliente" : "Reinvia email")}
          </button>
        )}
        {(status === "sent" || status === "overdue") && (
          <button onClick={handleSendReminder} disabled={isSendingReminder} className="btn btn-warning" type="button">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {isSendingReminder ? "Invio sollecito..." : "Invia sollecito"}
          </button>
        )}
        {(status === "sent" || status === "overdue" || status === "draft") && (
          <button onClick={handleMarkAsPaid} disabled={isUpdatingStatus} className="btn btn-outline" type="button">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {isUpdatingStatus ? "Aggiornamento..." : "Segna come pagata"}
          </button>
        )}
        {status !== "paid" && (
          <button onClick={() => router.push(`/invoices/${invoiceId}/edit`)} className="btn btn-outline" type="button">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifica
          </button>
        )}
        <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline" type="button" style={{ color: "var(--color-destructive)", borderColor: "var(--color-destructive)" }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Elimina
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && createPortal(
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)",
        }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="card animate-fade-in" style={{
            padding: "var(--space-8)",
            maxWidth: 420,
            width: "90%",
            textAlign: "center",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto var(--space-4)"
            }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>
              Elimina fattura {invoiceNumber}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-6)" }}>
              Sei sicuro di voler eliminare questa fattura? Questa azione è irreversibile e la fattura verrà rimossa definitivamente.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-outline" type="button" disabled={isDeleting}>
                Annulla
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="btn" type="button" style={{
                background: "var(--color-destructive)",
                color: "white",
                border: "none",
              }}>
                {isDeleting ? "Eliminazione..." : "Sì, elimina"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
