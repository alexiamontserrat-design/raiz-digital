-- =============================================================================
-- MIGRACIÓN 001: Usuarios (Estado, Token Version) y Vínculos Familiares N:M
-- Proyecto: Raíz Digital — Residencia Villa Montessori
-- =============================================================================
-- Esta migración:
-- 1. Agrega el tipo enum `estado_usuario_enum` ('pendiente', 'activo', 'suspendido').
-- 2. Agrega a `usuarios`: `estado` con DEFAULT 'pendiente' para cuentas futuras,
--    pero asegurando que las cuentas PREEXISTENTES se inicialicen como 'activo'
--    únicamente cuando la columna se crea por primera vez. En ejecuciones
--    posteriores NO modifica ningún estado existente ni reactiva cuentas.
-- 3. Agrega a `usuarios`: `token_version` (DEFAULT 1), `created_at` y `updated_at`.
-- 4. Modifica `usuarios.contrasena` para admitir NULL (cuentas pendientes de activación).
-- 5. Crea la tabla intermedia `residentes_familiares` (relación muchos a muchos).
-- 6. Migra de forma segura los vínculos existentes desde `residentes.id_familiar`.
--    NO marca automáticamente tutor legal ni contacto de emergencia (ambos FALSE por defecto).
-- 7. CONSERVA las columnas `residentes.id_familiar` y `residentes.id_usuario` intactas.
-- 8. Valida la consistencia de vínculos migrados sin fallar si ya existen vínculos
--    adicionales válidos en la tabla N:M.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Tipo ENUM para estado de usuario
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_usuario_enum') THEN
        CREATE TYPE estado_usuario_enum AS ENUM ('pendiente', 'activo', 'suspendido');
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Ampliación de la tabla `usuarios` (Idempotente y Segura)
-- -----------------------------------------------------------------------------

-- Manejo seguro de la columna `estado`:
-- - Si la columna NO existe: se agrega con DEFAULT 'activo' para que todas las
--   filas preexistentes legítimas queden activas. Acto seguido, se altera el
--   DEFAULT a 'pendiente' para que cualquier fila nueva nazca pendiente.
-- - Si la columna YA existe (segunda ejecución o posterior): el bloque no hace
--   nada, preservando intactos los estados ('pendiente', 'activo', 'suspendido')
--   sin reactivar cuentas indebidamente.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'usuarios' 
          AND column_name = 'estado'
    ) THEN
        -- 1. Crear columna asignando 'activo' a los registros preexistentes
        ALTER TABLE usuarios 
            ADD COLUMN estado estado_usuario_enum NOT NULL DEFAULT 'activo';

        -- 2. Establecer 'pendiente' como el valor predeterminado definitivo para el futuro
        ALTER TABLE usuarios 
            ALTER COLUMN estado SET DEFAULT 'pendiente';
    END IF;
END $$;

-- Versión de token para revocación instantánea de sesiones en Auth.js / JWT
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS token_version INT NOT NULL DEFAULT 1;

-- Fechas de auditoría de creación y actualización
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Permitir contrasena NULL para cuentas que se creen pendientes de activación por invitación
ALTER TABLE usuarios
    ALTER COLUMN contrasena DROP NOT NULL;

-- -----------------------------------------------------------------------------
-- 3. Creación de la tabla intermedia `residentes_familiares` (Relación N:M)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS residentes_familiares (
    id_vinculo SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_familiar INT NOT NULL REFERENCES familiares(id_familiar) ON DELETE CASCADE,
    parentesco VARCHAR(50) NOT NULL,
    es_tutor_legal BOOLEAN NOT NULL DEFAULT FALSE,
    contacto_emergencia BOOLEAN NOT NULL DEFAULT FALSE,
    notas TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_residente_familiar UNIQUE (id_residente, id_familiar)
);

-- Índices de búsqueda para optimizar consultas de expedientes y permisos
CREATE INDEX IF NOT EXISTS idx_rf_residente ON residentes_familiares(id_residente);
CREATE INDEX IF NOT EXISTS idx_rf_familiar ON residentes_familiares(id_familiar);

-- -----------------------------------------------------------------------------
-- 4. Migración de vínculos existentes desde `residentes.id_familiar`
-- -----------------------------------------------------------------------------
-- Copia los vínculos actuales sin alterar las columnas originales de `residentes`.
-- NO asume tutores ni contactos de emergencia (permanecen en FALSE por defecto).
-- ON CONFLICT evita errores y duplicados si ya existen.
INSERT INTO residentes_familiares (
    id_residente,
    id_familiar,
    parentesco,
    es_tutor_legal,
    contacto_emergencia
)
SELECT
    r.id_residente,
    r.id_familiar,
    COALESCE(NULLIF(TRIM(f.parentesco), ''), 'Familiar'),
    FALSE,
    FALSE
FROM residentes r
INNER JOIN familiares f ON r.id_familiar = f.id_familiar
WHERE r.id_familiar IS NOT NULL
ON CONFLICT (id_residente, id_familiar) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5. Comprobación de consistencia (Verificación en tiempo de migración)
-- -----------------------------------------------------------------------------
-- Verifica que cada vínculo original presente en `residentes` (con familiar válido)
-- esté efectivamente registrado en la tabla intermedia `residentes_familiares`.
-- Esta comprobación es precisa: cuenta vínculos faltantes específicos y no falla
-- si en el futuro la tabla intermedia contiene vínculos adicionales válidos.
DO $$
DECLARE
    v_vinculos_faltantes INT;
BEGIN
    SELECT COUNT(*) INTO v_vinculos_faltantes
    FROM residentes r
    INNER JOIN familiares f ON r.id_familiar = f.id_familiar
    WHERE r.id_familiar IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 
          FROM residentes_familiares rf 
          WHERE rf.id_residente = r.id_residente 
            AND rf.id_familiar = r.id_familiar
      );

    IF v_vinculos_faltantes > 0 THEN
        RAISE EXCEPTION 'Discrepancia en migración: existen % vínculos en residentes que no se transfirieron a residentes_familiares',
            v_vinculos_faltantes;
    END IF;

    RAISE NOTICE 'Migración 001 completada exitosamente. Todos los vínculos de residentes están respaldados en residentes_familiares.';
END $$;

COMMIT;
