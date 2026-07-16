import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = { title: "Impostazioni" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return redirect("/login");

  async function updateProfile(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) return;
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: formData.get("name") as string,
        companyName: formData.get("companyName") as string,
        vatNumber: formData.get("vatNumber") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        zip: formData.get("zip") as string,
      },
    });

    revalidatePath("/settings");
  }

  return (
    <>
      <div className="page-header animate-fade-in-up">
        <div>
          <h1 className="page-title">Impostazioni Profilo</h1>
          <p className="page-subtitle">Gestisci le informazioni della tua azienda</p>
        </div>
        <Link href="/settings/billing" className="btn btn-outline" id="settings-billing-btn">
          Gestisci Abbonamento
        </Link>
      </div>

      <div className="card animate-fade-in-up" style={{ animationDelay: "0.05s", maxWidth: 800 }}>
        <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Dati Anagrafici</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="name" className="form-label required">Nome Completo</label>
                <input id="name" name="name" type="text" className="form-input" defaultValue={user.name || ""} required />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="email" className="form-label">Email (non modificabile)</label>
                <input id="email" type="email" className="form-input" defaultValue={user.email} disabled />
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: "var(--color-border)" }} />

          <div>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Dati Aziendali</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="companyName" className="form-label">Nome Azienda / Ragione Sociale</label>
                <input id="companyName" name="companyName" type="text" className="form-input" defaultValue={user.companyName || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="vatNumber" className="form-label">Partita IVA / C.F.</label>
                <input id="vatNumber" name="vatNumber" type="text" className="form-input" defaultValue={user.vatNumber || ""} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="address" className="form-label">Indirizzo Sede Legale</label>
                <input id="address" name="address" type="text" className="form-input" defaultValue={user.address || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="form-label">Città</label>
                <input id="city" name="city" type="text" className="form-input" defaultValue={user.city || ""} />
              </div>
              <div className="form-group">
                <label htmlFor="zip" className="form-label">CAP</label>
                <input id="zip" name="zip" type="text" className="form-input" defaultValue={user.zip || ""} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
            <button type="submit" className="btn btn-primary">
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
