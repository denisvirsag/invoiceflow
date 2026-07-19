import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import ClientEditForm from "./ClientEditForm";
import type { Invoice } from "@prisma/client";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();
  
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client || client.userId !== session.user.id) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isFreePlan = !user?.plan || user.plan === "free";
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonthInvoicesCount = await prisma.invoice.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth },
    },
  });
  const isLimitReached = isFreePlan && thisMonthInvoicesCount >= 5;

  // Calculate totals
  const totalInvoiced = client.invoices.reduce((sum: number, inv: { total: number }) => sum + inv.total, 0);

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <Link href="/clients" style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)", display: "inline-block" }}>
            &larr; Torna ai clienti
          </Link>
          <h1 className="page-title">{client.name}</h1>
          <p className="page-subtitle">Dettaglio e storico fatture</p>
        </div>
      </div>

      <div className="grid-client-detail" style={{ display: "grid", gap: "var(--space-6)" }}>
        {/* Left Col: Form for Editing */}
        <div className="card animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
           <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Dati Anagrafici</h3>
           <ClientEditForm client={client} />
        </div>

        {/* Right Col: Stats & Invoices */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", animationDelay: "0.1s" }} className="animate-fade-in-up">
           <div className="card">
             <h3 style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-2)" }}>Totale Fatturato</h3>
             <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)", letterSpacing: "-0.02em" }}>
               € {totalInvoiced.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
             </div>
           </div>

           <div className="card">
             <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Ultime Fatture</h3>
             {client.invoices.length === 0 ? (
               <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)" }}>Nessuna fattura emessa.</p>
             ) : (
               <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                 {client.invoices.map((inv: Invoice) => (
                   <li key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)" }}>
                     <div>
                       <Link href={`/invoices/${inv.id}`} style={{ fontWeight: 600, color: "var(--color-primary)" }}>{inv.number}</Link>
                       <div style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)" }}>{inv.issueDate.toLocaleDateString("it-IT")}</div>
                     </div>
                     <div style={{ fontWeight: 700 }}>
                       € {inv.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                     </div>
                   </li>
                 ))}
               </ul>
             )}
              {isLimitReached ? (
                <Link href="/settings/billing" className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: "var(--space-4)", opacity: 0.6, cursor: "not-allowed" }}>
                  Limite Raggiunto
                </Link>
              ) : (
                <Link href="/invoices/new" className="btn btn-outline btn-sm" style={{ width: "100%", marginTop: "var(--space-4)" }}>Nuova fattura</Link>
              )}
           </div>
        </div>
      </div>
    </>
  );
}
