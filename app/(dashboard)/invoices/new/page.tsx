import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import InvoiceWizard from "./InvoiceWizard";

export const metadata: Metadata = { title: "Nuova Fattura" };
export const dynamic = "force-dynamic";

async function getNextInvoiceNumber(userId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `${currentYear}/`;

  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      number: {
        startsWith: prefix,
      },
    },
    select: {
      number: true,
    },
  });

  if (invoices.length === 0) {
    return `${prefix}001`;
  }

  let maxNum = 0;
  for (const inv of invoices) {
    const parts = inv.number.split("/");
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  const padded = String(nextNum).padStart(3, "0");
  return `${prefix}${padded}`;
}

export default async function NewInvoicePage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const [clients, suggestedInvoiceNumber] = await Promise.all([
    prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    getNextInvoiceNumber(session.user.id),
  ]);

  return <InvoiceWizard clients={clients} suggestedInvoiceNumber={suggestedInvoiceNumber} />;
}
