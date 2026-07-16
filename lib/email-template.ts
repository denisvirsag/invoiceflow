interface InvoiceEmailProps {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  companyName: string;
  invoiceUrl: string;
  isReminder?: boolean;
}

export function getInvoiceEmailHtml({
  clientName,
  invoiceNumber,
  dueDate,
  totalAmount,
  companyName,
  invoiceUrl,
  isReminder = false,
}: InvoiceEmailProps): string {
  const previewText = isReminder
    ? `Sollecito di pagamento: Fattura n. ${invoiceNumber} scaduta il ${dueDate}`
    : `Nuova fattura n. ${invoiceNumber} da ${companyName}`;

  const headingText = isReminder ? "Sollecito di Pagamento" : "Fattura Ricevuta";
  
  const contentText = isReminder
    ? `Ti ricordiamo gentilmente che il pagamento della fattura n. <strong>${invoiceNumber}</strong> emessa da <strong>${companyName}</strong> risulta scaduto il <strong>${dueDate}</strong>.<br />Ti invitiamo a effettuare il saldo dell'importo dovuto non appena possibile.`
    : `Hai ricevuto una nuova fattura da <strong>${companyName}</strong>.<br />In allegato trovi il documento in formato PDF con tutti i dettagli.`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${previewText}</title>
  <style>
    body {
      background-color: #f6f9fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 40px auto;
      padding: 20px 0 48px;
      margin-bottom: 64px;
      border-radius: 8px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    .header {
      padding: 24px 32px;
      border-bottom: 1px solid #e6ebf1;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1E3A5F;
      margin: 0;
    }
    .logo-accent {
      color: #059669;
    }
    .content {
      padding: 32px;
    }
    .heading {
      color: #1E3A5F;
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 20px 0;
    }
    .text {
      color: #475569;
      font-size: 16px;
      line-height: 24px;
      margin: 0 0 16px 0;
    }
    .details-box {
      background-color: #F1F5F9;
      padding: 20px;
      border-radius: 6px;
      margin: 24px 0;
    }
    .details-row {
      margin: 0 0 12px 0;
      font-size: 16px;
      color: #0F172A;
    }
    .details-row:last-child {
      margin-bottom: 0;
    }
    .details-label {
      color: #64748B;
      display: inline-block;
      width: 120px;
    }
    .details-value {
      font-weight: 600;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      background-color: #059669;
      border-radius: 6px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      text-align: center;
      display: inline-block;
      padding: 14px 24px;
    }
    .hr {
      border: 0;
      border-top: 1px solid #e6ebf1;
      margin: 20px 0;
    }
    .footer {
      padding: 0 32px;
    }
    .footer-text {
      color: #94a3b8;
      font-size: 12px;
      text-align: center;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Invoice<span class="logo-accent">Flow</span></div>
    </div>
    <div class="content">
      <h1 class="heading">${headingText}</h1>
      <p class="text">Gentile ${clientName},</p>
      <p class="text">${contentText}</p>
      
      <div class="details-box">
        <p class="details-row">
          <span class="details-label">Fattura N:</span> 
          <span class="details-value">${invoiceNumber}</span>
        </p>
        <p class="details-row">
          <span class="details-label">Scadenza:</span> 
          <span class="details-value">${dueDate}</span>
        </p>
        <p class="details-row">
          <span class="details-label">Importo Totale:</span> 
          <strong class="details-value" style="font-size: 18px; color: #1E3A5F;">${totalAmount}</strong>
        </p>
      </div>

      <div class="button-container">
        <a href="${invoiceUrl}" class="button" target="_blank" rel="noopener noreferrer" style="color: #ffffff;">Paga o Visualizza Fattura</a>
      </div>

      <p class="text">Se hai domande o necessità di chiarimenti, non esitare a rispondere a questa email.</p>
      <p class="text">Grazie,<br />Il team di ${companyName}</p>
    </div>
    <hr class="hr" />
    <div class="footer">
      <p class="footer-text">Questo messaggio è stato inviato in automatico da InvoiceFlow per conto di ${companyName}.</p>
    </div>
  </div>
</body>
</html>
  `;
}
