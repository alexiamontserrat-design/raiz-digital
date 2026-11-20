import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RecuperarContrasenaPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="login-placeholder">
      <div className="login-card">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <h1>Recuperar contraseña</h1>
        <p>Restablecimiento de credenciales de acceso</p>

        <div className="info-notice-card" role="region" aria-label="Información de recuperación">
          <strong>Recuperación por correo en desarrollo</strong>
          <p>
            El módulo de recuperación autónoma mediante enlace seguro por correo electrónico
            se encuentra actualmente en proceso de integración.
          </p>
          <p>
            Si olvidaste tu contraseña o perdiste el acceso a tu cuenta, por favor solicita un
            restablecimiento temporal asistido directamente con el equipo administrativo de
            Villa Montessori.
          </p>
          <small>
            Ningún miembro del personal te solicitará jamás tu contraseña por mensaje ni por teléfono.
          </small>
        </div>

        <div className="login-footer-links">
          <Link href="/login" className="login-link-highlight">
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </main>
  );
}

