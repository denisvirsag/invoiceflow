"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TableRow from "@/components/TableRow";
import JSZip from "jszip";
import { generateInvoiceFromTemplateAction } from "./actions";

const statusLabel: Record<string, string> = {
  draft: "Bozza",
  sent: "Inviata",
  paid: "Pagata",
  overdue: "Scaduta",
  cancelled: "Annullata",
  template: "Modello",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

export default function InvoiceList({ invoices }: { invoices: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "recurring">("active");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [processingInvoice, setProcessingInvoice] = useState<any>(null);

  // Filter invoices based on active tab, search term, and status filter
  const filteredInvoices = invoices.filter((inv) => {
    // 1. Tab filter
    if (activeTab === "recurring") {
      if (!inv.isRecurring || inv.status !== "template") return false;
    } else {
      if (inv.status === "template") return false;
    }

    // 2. Status filter
    if (statusFilter && inv.status !== statusFilter) return false;

    // 3. Search term filter
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchNumber = inv.number.toLowerCase().includes(s);
      const matchClient = inv.client.name.toLowerCase().includes(s);
      if (!matchNumber && !matchClient) return false;
    }

    return true;
  });

  // Handle clone generation for recurring templates
  const handleGenerateInvoice = async (templateId: string) => {
    try {
      setExportProgress("Generazione fattura...");
      await generateInvoiceFromTemplateAction(templateId);
      router.refresh();
      setActiveTab("active");
    } catch (error: any) {
      alert(error.message || "Errore durante la generazione della fattura");
    } finally {
      setExportProgress("");
    }
  };

  // ZIP bulk export
  const handleExportZip = async () => {
    if (filteredInvoices.length === 0) {
      alert("Nessuna fattura da esportare con i filtri correnti.");
      return;
    }

    setIsExporting(true);
    const zip = new JSZip();

    // Import dynamic libraries for PDF rendering
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    try {
      // 1. Generate PDFs one by one in the browser
      for (let i = 0; i < filteredInvoices.length; i++) {
        const inv = filteredInvoices[i];
        setExportProgress(`Generazione PDF fattura ${inv.number} (${i + 1}/${filteredInvoices.length})...`);
        
        // Render invoice inside state so it renders in the DOM container
        setProcessingInvoice(inv);
        
        // Wait 300ms for DOM update and style rendering
        await new Promise((resolve) => setTimeout(resolve, 300));

        const element = document.querySelector(".invoice-export-renderer") as HTMLElement;
        if (!element) throw new Error("Renderer non trovato");

        // Canvas conversion with high scale for high resolution print PDF
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF("p", "mm", "a4");
        const pageHeight = 297; // A4 height in mm
        
        let position = 0;
        let heightLeft = imgHeight;
        
        // Handling multi-page PDF generation if needed
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
          heightLeft -= pageHeight;
        }

        const pdfBlob = pdf.output("blob");
        const cleanNumber = inv.number.replace(/[\/\\]/g, "-");
        zip.file(`Fatture/Fattura_${cleanNumber}.pdf`, pdfBlob);
      }

      // 2. Generate summary CSV
      setExportProgress("Generazione report CSV riassuntivo...");
      let csvContent = "\uFEFF"; // BOM for excel UTF-8
      csvContent += "Numero;Cliente;Partita IVA;Data Emissione;Scadenza;Stato;Imponibile;Imposta IVA;Totale;Valuta\n";
      
      for (const inv of filteredInvoices) {
        csvContent += `${inv.number};${inv.client.name};${inv.client.vatNumber || ""};${new Date(inv.issueDate).toLocaleDateString("it-IT")};${new Date(inv.dueDate).toLocaleDateString("it-IT")};${statusLabel[inv.status] || inv.status};${inv.subtotal.toFixed(2)};${inv.vatTotal.toFixed(2)};${inv.total.toFixed(2)};${inv.currency}\n`;
      }
      
      zip.file("Riepilogo_Fiscale.csv", csvContent);

      // 3. Package and download
      setExportProgress("Compressione file ZIP in corso...");
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `Export_Fiscale_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Errore durante l'esportazione fiscale.");
    } finally {
      setProcessingInvoice(null);
      setIsExporting(false);
      setExportProgress("");
    }
  };

  return (
    <>
      {/* Hidden Export Renderer Container */}
      {processingInvoice && (
        <div style={{ position: "fixed", top: "-9999px", left: "-9999px", zIndex: -100 }}>
          <div
            className="invoice-export-renderer"
            style={{
              width: "794px",
              minHeight: "1123px",
              background: "#ffffff",
              padding: "40px",
              color: "#0F172A",
              fontFamily: "var(--font-sans)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "24px", color: "#1E3A5F" }}>
                  Invoice<span style={{ color: "#059669" }}>Flow</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: "20px" }}>FATTURA</div>
                <div style={{ fontSize: "14px", color: "#64748B" }}>{processingInvoice.number}</div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                  Emessa: {new Date(processingInvoice.issueDate).toLocaleDateString("it-IT")} · Scade: {new Date(processingInvoice.dueDate).toLocaleDateString("it-IT")}
                </div>
              </div>
            </div>

            {/* Client info */}
            <div style={{ marginBottom: "30px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#64748B", marginBottom: "6px" }}>
                Fatturato a
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{processingInvoice.client.name}</div>
              <div style={{ fontSize: "14px", color: "#64748B" }}>{processingInvoice.client.email}</div>
              {processingInvoice.client.vatNumber && <div style={{ fontSize: "14px", color: "#64748B" }}>P.IVA: {processingInvoice.client.vatNumber}</div>}
            </div>

            {/* Line items table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E4E7EB", textAlign: "left", fontSize: "12px", color: "#64748B" }}>
                  <th style={{ padding: "8px 0" }}>Descrizione</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Q.tà</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Prezzo</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>IVA</th>
                  <th style={{ padding: "8px 0", textAlign: "right" }}>Totale</th>
                </tr>
              </thead>
              <tbody>
                {processingInvoice.lineItems?.map((it: any) => (
                  <tr key={it.id} style={{ borderBottom: "1px solid #E4E7EB", fontSize: "14px" }}>
                    <td style={{ padding: "12px 0" }}>{it.description}</td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>{it.quantity}</td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>{formatCurrency(it.unitPrice)}</td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>{it.vatRate}%</td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 600 }}>{formatCurrency(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ minWidth: "240px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748B" }}>
                  <span>Imponibile</span><span>{formatCurrency(processingInvoice.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748B" }}>
                  <span>Totale IVA</span><span>{formatCurrency(processingInvoice.vatTotal)}</span>
                </div>
                <div style={{ height: "1px", backgroundColor: "#E4E7EB", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 800 }}>
                  <span>Totale Documento</span><span style={{ color: "#1E3A5F" }}>{formatCurrency(processingInvoice.total)}</span>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            {processingInvoice.notes && (
              <div style={{ marginTop: "40px", fontSize: "12px", color: "#64748B", borderTop: "1px solid #E4E7EB", paddingTop: "20px" }}>
                <strong>Note:</strong> {processingInvoice.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="wizard-steps" style={{ borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-6)" }}>
        <button
          className={`btn ${activeTab === "active" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("active")}
          style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", marginRight: "var(--space-2)" }}
        >
          Tutte le fatture
        </button>
        <button
          className={`btn ${activeTab === "recurring" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveTab("recurring")}
          style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}
        >
          Modelli Ricorrenti
        </button>
      </div>

      {/* Progress Alert */}
      {exportProgress && (
        <div className="alert alert-info animate-fade-in" style={{ marginBottom: "var(--space-5)" }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: "spin 1.5s linear infinite", marginRight: "var(--space-2)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
          </svg>
          {exportProgress}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-5)", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="search"
          className="form-input"
          placeholder="Cerca fattura o cliente…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Cerca fattura o cliente"
          style={{ maxWidth: "280px" }}
        />
        {activeTab === "active" && (
          <select
            className="form-input form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtra per stato"
            style={{ maxWidth: "180px" }}
          >
            <option value="">Tutti gli stati</option>
            <option value="draft">Bozza</option>
            <option value="sent">Inviata</option>
            <option value="paid">Pagata</option>
            <option value="overdue">Scaduta</option>
          </select>
        )}
        
        <button
          onClick={handleExportZip}
          disabled={isExporting || filteredInvoices.length === 0}
          className="btn btn-outline"
          style={{ marginLeft: "auto" }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ marginRight: "var(--space-1)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Esporta Fiscale (ZIP)
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table" aria-label="Lista fatture">
          <thead>
            <tr>
              <th scope="col">Numero</th>
              <th scope="col">Cliente</th>
              <th scope="col">{activeTab === "recurring" ? "Ricorrenza" : "Data"}</th>
              <th scope="col">{activeTab === "recurring" ? "Azione" : "Scadenza"}</th>
              <th scope="col">Importo</th>
              <th scope="col">Stato</th>
              <th scope="col"><span className="sr-only">Azioni</span></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted-foreground)" }}>
                  Nessuna fattura trovata in questa sezione.
                </td>
              </tr>
            )}
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id} href={inv.status === "template" ? "#" : `/invoices/${inv.id}`} style={inv.status === "template" ? { cursor: "default" } : undefined}>
                <td><span className="invoice-row-number">{inv.number}</span></td>
                <td className="invoice-row-client">{inv.client.name}</td>
                {activeTab === "recurring" ? (
                  <td style={{ fontWeight: 600, color: "var(--color-secondary)" }}>
                    {inv.frequency === "weekly" ? "Settimanale" : inv.frequency === "monthly" ? "Mensile" : "Annuale"}
                  </td>
                ) : (
                  <td style={{ color: "var(--color-muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{new Date(inv.issueDate).toLocaleDateString("it-IT")}</td>
                )}
                {activeTab === "recurring" ? (
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateInvoice(inv.id);
                      }}
                      className="btn btn-accent btn-sm"
                      style={{ padding: "var(--space-1) var(--space-3)", fontSize: "var(--text-xs)" }}
                    >
                      Genera ora
                    </button>
                  </td>
                ) : (
                  <td style={{ color: "var(--color-muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{new Date(inv.dueDate).toLocaleDateString("it-IT")}</td>
                )}
                <td className="invoice-amount">{formatCurrency(inv.total)}</td>
                <td>
                  <span className={`badge badge-${inv.status}`}>
                    {statusLabel[inv.status] || inv.status}
                  </span>
                </td>
                <td>
                  {inv.status !== "template" && (
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="btn btn-ghost btn-icon"
                        aria-label={`Apri fattura ${inv.number}`}
                        id={`invoice-open-${inv.id}`}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
