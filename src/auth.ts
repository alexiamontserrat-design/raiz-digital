import "server-only";

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  findUserAuthByEmail,
  verifyUserSession,
} from "@/repositories/users.repository";
import type { RolUsuario } from "@/types/database.types";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        correo: { label: "Correo electrónico", type: "email" },
        contrasena: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.correo !== "string" ||
          typeof credentials.contrasena !== "string"
        ) {
          return null;
        }

        const correo = credentials.correo.trim();
        const contrasena = credentials.contrasena;

        if (!correo || !contrasena) {
          return null;
        }

        let usuario;
        try {
          // Busca el usuario en PostgreSQL de forma parametrizada y exclusiva en servidor
          usuario = await findUserAuthByEmail(correo);
        } catch (error) {
          // Fallo de infraestructura (conexión PostgreSQL, timeout, error de red, etc.)
          // Se registra de manera segura en el servidor sin exponer secretos ni contraseñas
          const errCode =
            error && typeof error === "object" && "code" in error
              ? String((error as { code?: unknown }).code)
              : "UNKNOWN";

          console.error(
            `[auth/authorize] Error de infraestructura al consultar PostgreSQL (code: ${errCode}). Verifique la conectividad con la base de datos.`,
          );

          // Se propaga el error para que Auth.js no lo interprete erróneamente como credenciales incorrectas (null)
          throw new Error("DatabaseConnectionError");
        }

        if (!usuario) {
          // Respuesta uniforme: no revelar si el correo existe
          return null;
        }

        // --- Comprobación de estado ANTES de verificar contraseña ---
        // Cuentas pendientes o suspendidas no pueden iniciar sesión,
        // incluso si la contraseña fuera válida.
        if (usuario.estado !== "activo") {
          return null;
        }

        // Cuentas pendientes de activación no tienen contraseña aún
        if (!usuario.contrasena) {
          return null;
        }

        let contrasenaValida = false;
        try {
          // Compara la contraseña en texto plano contra el hash almacenado
          contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena,
          );
        } catch (error) {
          console.error(
            "[auth/authorize] Error interno al verificar hash de contraseña.",
            error instanceof Error ? error.message : "",
          );
          throw new Error("PasswordVerificationError");
        }

        if (!contrasenaValida) {
          // Respuesta uniforme: no revelar si la contraseña falló o el correo existía
          return null;
        }

        // Devuelve exclusivamente los datos de identidad. NUNCA se incluye contrasena
        return {
          id: String(usuario.id_usuario),
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol as RolUsuario,
          tokenVersion: usuario.token_version,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // --- Primer login: propagar datos del usuario al token ---
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre;
        token.correo = user.correo;
        token.rol = user.rol;
        token.tokenVersion = user.tokenVersion;
        return token;
      }

      // --- Revalidación en solicitudes posteriores ---
      // Se consulta PostgreSQL para verificar que la sesión sigue siendo válida:
      // si el usuario fue suspendido o se incrementó token_version, la sesión se invalida.
      try {
        const userId = Number(token.id);
        if (!Number.isFinite(userId) || userId <= 0) return token;

        const verified = await verifyUserSession(userId, token.tokenVersion);

        if (!verified) {
          // Sesión revocada: devolver null para que Auth.js invalide el token
          return null;
        }

        // Propagar cambios de rol si el administrador los modificó
        if (verified.rol !== token.rol) {
          token.rol = verified.rol;
        }
      } catch (error) {
        // Fallo de infraestructura: se deniega el acceso por precaución.
        // La verificación por petición en requireActiveSession/getVerifiedSession
        // es la línea de defensa principal; aquí nunca se conserva una autorización
        // sin verificar.
        console.error(
          "[auth/jwt] PostgreSQL no disponible durante revalidación del token. Acceso denegado.",
          error instanceof Error ? error.message : "",
        );
        return null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.correo = token.correo;
        session.user.rol = token.rol;
        session.user.tokenVersion = token.tokenVersion;
        // contrasena y otros datos sensibles NUNCA se incluyen en la sesión
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
