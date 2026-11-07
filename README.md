# Raíz Digital

Aplicación web fullstack para la administración, atención clínica y seguimiento de residentes en instituciones de cuidado para adultos mayores.

---

## 1. Tecnologías utilizadas

- **Framework fullstack:** Next.js 16.4.5 (App Router y Route Handlers nativos).
- **Lenguaje:** TypeScript 5 (`strict: true`).
- **Interfaz de usuario:** React 19 y Tailwind CSS v4 + variables CSS nativas.
- **Base de datos:** PostgreSQL mediante `pg` (`node-postgres`), utilizando **SQL puro parametrizado** (sin ORM).
- **Calidad de código:** ESLint 9 (`eslint-config-next/core-web-vitals` y `typescript`).

---

## 2. Requisitos para ejecución local

- **Node.js:** v20 LTS o superior.
- **Gestor de paquetes:** `npm`.
- **PostgreSQL (opcional para maquetación UI):** v15+ local.
  - *Nota:* La aplicación está diseñada para funcionar y renderizar su interfaz aun cuando PostgreSQL no esté conectado, mostrando un estado controlado de `"Conexión pendiente"`.

---

## 3. Instalación y comandos disponibles

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Disponible en `http://localhost:3000`.

3. **Validaciones técnicas obligatorias antes de integrar cambios:**
   ```bash
   npm run lint          # Verifica reglas de ESLint
   npx tsc --noEmit      # Verifica tipos de TypeScript sin emitir archivos
   npm run build         # Compila la aplicación para producción con Turbopack
   ```

---

## 4. Organización de carpetas

```text
raiz-digital/
├── database/
│   └── schema.sql                  # Esquema oficial PostgreSQL (4 ENUMs y 11 tablas)
├── src/
│   ├── app/                        # Enrutamiento, Layouts y Route Handlers (Next.js App Router)
│   │   ├── (dashboard)/            # Grupo de rutas operativas (comparten Sidebar, Topbar y Footer)
│   │   │   ├── layout.tsx          # Layout operativo común (.app-shell)
│   │   │   ├── page.tsx            # / — Resumen del día (Dashboard principal)
│   │   │   ├── residentes/page.tsx # /residentes — Gestión de residentes y familiares
│   │   │   ├── salud/page.tsx      # /salud — Signos vitales, notas y recetas médicas
│   │   │   ├── inventario/page.tsx # /inventario — Medicamentos, insumos y alertas de stock
│   │   │   └── actividades/page.tsx# /actividades — Agenda diaria de cuidados
│   │   ├── login/page.tsx          # /login — Acceso al sistema (fuera del layout operativo)
│   │   ├── api/                    # Controladores HTTP (Route Handlers)
│   │   │   ├── dashboard/route.ts  # GET /api/dashboard
│   │   │   └── prueba/route.ts     # GET /api/prueba (healthcheck de base de datos)
│   │   ├── globals.css             # Tokens visuales (:root) y estilos base del sistema
│   │   └── layout.tsx              # RootLayout (HTML, fuentes Inter y Nunito Sans)
│   ├── components/                 # Componentes de interfaz en React
│   │   ├── layout/                 # Sidebar, SidebarNav, Topbar, Footer
│   │   ├── dashboard/              # ResidentSummaryList, ActivityTimeline, QuickLinksGrid
│   │   └── ui/                     # StatCard, Panel, EmptyState
│   ├── config/
│   │   └── db.ts                   # Singleton de Pool (pg) y helper tipado dbQuery<TRow>()
│   ├── constants/                  # Textos en español (es.ts) y menú de navegación (design.ts)
│   ├── lib/                        # Utilidades puras (formatters.ts, db-errors.ts)
│   ├── repositories/               # Consultas SQL puras, parametrizadas y tipadas por entidad
│   ├── services/                   # Lógica de negocio y orquestación de repositorios
│   └── types/                      # Contratos de base de datos (database.types.ts) y DTOs
└── .env.example                    # Plantilla de variables de entorno
```

---

## 5. Rutas principales del sistema

