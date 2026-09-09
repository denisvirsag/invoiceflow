import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EditInvoiceForm from "./EditInvoiceForm";

export default async function EditInvoicePage({
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
      lineItems: { orderBy: { position: "asc" } },
    },
  });

  if (!invoice || invoice.userId !== session.user.id) {
    notFound();
  }

  // Don't allow editing paid invoices
  if (invoice.status === "paid") {
    redirect(`/invoices/${id}`);
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return (
    <EditInvoiceForm
      invoice={{
        id: invoice.id,
        number: invoice.number,
        status: invoice.status,
        clientId: invoice.clientId,
        issueDate: invoice.issueDate.toISOString().split("T")[0],
        dueDate: invoice.dueDate.toISOString().split("T")[0],
        notes: invoice.notes || "",
        lineItems: invoice.lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          qty: item.quantity,
          price: item.unitPrice,
          vat: item.vatRate,
        })),
      }}
      clients={clients}
    />
  );
}
