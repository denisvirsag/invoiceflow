"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  const { clientId, invoiceNumber, issueDate, dueDate, lineItems, notes, isRecurring, frequency } = data;

  if (!clientId || !invoiceNumber || !issueDate || !dueDate || !lineItems || lineItems.length === 0) {
    throw new Error("Dati mancanti");
  }

  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      userId: session.user.id,
      number: invoiceNumber,
    },
  });

  if (existingInvoice) {
    throw new Error(`Esiste già una fattura con il numero ${invoiceNumber}. Scegli un numero diverso.`);
  }

  // Calculate totals
  let subtotal = 0;
  let vatTotal = 0;
  let total = 0;

  for (const item of lineItems) {
    const itemNet = item.qty * item.price;
    const itemVat = itemNet * (item.vat / 100);
    subtotal += itemNet;
    vatTotal += itemVat;
    total += itemNet + itemVat;
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: session.user.id,
      clientId,
      number: invoiceNumber,
      status: isRecurring ? "template" : "draft",
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      subtotal,
      vatTotal,
      total,
      notes,
      isRecurring: isRecurring || false,
      frequency: isRecurring ? frequency : null,
      lineItems: {
        create: lineItems.map((item: any, i: number) => ({
          description: item.description,
          quantity: item.qty,
          unitPrice: item.price,
          vatRate: item.vat,
          total: (item.qty * item.price) * (1 + item.vat / 100),
          position: i,
        })),
      },
    },
  });

  revalidatePath("/invoices");
  revalidatePath(`/clients/${clientId}`);
  return invoice.id;
}

export async function updateInvoiceStatusAction(invoiceId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { userId: true }
  });

  if (!invoice || invoice.userId !== session.user.id) {
    throw new Error("Fattura non trovata o non autorizzato");
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status,
      paidAt: status === "paid" ? new Date() : null
    }
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath(`/invoices/${invoiceId}`);
}

export async function generateInvoiceFromTemplateAction(templateId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  const template = await prisma.invoice.findUnique({
    where: { id: templateId },
    include: { lineItems: true }
  });

  if (!template || template.userId !== session.user.id) {
    throw new Error("Modello non trovato o non autorizzato");
  }

  // Find last invoice number to increment
  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId: session.user.id, status: { not: "template" } },
    orderBy: { createdAt: "desc" },
    select: { number: true }
  });

  let nextNumber = "2026/001";
  if (lastInvoice) {
    const parts = lastInvoice.number.split("/");
    if (parts.length === 2 && !isNaN(Number(parts[1]))) {
      const nextSeq = String(Number(parts[1]) + 1).padStart(parts[1].length, "0");
      nextNumber = `${parts[0]}/${nextSeq}`;
    } else {
      nextNumber = `${lastInvoice.number}-bis`;
    }
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: session.user.id,
      clientId: template.clientId,
      number: nextNumber,
      status: "draft",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days due
      subtotal: template.subtotal,
      vatTotal: template.vatTotal,
      total: template.total,
      notes: template.notes,
      currency: template.currency,
      lineItems: {
        create: template.lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          total: item.total,
          position: item.position
        }))
      }
    }
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return invoice.id;
}

