export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

export const design = {
  appName: "Raíz Digital",
  appDescription: "Cuidado organizado, humano y cercano.",
  navigation: [
    { label: "Resumen", href: "/", icon: "⌂" },
    { label: "Residentes", href: "/residentes", icon: "♧" },
    { label: "Salud", href: "/salud", icon: "♡" },
    { label: "Inventario", href: "/inventario", icon: "□" },
    { label: "Actividades", href: "/actividades", icon: "◷" },
  ] satisfies readonly NavigationItem[],
} as const;
