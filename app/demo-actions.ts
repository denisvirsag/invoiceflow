"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function startDemoAction() {
  const randomId = Math.random().toString(36).substring(2, 10);
  const email = `demo_${randomId}@invoiceflow.demo`;
  const password = "demopassword";
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // 1. Create the Demo User
    const user = await prisma.user.create({
      data: {
        email,
        name: "Mario Rossi (Demo)",
        passwordHash,
        companyName: "Rossi Consulting S.r.l.",
        vatNumber: "IT12345678901",
        address: "Via Roma 10",
        city: "Milano",
        zip: "20121",
        country: "IT",
        phone: "+39 02 1234567",
        plan: "free",
      },
    });

    // 2. Create default Clients
    const clientAlfa = await prisma.client.create({
      data: {
        userId: user.id,
        name: "Azienda Alfa S.p.A.",
        email: "amministrazione@azienda-alfa.it",
        vatNumber: "IT09876543210",
        taxCode: "09876543210",
        address: "Corso Vittorio Emanuele II, 45",
        city: "Torino",
        zip: "10125",
        country: "IT",
      },
    });

    const clientBianchi = await prisma.client.create({
      data: {
        userId: user.id,
        name: "Studio Associato Bianchi",
        email: "info@studiobianchi.it",
        vatNumber: "IT01234567890",
        taxCode: "01234567890",
        address: "Piazza del Popolo, 12",
        city: "Roma",
        zip: "00187",
        country: "IT",
      },
    });

    const clientVerdi = await prisma.client.create({
      data: {
        userId: user.id,
        name: "Luca Verdi (Freelance)",
        email: "luca.verdi@gmail.com",
        vatNumber: "",
        taxCode: "VRDLCU80A01F205Z",
        address: "Viale Monza, 122",
        city: "Milano",
        zip: "20128",
        country: "IT",
      },
    });

    // 3. Create default Invoices
    const now = new Date();

    // Invoice 1: Paid (created 20 days ago, due 10 days ago, paid 9 days ago)
    const issueDate1 = new Date();
    issueDate1.setDate(now.getDate() - 20);
    const dueDate1 = new Date();
    dueDate1.setDate(now.getDate() - 10);
    const paidAt1 = new Date();
    paidAt1.setDate(now.getDate() - 9);

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clientAlfa.id,
        number: "2026/001",
        status: "paid",
        issueDate: issueDate1,
        dueDate: dueDate1,
        paidAt: paidAt1,
        subtotal: 2100.0,
        vatTotal: 462.0,
        total: 2562.0,
        notes: "Pagamento ricevuto con bonifico bancario. Grazie.",
        lineItems: {
          create: [
            {
              description: "Consulenza Direzionale - Analisi KPI",
              quantity: 5,
              unitPrice: 120.0,
              vatRate: 22,
              total: 732.0,
              position: 0,
            },
            {
              description: "Sviluppo Dashboard personalizzata",
              quantity: 1,
              unitPrice: 1500.0,
              vatRate: 22,
              total: 1830.0,
              position: 1,
            },
          ],
        },
      },
    });

    // Invoice 2: Sent (created 5 days ago, due in 25 days)
    const issueDate2 = new Date();
    issueDate2.setDate(now.getDate() - 5);
    const dueDate2 = new Date();
    dueDate2.setDate(now.getDate() + 25);

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clientBianchi.id,
        number: "2026/002",
        status: "sent",
        issueDate: issueDate2,
        dueDate: dueDate2,
        subtotal: 450.0,
        vatTotal: 99.0,
        total: 549.0,
        notes: "Pagamento tramite bonifico bancario a 30gg data fattura.",
        lineItems: {
          create: [
            {
              description: "Canone mensile Assistenza IT",
              quantity: 1,
              unitPrice: 450.0,
              vatRate: 22,
              total: 549.0,
              position: 0,
            },
          ],
        },
      },
    });

    // Invoice 3: Overdue (created 40 days ago, due 10 days ago)
    const issueDate3 = new Date();
    issueDate3.setDate(now.getDate() - 40);
    const dueDate3 = new Date();
    dueDate3.setDate(now.getDate() - 10);

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clientVerdi.id,
        number: "2026/003",
        status: "overdue",
        issueDate: issueDate3,
        dueDate: dueDate3,
        subtotal: 2850.0,
        vatTotal: 627.0,
        total: 3477.0,
        notes: "Si prega di saldare la fattura entro i termini indicati.",
        lineItems: {
          create: [
            {
              description: "Realizzazione Sito Web E-commerce",
              quantity: 1,
              unitPrice: 2500.0,
              vatRate: 22,
              total: 3050.0,
              position: 0,
            },
            {
              description: "Configurazione gateway di pagamento",
              quantity: 1,
              unitPrice: 350.0,
              vatRate: 22,
              total: 427.0,
              position: 1,
            },
          ],
        },
      },
    });

    // 4. Sign in the Demo User
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("Demo Auth Error:", error);
    }
    throw error;
  }
}
