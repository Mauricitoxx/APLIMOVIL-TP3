import { Tarea } from '@/types/Tarea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Carpeta } from '../types/Carpeta';
import { UsuarioContext } from './UsuarioContext';

interface CarpetaContextType {
  carpetas: Carpeta[];
  tareas: Tarea[];
  agregarCarpeta: (nombre: string) => void;
  editarCarpeta: (id: string, nombre: string) => void;
  eliminarCarpeta: (id: string) => void;
}

export const CarpetaContext = createContext<CarpetaContextType | undefined>(undefined);

const CARPETAS_STORAGE_KEY = '@carpetas_storage';
const NEXT_CARPETA_ID_KEY = '@next_carpeta_id';

interface CarpetaProviderProps {
  children: ReactNode;
}

export const CarpetaProvider: React.FC<CarpetaProviderProps> = ({ children }) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const nextIdRef = useRef<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const colores_carpeta = ['#FF4B4B', '#4BC6FF', '#4BFF87', '#FFD34B', '#B84BFF'];

  // Obtener usuario actual del contexto
  const usuarioContext = useContext(UsuarioContext);

  useEffect(() => {
    const loadCarpetas = async () => {
      try {
        const storedCarpetas = await AsyncStorage.getItem(CARPETAS_STORAGE_KEY);
        const storedNextId = await AsyncStorage.getItem(NEXT_CARPETA_ID_KEY);

        if (storedCarpetas) {
          setCarpetas(JSON.parse(storedCarpetas));
        }
        if (storedNextId) {
          nextIdRef.current = parseInt(storedNextId, 10);
        }
      } catch (error) {
        console.error("Error al cargar carpetas o el próximo ID de AsyncStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCarpetas();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveCarpetas = async () => {
        try {
          await AsyncStorage.setItem(CARPETAS_STORAGE_KEY, JSON.stringify(carpetas));
          await AsyncStorage.setItem(NEXT_CARPETA_ID_KEY, nextIdRef.current.toString());
          console.log("Carpetas y próximo ID guardados en AsyncStorage.");
        } catch (error) {
          console.error("Error al guardar carpetas o el próximo ID en AsyncStorage:", error);
        }
      };
      saveCarpetas();
    }
  }, [carpetas, isLoaded]);

  const agregarCarpeta = (nombre: string) => {
    if (!usuarioContext?.usuarioActual) {
      alert("Debes iniciar sesión para crear carpetas");
      return;
    }
    const nuevaCarpeta: Carpeta = {
      id: nextIdRef.current.toString(),
      nombre: nombre,
      color: colores_carpeta[Math.floor(Math.random() * colores_carpeta.length)],
      usuarioId: usuarioContext.usuarioActual.id, // Asocia la carpeta al usuario actual
    };
    nextIdRef.current += 1;

    setCarpetas((prevCarpetas) => [...prevCarpetas, nuevaCarpeta]);
    console.log(`Carpeta "${nombre}" agregada con ID: ${nuevaCarpeta.id}. Próximo ID: ${nextIdRef.current}`);
  };

  const editarCarpeta = (id: string, nuevo_nombre: string) => {
    console.log("Editando carpeta:", id, nuevo_nombre);
    setCarpetas(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, nombre: nuevo_nombre }
          : c
      )
    );
  };

  const eliminarCarpeta = (id: string) => {
    console.log("Eliminando carpeta:", id);
    setCarpetas((prev) => {
      const nuevas = prev.filter((carpeta) => carpeta.id !== id);
      console.log("Carpetas sin eliminar:", nuevas);
      return nuevas
    });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <CarpetaContext.Provider value={{ carpetas, tareas, agregarCarpeta, editarCarpeta, eliminarCarpeta }}>
      {children}
    </CarpetaContext.Provider>
  );
};