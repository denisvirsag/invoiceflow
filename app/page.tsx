import type { Metadata } from "next";
import Link from "next/link";
import { startDemoAction } from "./demo-actions";

export const metadata: Metadata = {
  title: "InvoiceFlow — Fatture professionali in pochi click",
  description: "Crea, invia e gestisci fatture professionali. La soluzione SaaS per freelancer e PMI italiane.",
};

const trustItems = [
  {
    text: "Dati custoditi in modo sicuro",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    text: "Aliquote IVA italiane aggiornate",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    text: "PDF pronto per il commercialista",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    text: "Assistenza in italiano",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  }
];

const features = [
  {
    title: "Wizard in 3 step",
    desc: "Fattura completa in meno di 2 minuti: intestazione, voci, anteprima e invio guidato.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "PDF professionale",
    desc: "Generato all'istante con il tuo logo personalizzato e i dati aziendali, pronto da spedire così com'è.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Dashboard KPI",
    desc: "Fatturato, incassi e scaduti in un grafico e metriche essenziali che si leggono in tre secondi netti.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    title: "Gestione clienti",
    desc: "Anagrafica ordinata con storico di tutte le fatture emesse, P.IVA ed email, tutto in un unico posto.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Invio email",
    desc: "Manda la fattura al cliente via email con un click tramite server sicuri, senza uscire dalla piattaforma.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Calcolo IVA automatico",
    desc: "Aliquote italiane 0%, 4%, 5%, 10%, 22%. Imponibile, imposta e totale sempre corretti in tempo reale.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: "Devo inserire la carta di credito per il piano gratuito?",
    a: "No. Il piano Free si attiva senza alcun metodo di pagamento. Puoi passare a Pro o Business quando vuoi, direttamente dalle impostazioni del tuo account."
  },
  {
    q: "Le fatture generate sono valide dal punto di vista fiscale?",
    a: "Il PDF riporta tutti i dati richiesti: intestazione completa, voci di spesa, aliquote IVA e totali. Ti consigliamo comunque di verificare con il tuo commercialista i requisiti specifici del tuo regime fiscale, inclusa l'eventuale fatturazione elettronica."
  },
  {
    q: "Cosa succede se supero il limite di invii email del mio piano?",
    a: "Non rimarrai mai bloccato. Potrai comunque scaricare il file PDF compilato ed inviarlo autonomamente dalla tua casella di posta elettronica, oppure scegliere di passare a un piano superiore in qualsiasi momento."
  },
  {
    q: "Posso cambiare piano o disdire quando voglio?",
    a: "Certamente. Non ci sono vincoli contrattuali o scadenze nascoste: puoi fare l'upgrade, il downgrade o annullare l'abbonamento mensile direttamente dalle impostazioni del tuo account con un semplice click."
  },
  {
    q: "I miei dati e quelli dei miei clienti sono al sicuro?",
    a: "Sì, tutti i dati sono protetti e custoditi tramite cifratura e misure di sicurezza standard del settore su infrastrutture cloud avanzate. Se hai particolari requisiti di conformità, non esitare a contattarci."
  }
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="landing-nav" role="navigation" aria-label="Navigazione principale" style={{
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)", backgroundColor: "rgba(248, 250, 252, 0.8)", borderBottom: "1px solid var(--color-border)"
      }}>
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
          <Link href="#features" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Funzionalità</Link>
          <Link href="#how-it-works" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Come funziona</Link>
          <Link href="#pricing" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Prezzi</Link>
          <Link href="#faq" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>FAQ</Link>
          <Link href="/login" className="btn btn-outline btn-sm" id="nav-login-btn">Accedi</Link>
          <Link href="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Inizia gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="hero" aria-labelledby="hero-heading" style={{
        padding: "var(--space-20) 0 var(--space-12)", position: "relative", overflow: "hidden"
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse, rgb(37 99 235 / 0.05) 0%, transparent 70%)",
        }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1, padding: "0 var(--space-6)", maxWidth: "950px", margin: "0 auto", textAlign: "center" }}>
          <span
            className="badge badge-sent"
            style={{ margin: "0 auto var(--space-6)", width: "fit-content", display: "inline-flex", fontSize: "var(--text-xs)", fontWeight: 700 }}
          >
            Novità · invio email integrato
          </span>

          <h1 id="hero-heading" style={{
            fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1.15, marginBottom: "var(--space-6)", color: "var(--color-primary)"
          }}>
            Dalla voce alla fattura,<br /><span style={{ color: "var(--color-secondary)" }}>in due minuti netti.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "var(--color-muted-foreground)", maxWidth: "680px", margin: "0 auto var(--space-10)", lineHeight: 1.6
          }}>
            InvoiceFlow calcola l'IVA, genera il PDF e lo manda al cliente. Tu pensi al lavoro, non alla scartoffia.
          </p>

          <div className="landing-hero-cta" style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-btn">
              Inizia gratis — nessuna carta
            </Link>
            <form action={startDemoAction} style={{ display: "inline-block" }}>
              <button type="submit" className="btn btn-outline btn-lg" id="hero-demo-btn" style={{ cursor: "pointer" }}>
                Guarda come funziona
              </button>
            </form>
          </div>

          <p style={{ marginTop: "var(--space-6)", fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)" }}>
            3 fatture gratis al mese · nessuna carta richiesta · disdici quando vuoi
          </p>
        </div>
      </section>

      {/* Fascia di fiducia (Trust Banner) */}
      <section style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "var(--space-6) var(--space-6)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
            {trustItems.map((item, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", justifyContent: "center", color: "var(--color-primary)" }}>
                <span style={{ color: "var(--color-secondary)", display: "flex", alignItems: "center" }}>{item.icon}</span>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-foreground)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" style={{ padding: "var(--space-20) var(--space-6)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
              Tre passaggi, non trenta
            </span>
            <h2 id="how-it-works-heading" style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)" }}>
              Il wizard fa il lavoro noioso al posto tuo.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
            <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-3)" }}>
                01 — Intestazione
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Cliente e dati fiscali</h3>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Inserisci i dati del cliente e i tuoi. Restano salvati, la prossima fattura parte già compilata.
              </p>
            </div>

            <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-3)" }}>
                02 — Voci e IVA
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Voci di spesa</h3>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Aggiungi le voci una per una. Imponibile e IVA si aggiornano da soli a ogni riga.
              </p>
            </div>

            <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--color-secondary)", marginBottom: "var(--space-3)" }}>
                03 — Anteprima e invio
              </div>
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-2)" }}>Controlla e invia</h3>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>
                Guardi l'anteprima del PDF, premi invia. La fattura è già nella casella del cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funzionalità */}
      <section id="features" aria-labelledby="features-heading" style={{ padding: "var(--space-20) var(--space-6)", background: "var(--color-primary-light)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-16)" }}>
            <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
              Tutto quello che serve
            </span>
            <h2 id="features-heading" style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)", marginBottom: "var(--space-3)" }}>
              Senza complicazioni, senza Excel.
            </h2>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-lg)", maxWidth: "600px", margin: "0 auto" }}>
              Sei funzioni pensate per chi fattura da solo, non per un reparto contabilità.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)" }}>
            {features.map((f) => (
              <div key={f.title} className="card feature-card" style={{ padding: "var(--space-6)", border: "1px solid var(--color-border)" }}>
                <div style={{
                  width: 48, height: 48, background: "rgba(37, 99, 235, 0.1)",
                  borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "var(--color-secondary)",
                  marginBottom: "var(--space-4)",
                }} aria-hidden="true">{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>{f.title}</h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" aria-labelledby="dashboard-heading" style={{ padding: "var(--space-20) var(--space-6)", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--space-12)", alignItems: "center" }}>
            {/* Copy side */}
            <div>
              <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
                Sotto controllo
              </span>
              <h2 id="dashboard-heading" style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)", marginBottom: "var(--space-4)" }}>
                Sai sempre chi ti deve pagare, e quanto.
              </h2>
              <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-base)", marginBottom: "var(--space-6)", lineHeight: 1.7 }}>
                Niente più fogli Excel per capire cosa è stato saldato. La dashboard mostra fatturato, incassato e scaduto a colpo d'occhio.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Andamento mensile del fatturato
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fatture scadute evidenziate in automatico
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Solleciti di pagamento con un click (piano Pro)
                </li>
              </ul>
            </div>

            {/* Mock Dashboard Preview side */}
            <div style={{
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-2xl)",
              padding: "var(--space-6)",
              boxShadow: "var(--shadow-lg)",
            }}>
              {/* Header preview */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)" }}>MESE CORRENTE</div>
                  <div style={{ fontSize: "var(--text-lg)", fontWeight: 800, color: "var(--color-foreground)" }}>Riepilogo Attività</div>
                </div>
                <span className="badge badge-paid" style={{ fontSize: "10px" }}>Attivo</span>
              </div>
              
              {/* Fake KPI tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
                <div style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" }}>
                  <div style={{ fontSize: "10px", color: "var(--color-muted-foreground)", fontWeight: 600 }}>Fatturato</div>
                  <div style={{ fontSize: "var(--text-base)", fontWeight: 800, color: "var(--color-primary)" }}>€ 5.250,00</div>
                </div>
                <div style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" }}>
                  <div style={{ fontSize: "10px", color: "var(--color-muted-foreground)", fontWeight: 600 }}>Scaduto</div>
                  <div style={{ fontSize: "var(--text-base)", fontWeight: 800, color: "var(--color-destructive)" }}>€ 350,00</div>
                </div>
              </div>

              {/* Fake Mini Chart */}
              <div style={{ background: "#ffffff", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-muted-foreground)", marginBottom: "var(--space-4)" }}>ANDAMENTO ULTIMI MESI</div>
                <div style={{ height: "100px", display: "flex", alignItems: "flex-end", gap: "var(--space-3)" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ height: "40px", background: "linear-gradient(to top, var(--color-secondary), var(--color-info))", borderRadius: "2px 2px 0 0" }} />
                    <div style={{ fontSize: "8px", textAlign: "center", color: "var(--color-muted-foreground)" }}>GEN</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ height: "65px", background: "linear-gradient(to top, var(--color-secondary), var(--color-info))", borderRadius: "2px 2px 0 0" }} />
                    <div style={{ fontSize: "8px", textAlign: "center", color: "var(--color-muted-foreground)" }}>FEB</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ height: "90px", background: "linear-gradient(to top, var(--color-secondary), var(--color-info))", borderRadius: "2px 2px 0 0" }} />
                    <div style={{ fontSize: "8px", textAlign: "center", color: "var(--color-muted-foreground)" }}>MAR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section id="pricing" aria-labelledby="pricing-heading" style={{ padding: "var(--space-20) var(--space-6)" }}>
        <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-16)" }}>
            <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
              Prezzi trasparenti
            </span>
            <h2 id="pricing-heading" style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)", marginBottom: "var(--space-3)" }}>
              Inizia gratis. Scala quando sei pronto.
            </h2>
            <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-lg)", maxWidth: "600px", margin: "0 auto" }}>
              Nessun costo nascosto, nessun vincolo. Cambi piano o disdici in qualsiasi momento.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "var(--space-6)", alignItems: "stretch" }}>
            {/* Free */}
            <div className="card" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--color-border)", padding: "var(--space-8)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)" }}>Per iniziare</div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-2)" }}>Free</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-6)" }}>
                <span style={{ fontSize: "var(--text-4xl)", fontWeight: 900, color: "var(--color-foreground)" }}>€ 0</span>
                <span style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)" }}>/ mese</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", flex: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fino a 5 fatture al mese
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fino a 3 clienti
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  5 invii email al mese
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Supporto community
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Watermark InvoiceFlow sul PDF
                </li>
              </ul>
              <Link href="/register" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                Inizia gratis
              </Link>
            </div>

            {/* Pro */}
            <div className="card" style={{
              display: "flex", flexDirection: "column", border: "2px solid var(--color-secondary)", padding: "var(--space-8)",
              transform: "scale(1.02)", boxShadow: "var(--shadow-xl)", position: "relative"
            }}>
              <div style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                background: "var(--color-secondary)", color: "white", padding: "var(--space-1) var(--space-4)",
                borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Più scelto
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)" }}>Per freelancer</div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-2)" }}>Pro</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-6)" }}>
                <span style={{ fontSize: "var(--text-4xl)", fontWeight: 900, color: "var(--color-foreground)" }}>€ 9</span>
                <span style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)" }}>/ mese</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", flex: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Fatture e clienti illimitati</strong>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  150 invii email al mese
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Esportazione fiscale (ZIP/CSV)
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Solleciti di pagamento con un click
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Nessun watermark sul PDF
                </li>
              </ul>
              <Link href="/register?plan=pro" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Prova Pro
              </Link>
            </div>

            {/* Business */}
            <div className="card" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--color-border)", padding: "var(--space-8)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-muted-foreground)", marginBottom: "var(--space-2)" }}>Per piccole imprese</div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-2)" }}>Business</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)", marginBottom: "var(--space-6)" }}>
                <span style={{ fontSize: "var(--text-4xl)", fontWeight: 900, color: "var(--color-foreground)" }}>€ 29</span>
                <span style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)" }}>/ mese</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-8)", fontSize: "var(--text-sm)", flex: 1 }}>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <strong>Tutto ciò che è incluso in Pro</strong>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  1000 invii email al mese
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Fatturazione ricorrente
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Mittente email personalizzato
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-accent)" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Assistenza prioritaria H24
                </li>
              </ul>
              <Link href="/register?plan=business" className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                Inizia Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-heading" style={{ padding: "var(--space-20) var(--space-6)", backgroundColor: "var(--color-primary-light)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
            <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
              Domande frequenti
            </span>
            <h2 id="faq-heading" style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: "var(--color-primary)" }}>
              Quello che ci chiedono più spesso.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className="card" style={{ padding: "var(--space-5)", border: "1px solid var(--color-border)" }}>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--color-foreground)" }}>{faq.q}</h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-sm)", lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Finale */}
      <section id="final-cta" aria-labelledby="final-cta-heading" style={{
        padding: "var(--space-24) var(--space-6)", position: "relative", overflow: "hidden", textAlign: "center"
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "800px", height: "400px", pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse, rgb(37 99 235 / 0.04) 0%, transparent 60%)",
        }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ color: "var(--color-secondary)", fontSize: "var(--text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "var(--space-2)" }}>
            Pronto quando lo sei tu
          </span>
          <h2 id="final-cta-heading" style={{ fontSize: "var(--text-4xl)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--color-primary)", marginBottom: "var(--space-4)", lineHeight: 1.2 }}>
            La tua prossima fattura può partire tra due minuti.
          </h2>
          <p style={{ color: "var(--color-muted-foreground)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)", maxWidth: "550px", margin: "0 auto var(--space-8)" }}>
            Nessuna carta richiesta. Nessun contratto. Solo una fattura fatta bene.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg" style={{ display: "inline-flex", marginBottom: "var(--space-4)" }}>
            Inizia gratis — nessuna carta
          </Link>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-muted-foreground)" }}>
            3 fatture gratis al mese · attivazione in 30 secondi
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "var(--color-primary)",
        color: "rgb(255 255 255 / 0.6)",
        padding: "var(--space-12) var(--space-8)",
        textAlign: "center",
        fontSize: "var(--text-sm)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }} role="contentinfo">
        <div style={{ fontWeight: 800, fontSize: "var(--text-xl)", color: "white", marginBottom: "var(--space-4)", letterSpacing: "-0.04em" }}>
          Invoice<span style={{ color: "var(--color-accent)" }}>Flow</span>
        </div>
        <p style={{ display: "flex", justifyContent: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <span>© 2026 InvoiceFlow. Fatto con cura per i professionisti italiani.</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
          <span>Manerbio, Italia</span>
        </p>
      </footer>
    </div>
  );
}
