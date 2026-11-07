export type NavigationIconKey =
  | "resumen"
  | "residentes"
  | "salud"
  | "inventario"
  | "actividades";

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: NavigationIconKey;
}

export const design = {
  appName: "Raíz Digital",
  appDescription: "Cuidado organizado, humano y cercano.",
  navigation: [
    { label: "Resumen", href: "/", icon: "resumen" },
    { label: "Residentes", href: "/residentes", icon: "residentes" },
    { label: "Salud", href: "/salud", icon: "salud" },
    { label: "Inventario", href: "/inventario", icon: "inventario" },
    { label: "Actividades", href: "/actividades", icon: "actividades" },
  ] satisfies readonly NavigationItem[],
} as const;

