"use client";

import { useState, useMemo } from "react";

type InvoiceData = {
  status: string;
  issueDate: string; // ISO string
  total: number;
};

type TimeRange = {
  label: string;
  months: number;
};

const TIME_RANGES: TimeRange[] = [
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1A", months: 12 },
  { label: "2A", months: 24 },
  { label: "3A", months: 36 },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function formatCompact(n: number) {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}K`;
  return formatCurrency(n).replace(",00", "");
}

export default function RevenueChart({ invoices }: { invoices: InvoiceData[] }) {
  const [selectedRange, setSelectedRange] = useState(2); // Default: 6M

  const { monthlyData, maxVal, totalRevenue, avgMonthly } = useMemo(() => {
    const now = new Date();
    const months = TIME_RANGES[selectedRange].months;
    const data: { monthName: string; total: number; monthLabel: string }[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthName = months <= 6
        ? d.toLocaleString("it-IT", { month: "short" }).toUpperCase()
        : d.toLocaleString("it-IT", { month: "short" }).toUpperCase() + " " + String(y).slice(2);

      const monthInvoices = invoices.filter((inv) => {
        const invDate = new Date(inv.issueDate);
        return (
          inv.status !== "template" &&
          inv.status !== "cancelled" &&
          inv.status !== "draft" &&
          invDate.getMonth() === m &&
          invDate.getFullYear() === y
        );
      });

      const total = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const monthLabel = d.toLocaleString("it-IT", { month: "long", year: "numeric" });
      data.push({ monthName, total, monthLabel });
    }

    const maxVal = Math.max(...data.map((d) => d.total), 1);
    const totalRevenue = data.reduce((s, d) => s + d.total, 0);
    const avgMonthly = totalRevenue / months;

    return { monthlyData: data, maxVal, totalRevenue, avgMonthly };
  }, [invoices, selectedRange]);

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="card animate-fade-in-up" style={{ animationDelay: "0.15s", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-3)", padding: "var(--space-5) var(--space-5) 0" }}>
        <div>
          <h2 className="card-title" style={{ margin: 0 }}>Andamento fatturato</h2>
          <p className="card-description" style={{ margin: "var(--space-1) 0 0" }}>Fatturato mensile nel periodo selezionato</p>
        </div>

        {/* Time range selector */}
        <div style={{
          display: "flex",
          gap: "2px",
          background: "var(--color-muted)",
          borderRadius: "var(--radius-lg)",
          padding: "3px",
        }}>
          {TIME_RANGES.map((range, idx) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setSelectedRange(idx)}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: selectedRange === idx ? 700 : 500,
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: selectedRange === idx ? "var(--color-primary)" : "transparent",
                color: selectedRange === idx ? "white" : "var(--color-muted-foreground)",
                boxShadow: selectedRange === idx ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: "flex", gap: "var(--space-6)", padding: "var(--space-4) var(--space-5)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Totale periodo</div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-primary)", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(totalRevenue)}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Media mensile</div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-foreground)", fontVariantNumeric: "tabular-nums" }}>{formatCurrency(avgMonthly)}</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        height: "220px",
        display: "flex",
        alignItems: "flex-end",
        gap: monthlyData.length > 12 ? "2px" : "var(--space-3)",
        padding: "var(--space-4) var(--space-5) var(--space-4)",
        marginTop: "auto",
        position: "relative",
      }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              left: "var(--space-5)",
              right: "var(--space-5)",
              bottom: `${pct * 160 + 32}px`,
              height: "1px",
              background: "var(--color-border)",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
        ))}

        {monthlyData.map((data, index) => {
          const pct = (data.total / maxVal) * 100;
          const barHeight = Math.max(4, (pct / 100) * 160);
          const isHovered = hoveredBar === index;
          const showLabel = monthlyData.length <= 12 || index % Math.ceil(monthlyData.length / 12) === 0;

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-1)",
                position: "relative",
                cursor: "pointer",
                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div style={{
                  position: "absolute",
                  bottom: `${barHeight + 40}px`,
                  background: "var(--color-foreground)",
                  color: "var(--color-background)",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "11px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  pointerEvents: "none",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  <div style={{ fontWeight: 400, fontSize: "10px", opacity: 0.7, marginBottom: "2px" }}>
                    {data.monthLabel}
                  </div>
                  {formatCurrency(data.total)}
                </div>
              )}

              {/* Bar */}
              <div style={{
                width: "100%",
                maxWidth: monthlyData.length > 12 ? "16px" : "32px",
                height: `${barHeight}px`,
                background: isHovered
                  ? "linear-gradient(to top, var(--color-accent), var(--color-primary))"
                  : data.total > 0
                    ? "linear-gradient(to top, var(--color-primary), var(--color-secondary))"
                    : "var(--color-border)",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s ease",
                transform: isHovered ? "scaleX(1.15)" : "scaleX(1)",
                opacity: hoveredBar !== null && !isHovered ? 0.5 : 1,
              }} />

              {/* Month label */}
              {showLabel && (
                <div style={{
                  fontSize: monthlyData.length > 12 ? "9px" : "11px",
                  fontWeight: 700,
                  color: isHovered ? "var(--color-primary)" : "var(--color-foreground)",
                  marginTop: "var(--space-1)",
                  transition: "color 0.2s ease",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}>
                  {data.monthName}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