| Ruta | Módulo | Descripción |
| :--- | :--- | :--- |
| `/` | **Resumen** | Indicadores del día, residentes recientes, línea de tiempo y accesos rápidos. |
| `/residentes` | **Residentes** | Padrón de residentes, asignación de habitaciones, familiares y avisos. |
| `/salud` | **Salud** | Signos vitales, bitácora de notas clínicas y recetas médicas. |
| `/inventario` | **Inventario** | Control de medicamentos e insumos por residente y alertas de reabastecimiento. |
| `/actividades` | **Actividades** | Agenda diaria de cuidados y confirmación por personal de enfermería. |
| `/login` | **Acceso** | Pantalla de inicio de sesión independiente del layout principal. |

---

## 6. Arquitectura y responsabilidades por capa

El flujo de datos estandarizado del proyecto es:

**Interfaz (Server o Client Component) → Servicio (`src/services/`) → Repositorio SQL (`src/repositories/`) → PostgreSQL (`src/config/db.ts`)**

1. **Presentación (`src/app/` y `src/components/`):**
   - Preferir **Server Components** por defecto. En páginas de servidor, consumir directamente las funciones de `src/services/` sin hacer peticiones `fetch` internas hacia `/api/*`.
   - Usar `"use client"` únicamente en componentes hoja que requieran hooks de navegador (`useState`, `usePathname`, manejadores de eventos).
2. **Controladores HTTP (`src/app/api/*/route.ts`):**
   - Reciben la solicitud, validan entradas, delegan al servicio y retornan `NextResponse.json` con el código HTTP adecuado (`200`, `400`, `500` o `503`).
   - No deben contener sentencias SQL ni importar `pool` directamente.
3. **Servicios (`src/services/`):**
   - Concentran la lógica de negocio y coordinan uno o varios repositorios.
   - Utilizan `isDatabaseConnectionError()` (`src/lib/db-errors.ts`) para distinguir entre base de datos no conectada (`database: "unavailable"` → HTTP `503`) y errores internos o de programación SQL (`database: "error"` → HTTP `500`).
4. **Repositorios (`src/repositories/`):**
   - Ejecutan exclusivamente consultas SQL puras y parametrizadas (`$1`, `$2`) mediante `dbQuery<TRow>()` de `src/config/db.ts`.
   - Nunca proyectan columnas sensibles innecesarias (como `contrasena` o `condicion_medica` en listados generales).

---

## 7. Configuración de PostgreSQL y esquema oficial

El archivo [`database/schema.sql`](./database/schema.sql) es la fuente de verdad del modelo de datos (4 tipos `ENUM` y 11 tablas: `usuarios`, `familiares`, `residentes`, `productos`, `actividades`, `alertas_reabastecimiento`, `avisos`, `notas`, `recetas_medicas`, `receta_detalle` y `signos_vitales`).

Cuando se desee conectar la base de datos local:

1. Crear la base de datos en PostgreSQL y ejecutar el esquema:
   ```bash
   psql -U postgres -d raiz_digital -f database/schema.sql
   ```
2. Copiar `.env.example` a `.env.local` y configurar la cadena de conexión local:
   ```env
   DATABASE_URL="postgresql://usuario:contrasena@localhost:5432/raiz_digital"
   ```
   *(El archivo `.env.local` está ignorado por Git para proteger tus credenciales).*

---

## 8. Convenciones para desarrollar nuevos módulos

Para trabajar en equipo sin conflictos de integración:

1. **Contratos primero:** Verificar las interfaces de fila en `src/types/database.types.ts` y definir los DTOs del módulo en `src/types/<modulo>.types.ts`.
2. **Consultas SQL aisladas:** Agregar las consultas parametrizadas en `src/repositories/<modulo>.repository.ts`.
3. **Caso de uso en servicio:** Implementar la lógica en `src/services/<modulo>.service.ts`.
4. **Componentes por dominio:** Cuando un módulo requiera componentes propios, crearlos dentro de `src/components/<modulo>/` (por ejemplo, `src/components/residents/` o `src/components/inventory/`), reutilizando los tokens de `:root` en `src/app/globals.css` y las primitivas de `src/components/ui/`.
