import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { InvoiceEmail } from "@/components/email/InvoiceEmail";
import React from "react";

// Inizializza Resend con la chiave API (fallback fittizio se manca nel .env)
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_123");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next.js 16 params in route handlers can be Promises or accessed synchronously depending on config, but best practice is Promise
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. In un'app reale recupereremmo la fattura da Prisma qui
    // const invoice = await prisma.invoice.findUnique({ ... })
    // e genereremmo il PDF usando @react-pdf/renderer
    // const pdfBuffer = await renderToBuffer(<InvoicePDF data={invoice} />);

    console.log(`[API] Richiesta di invio email per la fattura ${id}...`);
    console.log("[API] Dati ricevuti dal client:", body);

    const isReminder = body.type === "reminder";
    const subject = isReminder
      ? `Sollecito di pagamento: Fattura n. ${body.invoiceNumber} da ${body.companyName || "La tua azienda"}`
      : `Nuova fattura ${body.invoiceNumber} da ${body.companyName || "La tua azienda"}`;

    // 2. Mockiamo l'invio. Se non c'è una VERA API KEY di Resend, logghiamo solo l'intento
    if (!process.env.RESEND_API_KEY) {
      console.warn("[API] Attenzione: RESEND_API_KEY non configurata. L'email non verrà realmente inviata, è solo una simulazione.");
      
      // Simuliamo un delay di rete per testare l'UI loading
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      return NextResponse.json({ 
        success: true, 
        message: isReminder
          ? "Simulazione: Sollecito inviato con successo! (Aggiungi RESEND_API_KEY per l'invio reale)"
          : "Simulazione: Email inviata con successo! (Aggiungi RESEND_API_KEY nel .env per l'invio reale)" 
      });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // 3. Invio REALE tramite Resend
    const data = await resend.emails.send({
      from: "Fatture InvoiceFlow <onboarding@resend.dev>", // Cambia con il tuo dominio verificato
      to: body.clientEmail || "delivered@resend.dev",
      subject,
      react: React.createElement(InvoiceEmail, {
        clientName: body.clientName,
        invoiceNumber: body.invoiceNumber,
        dueDate: body.dueDate,
        totalAmount: body.totalAmount,
        companyName: body.companyName,
        invoiceUrl: `${baseUrl}/invoices/${id}`,
        isReminder,
      }),
      // In futuro aggiungeremo:
      // attachments: [{ filename: `Fattura_${body.invoiceNumber}.pdf`, content: pdfBuffer }]
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API] Errore invio email:", error);
    return NextResponse.json({ error: "Errore durante l'invio dell'email." }, { status: 500 });
  }
}
