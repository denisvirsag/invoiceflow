import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import InvoiceActions from "./InvoiceActions";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

const statusLabel: Record<string, string> = {
  draft: "Bozza",
  sent: "Inviata",
  paid: "Pagata",
  overdue: "Scaduta",
  cancelled: "Annullata",
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");
  
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      lineItems: true,
      user: true, // For companyName
    },
  });

  if (!invoice || invoice.userId !== session.user.id) {
    notFound();
  }

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <Link href="/invoices" style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)", display: "inline-block" }}>
            &larr; Torna alle fatture
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <h1 className="page-title">Fattura {invoice.number}</h1>
            <span className={`badge badge-${invoice.status}`}>{statusLabel[invoice.status] || invoice.status}</span>
          </div>
        </div>
        <InvoiceActions
          invoiceId={invoice.id}
          invoiceNumber={invoice.number}
          clientName={invoice.client.name}
          clientEmail={invoice.client.email}
          dueDate={invoice.dueDate.toLocaleDateString("it-IT")}
          totalAmount={formatCurrency(invoice.total)}
          companyName={invoice.user.companyName || invoice.user.name || "La tua azienda"}
          status={invoice.status}
        />
      </div>

      <div
        className="invoice-print-container animate-fade-in-up"
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-8)",
          boxShadow: "var(--shadow-sm)",
          maxWidth: 900,
          margin: "0 auto",
          animationDelay: "0.05s"
        }}
        aria-label="Dettaglio fattura"
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--color-primary)", letterSpacing: "-0.04em" }}>
              Invoice<span style={{ color: "var(--color-accent)" }}>Flow</span>
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)", marginTop: "var(--space-1)" }}>
              {invoice.user.companyName || invoice.user.name}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--color-foreground)" }}>
              FATTURA
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              {invoice.number}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)", marginTop: "var(--space-1)" }}>
              Emessa: {invoice.issueDate.toLocaleDateString("it-IT")} · Scade: {invoice.dueDate.toLocaleDateString("it-IT")}
            </div>
          </div>
        </div>

        {/* Client */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)" }}>
            Fatturato a
          </div>
          <div style={{ fontWeight: 700, fontSize: "var(--text-base)" }}>{invoice.client.name}</div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>{invoice.client.email || invoice.client.vatNumber}</div>
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
              {invoice.lineItems.map((it) => (
                <tr key={it.id} style={{ cursor: "default" }}>
                  <td>{it.description}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{it.quantity}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(it.unitPrice)}</td>
                  <td style={{ textAlign: "right" }}>{it.vatRate}%</td>
                  <td style={{ textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{formatCurrency(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ minWidth: "auto", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>Imponibile</span><span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <span>Totale IVA</span><span>{formatCurrency(invoice.vatTotal)}</span>
            </div>
            <div style={{ height: 1, backgroundColor: "var(--color-border)", margin: "var(--space-1) 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-lg)", fontWeight: 800 }}>
              <span>Totale Documento</span><span style={{ color: "var(--color-primary)" }}>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <div style={{ marginTop: "var(--space-8)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-border)" }}>
            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-2)" }}>Note:</h4>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", whiteSpace: "pre-wrap" }}>{invoice.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}
