import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
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

