import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();

  // Si ya existe una sesión activa, redirige inmediatamente al dashboard
  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="login-placeholder">
      <div className="login-card">
        <div className="login-brand-wrap">
          <Image
            src="/Logo-Raíz-Digital-Layout.svg"
            alt="Raíz Digital"
            width={160}
            height={149}
            priority
            className="login-brand-logo"
          />
        </div>
        <h1>Iniciar sesión</h1>

        <LoginForm />
      </div>
    </main>
  );
}
