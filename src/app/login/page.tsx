import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-placeholder">
      <div className="login-card">
        <span className="brand-mark" aria-hidden="true">
          ✦
        </span>
        <h1>Iniciar sesión</h1>
        <p>El acceso se habilitará cuando integremos autenticación.</p>

        <label>
          Correo electrónico
          <input type="email" placeholder="tu@raizdigital.mx" disabled />
        </label>

        <label>
          Contraseña
          <input type="password" placeholder="••••••••" disabled />
        </label>

        <button type="button" className="primary-button" disabled>
          Entrar al sistema
        </button>

        <Link href="/">← Volver al dashboard</Link>
      </div>
    </main>
  );
}
