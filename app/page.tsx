import type { Metadata } from "next";
import Link from "next/link";
import { startDemoAction } from "./demo-actions";

export const metadata: Metadata = {
  title: "InvoiceFlow — Fatture professionali in pochi click",
  description: "Crea, invia e gestisci fatture professionali. La soluzione SaaS per freelancer e PMI italiane.",
};

const features = [
  {
    title: "Wizard 3 step",
    desc: "Crea fatture complete in meno di 2 minuti. Intestazione, voci di spesa, anteprima e invio.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "PDF professionale",
    desc: "Ogni fattura viene generata in PDF con il tuo logo e i dati aziendali, pronta da inviare.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: "Dashboard KPI",
    desc: "Tieni sotto controllo fatturato, pagamenti aperti e scaduti con grafici chiari e immediati.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Gestione clienti",
    desc: "Anagrafica clienti con storico fatture, P.IVA, email e tutto il necessario in un posto.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Invio email",
    desc: "Invia fatture direttamente ai tuoi clienti via email con un solo click, senza uscire dalla piattaforma.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Calcolo IVA automatico",
    desc: "Supporto per aliquote 0%, 4%, 5%, 10%, 22%. Imponibile e IVA calcolati in tempo reale.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const plans = [
  {
    name: "Free",
    price: "€ 0",
    period: "/ mese",
    desc: "Per iniziare",
    features: ["Fino a 5 fatture/mese", "Fino a 3 clienti", "5 invii email/mese", "Supporto community", "Watermark InvoiceFlow"],
    cta: "Inizia gratis",
    ctaHref: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "€ 9",
    period: "/ mese",
    desc: "Per freelancer",
    features: ["Fatture e clienti illimitati", "150 invii email/mese", "Esportazione Fiscale (ZIP/CSV)", "Solleciti pagamento click", "Rimozione watermark"],
    cta: "Prova Pro",
    ctaHref: "/register?plan=pro",
    highlight: true,
  },
  {
    name: "Business",
    price: "€ 29",
    period: "/ mese",
    desc: "Per piccole imprese",
    features: ["Tutto del piano Pro", "1000 invii email/mese", "Fatturazione Ricorrente", "Mittente personalizzato", "Assistenza H24 prioritaria"],
    cta: "Inizia Business",
    ctaHref: "/register?plan=business",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Nav */}
      <nav className="landing-nav" role="navigation" aria-label="Navigazione principale">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flex: 1 }}>
          <div style={{
            width: 36, height: 36,
            background: "var(--color-primary)",
            borderRadius: "var(--radius-lg)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }} aria-hidden="true">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--color-primary)", letterSpacing: "-0.04em" }}>
            Invoice<span style={{ color: "var(--color-accent)" }}>Flow</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Link href="#features" className="btn btn-ghost" id="nav-features-link" style={{ fontSize: "var(--text-sm)" }}>Funzionalità</Link>
          <Link href="#pricing"  className="btn btn-ghost" id="nav-pricing-link"  style={{ fontSize: "var(--text-sm)" }}>Prezzi</Link>
          <Link href="/login"    className="btn btn-outline btn-sm" id="nav-login-btn">Accedi</Link>
          <Link href="/register" className="btn btn-accent btn-sm"  id="nav-register-btn">Inizia gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="hero" aria-labelledby="hero-heading">
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "80px", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse, rgb(30 58 95 / 0.07) 0%, transparent 70%)",
        }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1, padding: "0 var(--space-6)", maxWidth: "900px", margin: "0 auto" }}>
          <div
            className="badge badge-sent"
            style={{ margin: "0 auto var(--space-6)", width: "fit-content", display: "flex" }}
          >
            Novità — Invio email integrato
          </div>

          <h1 id="hero-heading" className="landing-hero-headline">
            Fatture <span className="accent">professionali</span>
            <br />in pochi <span className="primary">click</span>
          </h1>

          <p className="landing-hero-sub">
            InvoiceFlow ti aiuta a creare, inviare e gestire fatture senza sprecare tempo.
            Pensato per freelancer e PMI italiane.
          </p>

          <div className="landing-hero-cta">
            <Link href="/register" className="btn btn-accent btn-lg" id="hero-cta-btn">
              Inizia gratis — nessuna carta
            </Link>
            <form action={startDemoAction} style={{ display: "inline-block" }}>
              <button type="submit" className="btn btn-outline btn-lg" id="hero-demo-btn" style={{ cursor: "pointer" }}>
                Guarda la demo
              </button>
            </form>
          </div>

          <p style={{ marginTop: "var(--space-6)", fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)" }}>
            Nessuna carta di credito richiesta · 3 fatture gratis al mese
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" aria-labelledby="features-heading" style={{ padding: "var(--space-24) var(--space-8)", background: "var(--color-muted)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 id="features-heading" style={{ textAlign: "center", marginBottom: "var(--space-4)", fontSize: "var(--text-4xl)", fontWeight: 800, letterSpacing: "-0.05em" }}>
            Tutto quello che ti serve
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", marginBottom: "var(--space-16)", fontSize: "var(--text-lg)" }}>
            Senza complicazioni, senza Excel, senza perdite di tempo.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-5)" }}>
            {features.map((f) => (
              <div key={f.title} className="card feature-card">
                <div style={{
                  width: 56, height: 56, background: "var(--color-primary-light)",
                  borderRadius: "var(--radius-xl)", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "var(--color-primary)",
                  marginBottom: "var(--space-4)",
                }} aria-hidden="true">{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{f.title}</h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" aria-labelledby="pricing-heading" style={{ padding: "var(--space-24) var(--space-8)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 id="pricing-heading" style={{ textAlign: "center", marginBottom: "var(--space-4)", fontSize: "var(--text-4xl)", fontWeight: 800, letterSpacing: "-0.05em" }}>
            Prezzi trasparenti
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-muted-foreground)", marginBottom: "var(--space-16)", fontSize: "var(--text-lg)" }}>
            Inizia gratis. Scala quando sei pronto.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-5)", alignItems: "start" }}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="card"
                style={{
                  border: plan.highlight ? "2px solid var(--color-primary)" : undefined,
                  transform: plan.highlight ? "scale(1.03)" : undefined,
                  boxShadow: plan.highlight ? "var(--shadow-xl)" : undefined,
                  position: "relative",
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "var(--color-primary)", color: "white", padding: "var(--space-1) var(--space-4)",
                    borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                    Più popolare
                  </div>
                )}
                <div style={{ marginBottom: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)" }}>{plan.desc}</div>
                <div style={{ fontWeight: 800, fontSize: "var(--text-xl)", marginBottom: "var(--space-1)" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-6)" }}>
                  <span style={{ fontSize: "var(--text-4xl)", fontWeight: 900, letterSpacing: "-0.05em" }}>{plan.price}</span>
                  <span style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)" }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)" }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--text-sm)" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`btn ${plan.highlight ? "btn-primary" : "btn-outline"}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  id={`pricing-cta-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--color-primary)",
        color: "rgb(255 255 255 / 0.6)",
        padding: "var(--space-12) var(--space-8)",
        textAlign: "center",
        fontSize: "var(--text-sm)",
      }} role="contentinfo">
        <div style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "white", marginBottom: "var(--space-4)", letterSpacing: "-0.04em" }}>
          Invoice<span style={{ color: "var(--color-accent)" }}>Flow</span>
        </div>
        <p>© 2026 InvoiceFlow. Fatto con cura per i professionisti italiani.</p>
      </footer>
    </>
  );
}
