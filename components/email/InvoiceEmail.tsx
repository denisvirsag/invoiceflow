import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  companyName: string;
  invoiceUrl: string;
  isReminder?: boolean;
}

export const InvoiceEmail = ({
  clientName = "Cliente Srl",
  invoiceNumber = "2026/001",
  dueDate = "25 Luglio 2026",
  totalAmount = "€ 1.250,00",
  companyName = "La tua azienda",
  invoiceUrl = "http://localhost:3000/invoices/INV-001",
  isReminder = false,
}: InvoiceEmailProps) => {
  const previewText = isReminder
    ? `Sollecito di pagamento: Fattura n. ${invoiceNumber} scaduta il ${dueDate}`
    : `Nuova fattura n. ${invoiceNumber} da ${companyName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={companyNameStyle}>
              Invoice<span style={{ color: "#059669" }}>Flow</span>
            </Text>
          </Section>
          <Section style={content}>
            <Heading style={h1}>
              {isReminder ? "Sollecito di Pagamento" : "Fattura Ricevuta"}
            </Heading>
            <Text style={text}>
              Gentile {clientName},
            </Text>
            {isReminder ? (
              <Text style={text}>
                Ti ricordiamo gentilmente che il pagamento della fattura n. <strong>{invoiceNumber}</strong> emessa da <strong>{companyName}</strong> risulta scaduto il <strong>{dueDate}</strong>. 
                Ti invitiamo a effettuare il saldo dell'importo dovuto non appena possibile.
              </Text>
            ) : (
              <Text style={text}>
                Hai ricevuto una nuova fattura da <strong>{companyName}</strong>. 
                In allegato trovi il documento in formato PDF con tutti i dettagli.
              </Text>
            )}
            
            <Section style={detailsBox}>
              <Text style={detailsRow}>
                <span style={detailsLabel}>Fattura N:</span> 
                <span style={detailsValue}>{invoiceNumber}</span>
              </Text>
              <Text style={detailsRow}>
                <span style={detailsLabel}>Scadenza:</span> 
                <span style={detailsValue}>{dueDate}</span>
              </Text>
              <Text style={detailsRow}>
                <span style={detailsLabel}>Importo Totale:</span> 
                <strong style={{ ...detailsValue, fontSize: "18px", color: "#1E3A5F" }}>{totalAmount}</strong>
              </Text>
            </Section>

            <Section style={{ textAlign: "center", marginTop: "32px", marginBottom: "32px" }}>
              <Button style={button} href={invoiceUrl}>
                Paga o Visualizza Fattura
              </Button>
            </Section>

            <Text style={text}>
              Se hai domande o necessità di chiarimenti, non esitare a rispondere a questa email.
            </Text>
            <Text style={text}>
              Grazie,<br />
              Il team di {companyName}
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Questo messaggio è stato inviato in automatico da InvoiceFlow per conto di {companyName}.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

// --- STILI CSS-in-JS (React Email richiede CSS inline) ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const header = {
  padding: "24px 32px",
  borderBottom: "1px solid #e6ebf1",
};

const companyNameStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1E3A5F",
  margin: "0",
};

const content = {
  padding: "32px",
};

const h1 = {
  color: "#1E3A5F",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px 0",
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};

const detailsBox = {
  backgroundColor: "#F1F5F9",
  padding: "20px",
  borderRadius: "6px",
  margin: "24px 0",
};

const detailsRow = {
  display: "block",
  margin: "0 0 12px 0",
  fontSize: "16px",
};

const detailsLabel = {
  color: "#64748B",
  display: "inline-block",
  width: "120px",
};

const detailsValue = {
  color: "#0F172A",
  fontWeight: "600",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 32px",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "12px",
  textAlign: "center" as const,
};
