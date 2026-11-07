-- =============================================================================
-- BASE DE DATOS OFICIAL DEL PROYECTO: raiz-digital
-- ADVERTENCIA: Este es el esquema oficial migrado a PostgreSQL para el
-- desarrollo del nuevo frontend/backend en JS. Cualquier cambio en las
-- entidades centrales debe reflejarse y versionarse a partir de este archivo.
-- =============================================================================

-- 1. TIPOS ENUM PERSONALIZADOS
CREATE TYPE rol_usuario_enum AS ENUM ('enfermero', 'familiar', 'admin');
CREATE TYPE estado_actividad_enum AS ENUM ('pendiente', 'confirmado', 'rechazado');
CREATE TYPE nivel_alerta_enum AS ENUM ('ok', 'advertencia', 'critico');
CREATE TYPE estado_receta_enum AS ENUM ('activa', 'suspendida', 'finalizada');

-- 2. TABLA: usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol rol_usuario_enum NOT NULL
);

-- 3. TABLA: familiares
CREATE TABLE familiares (
    id_familiar SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    parentesco VARCHAR(50)
);

-- 4. TABLA: residentes
CREATE TABLE residentes (
    id_residente SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    id_familiar INT REFERENCES familiares(id_familiar) ON DELETE SET NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT,
    habitacion VARCHAR(20),
    condicion_medica TEXT,
    fecha_ingreso DATE
);

-- 5. TABLA: productos (medicamentos e insumos)
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    cantidad_minima INT NOT NULL DEFAULT 1,
    categoria VARCHAR(50),
    fecha_caducidad DATE,
    foto VARCHAR(255)
);

-- 6. TABLA: actividades
CREATE TABLE actividades (
    id_actividad SERIAL PRIMARY KEY,
    id_residente INT REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_enfermero INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    titulo VARCHAR(100),
    descripcion TEXT,
    fecha DATE,
    hora TIME,
    estado estado_actividad_enum DEFAULT 'pendiente'
);

-- 7. TABLA: alertas_reabastecimiento
CREATE TABLE alertas_reabastecimiento (
    id_alerta SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    nivel nivel_alerta_enum NOT NULL,
    fecha_generada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendida BOOLEAN DEFAULT FALSE,
    familiar_enterado BOOLEAN DEFAULT FALSE,
    alerta_activa BOOLEAN DEFAULT TRUE
);

-- 8. TABLA: avisos
CREATE TABLE avisos (
    id_aviso SERIAL PRIMARY KEY,
    id_residente INT REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    titulo VARCHAR(100),
    descripcion TEXT,
    cantidad VARCHAR(50),
    fecha DATE
);

-- 9. TABLA: notas
-- NOTA / ADVERTENCIA: Esta tabla almacena la bitácora médica y observaciones clínicas
-- oficiales del proyecto raiz-digital sobre cada residente.
CREATE TABLE notas (
    id_nota SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    nota TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABLA: recetas_medicas
CREATE TABLE recetas_medicas (
    id_receta SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    doctor VARCHAR(100) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    estado estado_receta_enum DEFAULT 'activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. TABLA: receta_detalle
CREATE TABLE receta_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_receta INT NOT NULL REFERENCES recetas_medicas(id_receta) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE CASCADE,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    duracion VARCHAR(100)
);

-- 12. TABLA: signos_vitales
CREATE TABLE signos_vitales (
    id_signo SERIAL PRIMARY KEY,
    id_residente INT NOT NULL REFERENCES residentes(id_residente) ON DELETE CASCADE,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    presion VARCHAR(20),
    frecuencia_cardiaca INT,
    frecuencia_respiratoria INT,
    temperatura NUMERIC(4, 1),
    saturacion INT,
    glucosa INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

