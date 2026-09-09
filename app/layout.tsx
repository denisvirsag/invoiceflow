import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InvoiceFlow — Fatture professionali in pochi click",
    template: "%s | InvoiceFlow",
  },
  description:
    "Crea, invia e gestisci fatture professionali. La soluzione SaaS per freelancer e PMI italiane.",
  keywords: ["fatture", "invoice", "fatturazione", "SaaS", "freelancer", "PMI"],
  authors: [{ name: "InvoiceFlow" }],
  openGraph: {
    title: "InvoiceFlow — Fatture professionali in pochi click",
    description:
      "Crea, invia e gestisci fatture professionali. La soluzione SaaS per freelancer e PMI italiane.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={plusJakarta.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
