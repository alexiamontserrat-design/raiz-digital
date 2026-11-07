"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Package,
  CalendarCheck2,
  type LucideIcon,
} from "lucide-react";
import { design, type NavigationIconKey } from "@/constants";
import { useSidebar } from "./SidebarContext";

const ICON_MAP: Record<NavigationIconKey, LucideIcon> = {
  resumen: LayoutDashboard,
  residentes: Users,
  salud: HeartPulse,
  inventario: Package,
  actividades: CalendarCheck2,
};

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();

  return (
    <nav className="sidebar-nav" aria-label="Menú del sistema">
      {design.navigation.map((item) => {
        const active = isRouteActive(pathname, item.href);
        const IconComponent = ICON_MAP[item.icon];

        return (
          <Link
            key={item.label}
            href={item.href}
            className={active ? "nav-item active" : "nav-item"}
            aria-current={active ? "page" : undefined}
            title={item.label}
            onClick={closeMobile}
          >
            <span className="nav-icon" aria-hidden="true">
              {IconComponent ? (
                <IconComponent size={22} strokeWidth={2} />
              ) : null}
            </span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}



