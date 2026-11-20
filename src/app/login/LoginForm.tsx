"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, type LoginActionResult } from "@/actions/auth.actions";

const initialState: LoginActionResult = {
  success: false,
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} noValidate>
      {state.error ? (
        <div
          role="alert"
          aria-live="polite"
          className="login-error-message"
        >
          {state.error}
        </div>
      ) : null}

      <label>
        Correo electrónico
        <input
          type="email"
          name="correo"
          placeholder="tu@raizdigital.mx"
          required
          autoComplete="email"
          disabled={isPending}
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          name="contrasena"
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={isPending}
        />
      </label>

      <div className="login-forgot-wrap">
        <Link href="/recuperar-contrasena" className="login-link-secondary">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        className="primary-button"
        disabled={isPending}
        aria-busy={isPending}
      >
        {isPending ? "Iniciando sesión..." : "Entrar al sistema"}
      </button>

      <div className="login-footer-links">
        <span className="login-text-muted">¿No tienes cuenta?</span>{" "}
        <Link href="/registro" className="login-link-highlight">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
}
