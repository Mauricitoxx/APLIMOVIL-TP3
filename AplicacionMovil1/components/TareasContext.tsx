import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Tarea } from "../types/Tarea";
import { CarpetaContext } from "./CarpetaContext";
import { UsuarioContext } from "./UsuarioContext";

const TAREAS_STORAGE_KEY = "tareas_app";

type TareasContextType = {
  tareas: Tarea[];
  agregarTarea: (t: Tarea) => void;
  eliminarTarea: (id: string, carpetaId?: string) => void;
  cambioEstado: (id: string) => void;
  editarTarea: (id: string, t: Tarea, carpetaId?: string) => void;
};

export const TareasContext = createContext<TareasContextType | null>(null);

export function TareasProvider({ children }: any) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [ultimoId, setUltimoId] = useState<number>(0);
  const [cargado, setCargado] = useState(false);
  const [tareasInicialesCargadas, setTareasInicialesCargadas] = useState(false);

  const { carpetas } = useContext(CarpetaContext)!;
  const { usuarios } = useContext(UsuarioContext)!;

  // Cargar tareas guardadas en AsyncStorage al iniciar
  useEffect(() => {
    AsyncStorage.getItem(TAREAS_STORAGE_KEY)
      .then(data => {
        if (data) {
          const tareasCargadas: Tarea[] = JSON.parse(data);
          setTareas(tareasCargadas);

          const maxId = tareasCargadas.reduce((max, t) => {
            const n = Number(t.id);
            return !isNaN(n) && n > max ? n : max;
          }, 0);

          setUltimoId(maxId);
        }
      })
      .catch(err => console.log("Error cargando tareas:", err))
      .finally(() => setCargado(true));
  }, []);

  // Guardar tareas en AsyncStorage cada vez que cambien (pero solo después de cargar inicial)
  useEffect(() => {
    if (cargado) {
      AsyncStorage.setItem(TAREAS_STORAGE_KEY, JSON.stringify(tareas)).catch(err =>
        console.log("Error guardando tareas:", err)
      );
    }
  }, [tareas, cargado]);

  // Cargar tareas iniciales solo UNA vez, después de tener carpetas, usuarios y cargado
  useEffect(() => {
    if (!cargado || tareasInicialesCargadas) return;

    const nuevasTareasAcumuladas: Tarea[] = [];
    let nuevoUltimoId = ultimoId;

    try {
      const usuario1 = usuarios.find(
        u => u.username === "Usuario1" && u.password === "Usuario1"
      );
      if (!usuario1) return;

      const usuario1Carpetas = carpetas.filter(
        c =>
          (c.nombre === "Universidad" || c.nombre === "Trabajo") &&
          c.usuarioId === usuario1.id
      );

      usuario1Carpetas.forEach(carpeta => {
        const tareasDeCarpeta = tareas.filter(t => t.carpetaId === carpeta.id);

        if (tareasDeCarpeta.length === 0) {
          const tareasBase: Tarea[] =
            carpeta.nombre === "Universidad"
              ? [
                  {
                    id: "",
                    titulo: "Estudiar para el parcial",
                    descripcion: "Repasar unidades 1 a 3",
                    estado: "pendiente",
                    carpetaId: carpeta.id,
                    prioridad: "alta",
                  },
                  {
                    id: "",
                    titulo: "Entregar TP",
                    descripcion: "Trabajo práctico de matemática discreta",
                    estado: "completada",
                    carpetaId: carpeta.id,
                    prioridad: "media",
                  },
                ]
              : [
                  {
                    id: "",
                    titulo: "Enviar informe semanal",
                    descripcion: "Actualizar avances del sprint",
                    estado: "pendiente",
                    carpetaId: carpeta.id,
                    prioridad: "alta",
                  },
                  {
                    id: "",
                    titulo: "Reunión con equipo",
                    descripcion: "Coordinar con el equipo de diseño",
                    estado: "pendiente",
                    carpetaId: carpeta.id,
                    prioridad: "media",
                  },
                  {
                    id: "",
                    titulo: "Organizar próximas reuniones",
                    descripcion: "Organizar las reuniones para la próxima semana.",
                    estado: "completada",
                    carpetaId: carpeta.id,
                    prioridad: "baja",
                  },
                ];

          tareasBase.forEach(tarea => {
            nuevoUltimoId++;
            nuevasTareasAcumuladas.push({ ...tarea, id: String(nuevoUltimoId) });
          });
        }
      });

      if (nuevasTareasAcumuladas.length > 0) {
        setTareas(prev => [...prev, ...nuevasTareasAcumuladas]);
        setUltimoId(nuevoUltimoId);
      }
      setTareasInicialesCargadas(true);
    } catch (error) {
      console.error("Error cargando tareas iniciales:", error);
    }
  }, [cargado, usuarios, carpetas, tareasInicialesCargadas, tareas, ultimoId]);

  // Funciones para manipular tareas

  const agregarTarea = (nuevaTarea: Tarea) => {
    const yaExiste = tareas.some(
      t =>
        t.titulo.trim().toLowerCase() === nuevaTarea.titulo.trim().toLowerCase() &&
        t.descripcion.trim().toLowerCase() === nuevaTarea.descripcion.trim().toLowerCase() &&
        t.carpetaId === nuevaTarea.carpetaId
    );
    if (yaExiste) {
      throw new Error("Ya existe una tarea con ese título y descripción en esta carpeta.");
    }
    const nuevoId = ultimoId + 1;
    const tareaConId = { ...nuevaTarea, id: String(nuevoId) };
    setUltimoId(nuevoId);
    setTareas(prev => [...prev, tareaConId]);
  };

  const cambioEstado = (id: string) => {
    setTareas(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, estado: t.estado === "pendiente" ? "completada" : "pendiente" }
          : t
      )
    );
  };

  const editarTarea = (id: string, tareaEditada: Tarea, carpetaId?: string) => {
    setTareas(prev =>
      prev.map(t =>
        t.id === id && (!carpetaId || t.carpetaId === carpetaId)
          ? { ...t, ...tareaEditada }
          : t
      )
    );
  };

  const eliminarTarea = (id: string, carpetaID?: string) => {
    setTareas(prev =>
      prev.filter(tarea =>
        carpetaID ? !(tarea.id === id && tarea.carpetaId === carpetaID) : tarea.id !== id
      )
    );
  };

  return (
    <TareasContext.Provider
      value={{ tareas, agregarTarea, eliminarTarea, cambioEstado, editarTarea }}
    >
      {children}
    </TareasContext.Provider>
  );
}

export function useTareas() {
  const context = useContext(TareasContext);
  if (!context) throw new Error("useTareas debe usarse dentro de TareasProvider");
  return context;
}
