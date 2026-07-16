"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInvoiceStatusAction } from "../actions";

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
        // Aggiorna lo stato della fattura a 'sent'
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {message && (
        <div className={`alert alert-${message.success ? "success" : "error"} animate-fade-in`} style={{ width: "100%" }}>
          {message.text}
        </div>
      )}
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
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
      </div>
    </div>
  );
}
