import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tarea } from "../types/Tarea";

type TareasContextType = {
    tareas: Tarea[];
    agregarTarea: (t: Tarea) => void;
    eliminarTarea: (id: string) => void;
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

  const agregarTarea = (t: Tarea) => setTareas(prev => [...prev, t]);
  const eliminarTarea = (id: string) =>
    setTareas(prev => prev.filter(t => t.id !== id));

  return (
    <TareasContext.Provider value={{ tareas, agregarTarea, eliminarTarea }}>
      {children}
    </TareasContext.Provider>
  );
};

export const useTareas = () => {
  const context = useContext(TareasContext);
  if (!context) throw new Error("Debe estar dentro de TareasProvider");
  return context;
};