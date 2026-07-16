"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorizzato");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const vatNumber = formData.get("vatNumber") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zip = formData.get("zip") as string;
  const notes = formData.get("notes") as string;

  if (!name) {
    return { error: "Ragione sociale / Nome è obbligatorio" };
  }

  try {
    const client = await prisma.client.create({
      data: {
        name,
        email: email || null,
        vatNumber: vatNumber || null,
        address: address || null,
        city: city || null,
        zip: zip || null,
        notes: notes || null,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Create Client Error:", error);
    return { error: "Errore durante il salvataggio" };
  }

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClient(id: string, prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorizzato");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const vatNumber = formData.get("vatNumber") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const zip = formData.get("zip") as string;
  const notes = formData.get("notes") as string;

  if (!name) {
    return { error: "Ragione sociale / Nome è obbligatorio" };
  }

  try {
    // Verifica che il cliente appartenga all'utente
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return { error: "Cliente non trovato o non autorizzato" };
    }

    await prisma.client.update({
      where: { id },
      data: {
        name,
        email: email || null,
        vatNumber: vatNumber || null,
        address: address || null,
        city: city || null,
        zip: zip || null,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("Update Client Error:", error);
    return { error: "Errore durante l'aggiornamento" };
  }

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect("/clients");
}
