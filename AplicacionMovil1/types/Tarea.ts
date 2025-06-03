export type Prioridad = "alta" | "media" | "baja" | "";
export type Estado = "pendiente" | "completada";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: Estado;
}

export interface CarpetaTareas {
  id: string;
  nombre: string;
  tareas: Tarea[];
}

export interface usuario {
  id: string;
  nombre: string;
  email: string;
  contraseña: string;
  carpetas: CarpetaTareas[];
  tareas: Tarea[];
}