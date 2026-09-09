import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Clienti" };

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    include: {
      invoices: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Clienti</h1>
          <p className="page-subtitle">{clients.length} clienti registrati</p>
        </div>
        <Link href="/clients/new" className="btn btn-primary" id="clients-new-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuovo cliente
        </Link>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
        <div style={{ marginBottom: "var(--space-5)" }}>
          <input
            type="search"
            className="form-input"
            placeholder="Cerca cliente…"
            id="clients-search"
            aria-label="Cerca cliente"
            style={{ maxWidth: "320px" }}
          />
        </div>
        <div className="table-wrapper">
          <table className="table" aria-label="Lista clienti">
            <thead>
              <tr>
                <th scope="col">Ragione sociale</th>
                <th scope="col">Email</th>
                <th scope="col">P.IVA</th>
                <th scope="col" style={{ textAlign: "right" }}>Fatture</th>
                <th scope="col" style={{ textAlign: "right" }}>Fatturato tot.</th>
                <th scope="col"><span className="sr-only">Azioni</span></th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-muted-foreground)" }}>
                    Nessun cliente trovato. <Link href="/clients/new" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Aggiungi il primo</Link>.
                  </td>
                </tr>
              )}
              {clients.map((c) => {
                const total = c.invoices.reduce((sum, inv) => sum + inv.total, 0);
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: "var(--color-muted-foreground)" }}>{c.email || "—"}</td>
                    <td style={{ color: "var(--color-muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{c.vatNumber || "—"}</td>
                    <td style={{ textAlign: "right" }}>{c.invoices.length}</td>
                    <td className="invoice-amount" style={{ textAlign: "right" }}>
                      € {total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
                        <Link
                          href={`/clients/${c.id}`}
                          className="btn btn-ghost btn-icon"
                          aria-label={`Apri cliente ${c.name}`}
                          id={`client-open-${c.id}`}
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
