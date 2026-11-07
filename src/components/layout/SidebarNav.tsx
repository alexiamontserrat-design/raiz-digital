"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { design } from "@/constants";

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav" aria-label="Menú del sistema">
      {design.navigation.map((item) => {
        const active = isRouteActive(pathname, item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={active ? "nav-item active" : "nav-item"}
            aria-current={active ? "page" : undefined}
            title={item.label}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

