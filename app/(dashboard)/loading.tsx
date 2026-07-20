export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header Skeleton */}
      <div className="page-header">
        <div>
          <div className="skeleton" style={{ width: 180, height: 32, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 260, height: 16 }} />
        </div>
        <div className="skeleton" style={{ width: 120, height: 40, borderRadius: "var(--radius-lg)" }} />
      </div>

      {/* KPI Tiles Skeleton */}
      <div className="grid-kpi">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ padding: "var(--space-5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <div className="skeleton" style={{ width: 80, height: 14 }} />
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: "var(--radius-lg)" }} />
            </div>
            <div className="skeleton" style={{ width: 120, height: 28, marginBottom: "var(--space-2)" }} />
            <div className="skeleton" style={{ width: 90, height: 12 }} />
          </div>
        ))}
      </div>

      {/* Main Card Skeleton */}
      <div className="card" style={{ padding: "var(--space-6)" }}>
        <div className="skeleton" style={{ width: "100%", height: 200 }} />
      </div>
    </div>
  );
}
