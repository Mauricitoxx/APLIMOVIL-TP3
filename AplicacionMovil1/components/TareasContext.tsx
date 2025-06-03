import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tarea } from "../types/Tarea";

type TareasContextType = {
    tareas: Tarea[];
    agregarTarea: (t: Tarea) => void;
    eliminarTarea: (id: string, carpetaId?: string) => void;
    cambioEstado: (id: string) => void;
    editarTarea: (id: string, t: Tarea, carpetaId?: string) => void;
};

const TareasContext = createContext<TareasContextType | null>(null);
export const TareasProvider = ({ children }: any) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [ultimoId, setUltimoId] = useState<number>(0);

  useEffect(() => {
    AsyncStorage.getItem("tareas").then(data => {
      if (data) {
        const tareasCargadas: Tarea[] = JSON.parse(data);
        setTareas(tareasCargadas);
        // Buscar el id más alto para continuar autoincrementando
        const maxId = tareasCargadas.reduce((max, t) => {
          const n = Number(t.id);
          return !isNaN(n) && n > max ? n : max;
        }, 0);
        setUltimoId(maxId);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = (nuevaTarea: Tarea) => {
    const nuevoId = ultimoId + 1;
    const tareaConId = { ...nuevaTarea, id: String(nuevoId) };
    setUltimoId(nuevoId);
    console.log("Agregando tarea:", tareaConId);
    setTareas((prev) => [...prev, tareaConId]);
  };

  const cambioEstado = (id: string) => {
    console.log("Cambiando estado de tarea:", id);
    setTareas(prev =>
      prev.map(t => 
        t.id === id
          ? { ...t, estado: t.estado === "pendiente" ? "completada" : "pendiente" } as Tarea
          : t
      )
    )
  }

  const editarTarea = (id: string, tareaEditada: Tarea, carpetaId?: string) => {
    console.log("Editando tarea:", id, tareaEditada, "carpetaId:", carpetaId);
    setTareas(prev =>
      prev.map(t =>
        t.id == id && (!carpetaId || t.carpetaId === carpetaId)
          ? { ...t, ...tareaEditada }
          : t
      )
    );
  }

  const eliminarTarea = (id: string, carpetaID?: string) => {
    console.log("Eliminando tarea:", id, "carpetaID:", carpetaID);
    setTareas((prev) => {
      const nuevas = prev.filter((tarea) =>
        tarea.id !== id && (carpetaID ? tarea.carpetaId !== carpetaID : true)
      );
      console.log("Tareas después de eliminar:", nuevas);
      return nuevas;
    });
  };

  return (
    <TareasContext.Provider value={{ tareas, agregarTarea, eliminarTarea, cambioEstado, editarTarea }}>
      {children}
    </TareasContext.Provider>
  );
};

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) throw new Error("useTareas debe usarse dentro de TareasProvider");
  return context;
};
