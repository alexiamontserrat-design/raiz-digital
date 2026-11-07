/**
 * Tipos oficiales de base de datos que reflejan el esquema PostgreSQL en `database/schema.sql`.
 */

// 1. TIPOS ENUM PERSONALIZADOS
export type RolUsuario = "enfermero" | "familiar" | "admin";
export type EstadoActividad = "pendiente" | "confirmado" | "rechazado";
export type NivelAlerta = "ok" | "advertencia" | "critico";
export type EstadoReceta = "activa" | "suspendida" | "finalizada";

// 2. TABLA: usuarios
export interface UsuarioRow {
  id_usuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
}

// 3. TABLA: familiares
export interface FamiliarRow {
  id_familiar: number;
  id_usuario: number;
  nombre: string;
  telefono: string | null;
  parentesco: string | null;
}

// 4. TABLA: residentes
export interface ResidenteRow {
  id_residente: number;
  id_usuario: number | null;
  id_familiar: number | null;
  nombre: string;
  edad: number | null;
  habitacion: string | null;
  condicion_medica: string | null;
  fecha_ingreso: Date | string | null;
}

// 5. TABLA: productos (medicamentos e insumos)
export interface ProductoRow {
  id_producto: number;
  id_residente: number;
  nombre: string;
  cantidad: number;
  cantidad_minima: number;
  categoria: string | null;
  fecha_caducidad: Date | string | null;
  foto: string | null;
}

// 6. TABLA: actividades
export interface ActividadRow {
  id_actividad: number;
  id_residente: number | null;
  id_enfermero: number | null;
  titulo: string | null;
  descripcion: string | null;
  fecha: Date | string | null;
  hora: string | null;
  estado: EstadoActividad;
}

// 7. TABLA: alertas_reabastecimiento
export interface AlertaReabastecimientoRow {
  id_alerta: number;
  id_residente: number;
  id_producto: number;
  mensaje: string;
  nivel: NivelAlerta;
  fecha_generada: Date | string;
  atendida: boolean;
  familiar_enterado: boolean;
  alerta_activa: boolean;
}

// 8. TABLA: avisos
export interface AvisoRow {
  id_aviso: number;
  id_residente: number | null;
  id_usuario: number | null;
  titulo: string | null;
  descripcion: string | null;
  cantidad: string | null;
  fecha: Date | string | null;
}

// 9. TABLA: notas
export interface NotaRow {
  id_nota: number;
  id_residente: number;
  nota: string;
  fecha: Date | string;
}

// 10. TABLA: recetas_medicas
export interface RecetaMedicaRow {
  id_receta: number;
  id_residente: number;
  id_usuario: number;
  doctor: string;
  foto: string;
  fecha: Date | string;
  estado: EstadoReceta;
  created_at: Date | string;
}

// 11. TABLA: receta_detalle
export interface RecetaDetalleRow {
  id_detalle: number;
  id_receta: number;
  id_producto: number;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
}

// 12. TABLA: signos_vitales
export interface SignoVitalRow {
  id_signo: number;
  id_residente: number;
  id_usuario: number;
  presion: string | null;
  frecuencia_cardiaca: number | null;
  frecuencia_respiratoria: number | null;
  temperatura: string | number | null;
  saturacion: number | null;
  glucosa: number | null;
  fecha: Date | string;
}

