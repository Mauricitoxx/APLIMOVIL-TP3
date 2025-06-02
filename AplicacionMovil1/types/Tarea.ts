export type Prioridad = "alta" | "media" | "baja" | "";
export type Estado = "pendiente" | "completada";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: Estado;
}