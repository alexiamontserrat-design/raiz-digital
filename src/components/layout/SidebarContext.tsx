"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "raiz_sidebar_collapsed";

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

// Suscripción externa a localStorage sin advertencias de cascada de renderizado
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStoredCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getStoredCollapsedServerSnapshot(): boolean {
  return false;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const storedCollapsed = useSyncExternalStore(
    subscribeToStorage,
    getStoredCollapsed,
    getStoredCollapsedServerSnapshot,
  );

  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const isCollapsed = collapsedOverride ?? storedCollapsed;

  // Manejar bloqueo de scroll y tecla Escape cuando el drawer móvil está abierto
  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setCollapsedOverride(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
      window.dispatchEvent(new Event("storage"));
    } catch {
      // Ignorar si localStorage no está disponible
    }
  };

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        openMobile,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe utilizarse dentro de un SidebarProvider");
  }
  return context;
}

