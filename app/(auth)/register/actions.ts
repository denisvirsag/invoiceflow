"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";

export async function registerAction(prevState: any, formData: FormData) {
  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const password = formData.get("password") as string;

  if (!firstname || !lastname || !email || !password) {
    return { error: "Compila tutti i campi obbligatori." };
  }

  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Esiste già un account con questa email." };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: `${firstname} ${lastname}`,
        companyName: company || null,
      },
    });

    // Auto login after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Register Error:", error);
    return { error: "Errore durante la registrazione. Riprova più tardi." };
  }
}
