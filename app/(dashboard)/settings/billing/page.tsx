import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Abbonamento" };

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const invoicesCount = await prisma.invoice.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth }
    }
  });

  const isFreePlan = !user?.plan || user.plan === "free";
  const limit = 5;
  const percentage = isFreePlan ? Math.min((invoicesCount / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - invoicesCount, 0);

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Gestione Abbonamento</h1>
          <p className="page-subtitle">Piani, fatturazione e limiti di utilizzo</p>
        </div>
        <Link href="/settings" className="btn btn-ghost" id="billing-back-btn">
          Torna al Profilo
        </Link>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.05s", maxWidth: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>Piano Attuale</h2>
            <p style={{ color: "var(--color-muted-foreground)", marginTop: "var(--space-1)" }}>Sei attualmente sul piano <strong style={{ textTransform: "capitalize", color: "var(--color-foreground)" }}>{user?.plan || "free"}</strong>.</p>
          </div>
          <span className="badge badge-paid" style={{ fontSize: "var(--text-sm)", padding: "var(--space-1) var(--space-3)" }}>Attivo</span>
        </div>

        <div style={{ background: "var(--color-muted)", padding: "var(--space-6)", borderRadius: "var(--radius-lg)", marginBottom: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
            <span style={{ fontWeight: 600 }}>Fatture create questo mese</span>
            <span style={{ fontWeight: 600 }}>{invoicesCount} {isFreePlan ? `/ ${limit}` : ''}</span>
          </div>
          {isFreePlan ? (
            <>
              <div style={{ height: 8, background: "var(--color-border)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percentage}%`, background: "var(--color-primary)", borderRadius: "var(--radius-full)" }} />
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginTop: "var(--space-2)" }}>
                {remaining > 0 
                  ? `Ti restano ${remaining} ${remaining === 1 ? 'fattura' : 'fatture'} prima di raggiungere il limite del piano Free.` 
                  : "Hai raggiunto il limite del piano Free. Passa a Pro per fatture illimitate."}
              </p>
            </>
          ) : (
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginTop: "var(--space-2)" }}>
              Hai fatture illimitate incluse nel tuo piano {user?.plan}.
            </p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          <div style={{ border: "2px solid var(--color-primary)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--color-primary)", color: "white", padding: "2px 12px", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 700 }}>
              CONSIGLIATO
            </div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Pro</h3>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "var(--space-4)" }}>€ 9<span style={{ fontSize: "var(--text-base)", color: "var(--color-muted-foreground)", fontWeight: 400 }}>/mese</span></div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Fatture e clienti illimitati</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ 150 invii email / mese</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Esportazione Fiscale (ZIP/CSV)</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Solleciti di pagamento automatici</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Rimozione watermark</li>
            </ul>
            <button className="btn btn-primary" style={{ width: "100%" }}>Passa a Pro</button>
          </div>

          <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Business</h3>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: "var(--space-4)" }}>€ 29<span style={{ fontSize: "var(--text-base)", color: "var(--color-muted-foreground)", fontWeight: 400 }}>/mese</span></div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Tutto del piano Pro</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ 1000 invii email / mese</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Fatturazione Ricorrente</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Mittente email personalizzato</li>
              <li style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>✓ Assistenza H24 prioritaria</li>
            </ul>
            <button className="btn btn-outline" style={{ width: "100%" }}>Passa a Business</button>
          </div>
        </div>
      </div>
    </>
  );
}
