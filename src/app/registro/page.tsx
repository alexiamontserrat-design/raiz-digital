import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RegistroPage() {
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
        <h1>Crear cuenta</h1>
        <p>Alta de cuentas en Raíz Digital</p>

        <div className="info-notice-card" role="region" aria-label="Información de registro">
          <strong>Acceso restringido e institucional</strong>
          <p>
            Por políticas de seguridad y protección de datos clínicos de los residentes
            en Villa Montessori, no existe registro público automático.
          </p>
          <p>
            Las cuentas para personal médico, enfermería, administración y familiares son
            generadas y autorizadas exclusivamente por la dirección de la residencia.
          </p>
          <small>
            Si necesitas acceso o requieres vincularte como familiar responsable, acércate
            con la administración de Villa Montessori para recibir tus credenciales oficiales.
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

