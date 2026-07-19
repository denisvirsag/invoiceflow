"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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

        {/* Desktop Links (hidden on mobile via CSS) */}
        <div className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Link href="#features" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Funzionalità</Link>
          <Link href="#how-it-works" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Come funziona</Link>
          <Link href="#pricing" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>Prezzi</Link>
          <Link href="#faq" className="btn btn-ghost" style={{ fontSize: "var(--text-sm)" }}>FAQ</Link>
          <Link href="/login" className="btn btn-outline btn-sm" id="nav-login-btn">Accedi</Link>
          <Link href="/register" className="btn btn-accent btn-sm" id="nav-register-btn">Inizia gratis</Link>
        </div>

        {/* Mobile Toggle Button (shown only on mobile via CSS) */}
        <button
          className="landing-nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown Menu (shown only on mobile when open via CSS) */}
      <div className={`landing-mobile-menu${isOpen ? " open" : ""}`}>
        <Link href="#features" onClick={() => setIsOpen(false)}>Funzionalità</Link>
        <Link href="#how-it-works" onClick={() => setIsOpen(false)}>Come funziona</Link>
        <Link href="#pricing" onClick={() => setIsOpen(false)}>Prezzi</Link>
        <Link href="#faq" onClick={() => setIsOpen(false)}>FAQ</Link>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-2)", padding: "0 var(--space-4)" }}>
          <Link href="/login" className="btn btn-outline btn-sm" onClick={() => setIsOpen(false)} style={{ width: "100%", justifyContent: "center" }}>Accedi</Link>
          <Link href="/register" className="btn btn-accent btn-sm" onClick={() => setIsOpen(false)} style={{ width: "100%", justifyContent: "center" }}>Inizia gratis</Link>
        </div>
      </div>
    </>
  );
}
