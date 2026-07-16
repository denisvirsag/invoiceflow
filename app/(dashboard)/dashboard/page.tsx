import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TableRow from "@/components/TableRow";

export const metadata: Metadata = {
  title: "Dashboard",
};

const statusLabel: Record<string, string> = {
  draft: "Bozza",
  sent: "Inviata",
  paid: "Pagata",
  overdue: "Scaduta",
  cancelled: "Annullata",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  // Fetch invoices for KPIs
  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true, lineItems: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Calculate KPIs
  let revenue = 0;
  let openCount = 0;
  let paidCount = 0;
  let overdueCount = 0;

  let totalPaidDays = 0;
  let paidInvoicesCount = 0;

  // VAT rate breakdown grouping
  const vatRatesBreakdown: Record<number, { net: number; vat: number; total: number }> = {};

  for (const inv of invoices) {
    if (inv.status === "paid" && inv.issueDate.getMonth() === currentMonth && inv.issueDate.getFullYear() === currentYear) {
      revenue += inv.total;
      paidCount++;
    }
    if (inv.status === "sent") {
      openCount++;
    }
    if (inv.status === "overdue" || (inv.status === "sent" && inv.dueDate < now)) {
      overdueCount++;
    }

    // Average payment time calculation
    if (inv.status === "paid") {
      const pDate = inv.paidAt || inv.updatedAt;
      const diffTime = Math.abs(pDate.getTime() - inv.issueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalPaidDays += diffDays;
      paidInvoicesCount++;

      // VAT breakdown grouping
      for (const item of inv.lineItems) {
        const rate = item.vatRate;
        const net = item.unitPrice * item.quantity;
        const vat = net * (rate / 100);
        const total = net + vat;
        if (!vatRatesBreakdown[rate]) {
          vatRatesBreakdown[rate] = { net: 0, vat: 0, total: 0 };
        }
        vatRatesBreakdown[rate].net += net;
        vatRatesBreakdown[rate].vat += vat;
        vatRatesBreakdown[rate].total += total;
      }
    }
  }

  const avgPaymentTime = paidInvoicesCount > 0 ? Math.round(totalPaidDays / paidInvoicesCount) : null;
  const avgPaymentTimeStr = avgPaymentTime !== null ? `${avgPaymentTime} ${avgPaymentTime === 1 ? 'giorno' : 'giorni'}` : "—";

  // Group revenue by month for the last 6 months
  const monthlyData: { monthName: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const m = d.getMonth();
    const y = d.getFullYear();
    const monthName = d.toLocaleString("it-IT", { month: "short" }).toUpperCase();
    
    const monthInvoices = invoices.filter(
      (inv) => inv.status === "paid" && inv.issueDate.getMonth() === m && inv.issueDate.getFullYear() === y
    );
    const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
    monthlyData.push({ monthName, total });
  }

  const maxMonthlyVal = Math.max(...monthlyData.map(d => d.total), 1);
  const recentInvoices = invoices.filter(inv => inv.status !== "template").slice(0, 5);

  const kpiData = [
    {
      id: "revenue",
      label: "Fatturato (mese)",
      value: formatCurrency(revenue),
      trend: "Mese corrente",
      trendDir: "up",
      iconColor: "var(--color-primary)",
      iconBg: "var(--color-primary-light)",
      accent: "var(--color-primary)",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "open",
      label: "Fatture aperte",
      value: openCount.toString(),
      trend: "In attesa",
      trendDir: "up",
      iconColor: "var(--color-secondary)",
      iconBg: "var(--color-status-sent-bg)",
      accent: "var(--color-secondary)",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "paid",
      label: "Pagate (mese)",
      value: paidCount.toString(),
      trend: "Mese corrente",
      trendDir: "up",
      iconColor: "var(--color-accent)",
      iconBg: "var(--color-status-paid-bg)",
      accent: "var(--color-accent)",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "overdue",
      label: "Scadute",
      value: overdueCount.toString(),
      trend: "Da sollecitare",
      trendDir: "down",
      iconColor: "var(--color-destructive)",
      iconBg: "var(--color-status-overdue-bg)",
      accent: "var(--color-destructive)",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: "avgPayment",
      label: "Tempo incasso medio",
      value: avgPaymentTimeStr,
      trend: "Data emissione -> saldo",
      trendDir: "up",
      iconColor: "var(--color-info)",
      iconBg: "var(--color-on-info)",
      accent: "var(--color-info)",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const firstName = user?.name?.split(" ")[0] || "User";
  const currentMonthName = now.toLocaleString('it-IT', { month: 'long' });

  return (
    <>
      {/* Page Header */}
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Benvenuto, {firstName}. Ecco il riepilogo di {currentMonthName} {currentYear}.</p>
        </div>
        <Link href="/invoices/new" className="btn btn-primary" id="dashboard-new-invoice-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova fattura
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid-kpi" style={{ animationDelay: "0.05s" }}>
        {kpiData.map((kpi, i) => (
          <article
            key={kpi.id}
            className="kpi-tile animate-fade-in-up"
            style={{
              "--kpi-accent": kpi.accent,
              "--kpi-icon-bg": kpi.iconBg,
              "--kpi-icon-color": kpi.iconColor,
              animationDelay: `${i * 0.07}s`,
            } as React.CSSProperties}
            aria-label={`${kpi.label}: ${kpi.value}`}
          >
            <div className="kpi-tile-header">
              <span className="kpi-tile-label">{kpi.label}</span>
              <div className="kpi-tile-icon" aria-hidden="true">{kpi.icon}</div>
            </div>
            <div className="kpi-tile-value">{kpi.value}</div>
            <div className={`kpi-tile-trend ${kpi.trendDir}`}>
              {kpi.trendDir === "up" ? (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17H5m0 0V9m0 8l8-8 4 4 6-6" />
                </svg>
              )}
              {kpi.trend}
            </div>
          </article>
        ))}
      </div>

      {/* Charts & Tax Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--space-6)", marginTop: "var(--space-8)" }}>
        {/* Monthly trend chart */}
        <div className="card animate-fade-in-up" style={{ animationDelay: "0.15s", display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Fatturato ultimi 6 mesi</h2>
              <p className="card-description">Fatturato riscosso mensile</p>
            </div>
          </div>
          <div style={{ height: "240px", display: "flex", alignItems: "flex-end", gap: "var(--space-4)", padding: "var(--space-6) var(--space-4) var(--space-4) var(--space-4)", marginTop: "auto" }}>
            {monthlyData.map((data, index) => {
              const pct = (data.total / maxMonthlyVal) * 100;
              const barHeight = Math.max(8, (pct / 100) * 140);
              return (
                <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-muted-foreground)", fontVariantNumeric: "tabular-nums", textAlign: "center" }}>
                    {data.total > 0 ? formatCurrency(data.total).replace(",00", "") : "—"}
                  </div>
                  <div style={{
                    width: "100%",
                    maxWidth: "32px",
                    height: `${barHeight}px`,
                    background: "linear-gradient(to top, var(--color-primary), var(--color-secondary))",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease-out"
                  }} />
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-foreground)", marginTop: "var(--space-1)" }}>
                    {data.monthName}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* VAT breakdown table */}
        <div className="card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Riepilogo fiscale IVA</h2>
              <p className="card-description">Raggruppamento per aliquota su fatture pagate</p>
            </div>
          </div>
          <div className="table-wrapper" style={{ border: "none" }}>
            <table className="table" aria-label="Riepilogo fiscale IVA">
              <thead>
                <tr>
                  <th scope="col">Aliquota</th>
                  <th scope="col" style={{ textAlign: "right" }}>Imponibile</th>
                  <th scope="col" style={{ textAlign: "right" }}>Imposta (IVA)</th>
                  <th scope="col" style={{ textAlign: "right" }}>Totale</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(vatRatesBreakdown).length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted-foreground)" }}>
                      Nessun dato fiscale disponibile.
                    </td>
                  </tr>
                ) : (
                  Object.entries(vatRatesBreakdown).map(([rate, vals]) => (
                    <tr key={rate} style={{ cursor: "default" }}>
                      <td style={{ fontWeight: 700 }}>{rate}%</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(vals.net)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--color-muted-foreground)" }}>{formatCurrency(vals.vat)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "var(--color-primary)" }}>{formatCurrency(vals.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card animate-fade-in-up" style={{ marginTop: "var(--space-8)", animationDelay: "0.3s" }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Fatture recenti</h2>
            <p className="card-description">Le ultime 5 fatture attive create</p>
          </div>
          <Link href="/invoices" className="btn btn-outline btn-sm" id="dashboard-view-all-btn">
            Vedi tutte
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="table" aria-label="Fatture recenti">
            <thead>
              <tr>
                <th scope="col">Numero</th>
                <th scope="col">Cliente</th>
                <th scope="col">Data</th>
                <th scope="col">Importo</th>
                <th scope="col">Stato</th>
                <th scope="col"><span className="sr-only">Azioni</span></th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted-foreground)" }}>Nessuna fattura creata.</td>
                </tr>
              )}
              {recentInvoices.map((inv) => (
                <TableRow key={inv.id} href={`/invoices/${inv.id}`}>
                  <td>
                    <span className="invoice-row-number">
                      {inv.number}
                    </span>
                  </td>
                  <td className="invoice-row-client">{inv.client.name}</td>
                  <td style={{ color: "var(--color-muted-foreground)" }}>{inv.issueDate.toLocaleDateString("it-IT")}</td>
                  <td className="invoice-amount">{formatCurrency(inv.total)}</td>
                  <td>
                    <span className={`badge badge-${inv.status}`} aria-label={`Stato: ${statusLabel[inv.status]}`}>
                      {statusLabel[inv.status] || inv.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/invoices/${inv.id}`} className="btn btn-ghost btn-icon" aria-label={`Vedi fattura ${inv.number}`}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-4)",
          marginTop: "var(--space-6)",
        }}
        className="animate-fade-in-up"
      >
        <Link href="/invoices/new" className="btn btn-primary" id="dashboard-quick-invoice-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Crea fattura
        </Link>
        <Link href="/clients/new" className="btn btn-outline" id="dashboard-quick-client-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Aggiungi cliente
        </Link>
      </div>
    </>
  );
}
