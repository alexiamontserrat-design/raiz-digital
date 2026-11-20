import type { ReactNode } from "react";
import { requireActiveSession } from "@/lib/session";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Verifica activamente en PostgreSQL que la cuenta sigue activa y que
  // el token_version no fue revocado. Redirige a /login si algo falla.
  await requireActiveSession();

  return (
    <SidebarProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Topbar />
          {children}
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
