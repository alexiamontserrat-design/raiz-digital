"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export interface LoginActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  _prevState: LoginActionResult | null,
  formData: FormData,
): Promise<LoginActionResult> {
  const correo = formData.get("correo");
  const contrasena = formData.get("contrasena");

  if (
    typeof correo !== "string" ||
    typeof contrasena !== "string" ||
    !correo.trim() ||
    !contrasena
  ) {
    return {
      success: false,
      error: "Por favor, ingresa tu correo y contraseña.",
    };
  }

  try {
    // Al pasar redirect: false, signIn no invoca next/navigation redirect internamente.
    // Devuelve la URL de redirección en caso de éxito o lanza AuthError en caso de fallo.
    await signIn("credentials", {
      correo: correo.trim(),
      contrasena,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Correo o contraseña incorrectos",
          };
        case "CallbackRouteError":
        default:
          return {
            success: false,
            error:
              "El servicio no está disponible temporalmente. Intenta más tarde",
          };
      }
    }

    // Cualquier otro error imprevisto
    console.error("[loginAction] Error durante el proceso de autenticación:", error);
    return {
      success: false,
      error: "El servicio no está disponible temporalmente. Intenta más tarde",
    };
  }
}

