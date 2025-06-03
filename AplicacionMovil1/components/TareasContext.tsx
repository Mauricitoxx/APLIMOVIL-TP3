import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tarea } from "../types/Tarea";

type TareasContextType = {
    tareas: Tarea[];
    agregarTarea: (t: Tarea) => void;
    eliminarTarea: (id: string) => void;
    cambioEstado: (id: string) => void;
    editarTarea: (id: string, t: Tarea) => void;
};

const TareasContext = createContext<TareasContextType | null>(null);
export const TareasProvider = ({ children }: any) => {
  const [tareas, setTareas] = useState<Tarea[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("tareas").then(data => {
      if (data) setTareas(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = (nuevaTarea: Tarea) => {
    setTareas((prev) => [...prev, nuevaTarea])
  };

  const cambioEstado = (id: string) => {
    setTareas(prev =>
      prev.map(t => 
        t.id === id
          ? { ...t, estado: t.estado === "pendiente" ? "completada" : "pendiente" } as Tarea
          : t
      )
    )
  }

  const editarTarea = (id: string, tareaEditada: Tarea) => {
    setTareas(prev =>
      prev.map(t =>
        t.id == id ? { ...t, ...tareaEditada} : t
      )
    )
  }

  const eliminarTarea = (id: string) => {
    setTareas((prev) => prev.filter((tarea) => tarea.id !== id));
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
