import type { RolUsuario } from "@/types/database.types";
import { type DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Estructura de usuario devuelta por `authorize` y contenida en la sesión.
   * NUNCA incluye contrasena ni datos sensibles.
   */
  interface User {
    id: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    /** Versión del token para revocación de sesiones. Se propaga al JWT. */
    tokenVersion: number;
  }

  interface Session {
    user: {
      id: string;
      nombre: string;
      correo: string;
      rol: RolUsuario;
      /**
       * Versión del token para detección de revocación de sesión.
       * Solo se usa server-side para verificar contra PostgreSQL.
       * No es un secreto: es un entero de control de acceso.
       */
      tokenVersion: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extensión del payload del JSON Web Token gestionado por Auth.js.
   */
  interface JWT {
    id: string;
    nombre: string;
    correo: string;
    rol: RolUsuario;
    /** Versión del token almacenada en el JWT para detectar revocaciones. */
    tokenVersion: number;
  }
}

