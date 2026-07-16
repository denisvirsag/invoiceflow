import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import InvoiceList from "./InvoiceList";

export const metadata: Metadata = { title: "Fatture" };

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true, lineItems: true },
    orderBy: { createdAt: "desc" },
  });

  const activeInvoicesCount = invoices.filter((inv) => inv.status !== "template").length;

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Fatture</h1>
          <p className="page-subtitle">{activeInvoicesCount} fatture totali</p>
        </div>
        <Link href="/invoices/new" className="btn btn-primary" id="invoices-new-btn">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova fattura
        </Link>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.08s" }}>
        <InvoiceList invoices={invoices} />
      </div>
    </>
  );
}
