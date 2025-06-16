import { Tarea } from '@/types/Tarea';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { useAuth } from './UsuarioContext';

export interface Carpeta {
  id: string;
  nombre: string;
  color: string;
  usuarioId: string; 
}

interface CarpetaContextType {
  carpetas: Carpeta[];
  tareas: Tarea[]; 
  agregarCarpeta: (nombre: string) => void;
  editarCarpeta: (id: string, nombre: string) => void;
  eliminarCarpeta: (id: string) => void;
  borrarCarpetasSinUsuario: () => void;
}

export const CarpetaContext = createContext<CarpetaContextType | undefined>(undefined);

const CARPETAS_STORAGE_KEY = '@carpetas_storage';
const NEXT_CARPETA_ID_KEY = '@next_carpeta_id';

interface CarpetaProviderProps {
  children: ReactNode;
}

export const CarpetaProvider: React.FC<CarpetaProviderProps> = ({ children }) => {
  const [todasLasCarpetas, setTodasLasCarpetas] = useState<Carpeta[]>([]); 
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const nextIdRef = useRef<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const colores_carpeta = ['#FF4B4B', '#4BC6FF', '#4BFF87', '#FFD34B', '#B84BFF'];

  const { usuarioActual } = useAuth(); 
 

  useEffect(() => {
    const loadCarpetas = async () => {
      try {
        const storedCarpetas = await AsyncStorage.getItem(CARPETAS_STORAGE_KEY);
        const storedNextId = await AsyncStorage.getItem(NEXT_CARPETA_ID_KEY);
        let parsedCarpetas : Carpeta[] = []


        if (storedCarpetas) {
          parsedCarpetas = JSON.parse(storedCarpetas);
          setTodasLasCarpetas(parsedCarpetas);
          const maxId = parsedCarpetas.reduce((max, carpeta) => Math.max(max, parseInt(carpeta.id)), 0);
          nextIdRef.current = maxId + 1;
        } else {
            nextIdRef.current = 1;
        }
        
      } catch (error) {
        console.error("Error al cargar carpetas o el próximo ID de AsyncStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCarpetas();
  }, []);

  useEffect(() =>{
    if (!isLoaded || !usuarioActual) return;

    const usuarioCargado = todasLasCarpetas.some(c => c.usuarioId === usuarioActual.id);

    if (usuarioActual.username === "Usuario1" && usuarioActual.password === "Usuario1" && !usuarioCargado){
      const carpetasNuevas = [
        {
          id: nextIdRef.current.toString(),
          nombre : "Universidad",
          color: colores_carpeta[Math.floor(Math.random() * colores_carpeta.length)],
          usuarioId: usuarioActual.id,
        },
        {
          id: (nextIdRef.current + 1).toString(),
          nombre : "Trabajo",
          color: colores_carpeta[Math.floor(Math.random() * colores_carpeta.length)],
          usuarioId: usuarioActual.id,
        },
      ];

      nextIdRef.current += 2;
      setTodasLasCarpetas(prev => [...prev, ...carpetasNuevas]);
    }
  }, [isLoaded, usuarioActual])

  useEffect(() => {
    if (isLoaded) {
      const saveCarpetas = async () => {
        try {
          await AsyncStorage.setItem(CARPETAS_STORAGE_KEY, JSON.stringify(todasLasCarpetas));
          await AsyncStorage.setItem(NEXT_CARPETA_ID_KEY, nextIdRef.current.toString());
        } catch (error) {
          console.error("Error al guardar carpetas o el próximo ID en AsyncStorage:", error);
        }
      };
      saveCarpetas();
    }
  }, [todasLasCarpetas, isLoaded]); 

  const carpetasDelUsuario = React.useMemo(() => {
    if (!usuarioActual) {
      return []; 
    }
    return todasLasCarpetas.filter(carpeta => carpeta.usuarioId === usuarioActual.id);
  }, [todasLasCarpetas, usuarioActual]);



  const agregarCarpeta = (nombre: string) => {
    if (!usuarioActual) { 
      alert("Debes iniciar sesión para crear carpetas");
      return;
    }
    const nuevaCarpeta: Carpeta = {
      id: nextIdRef.current.toString(),
      nombre: nombre,
      color: colores_carpeta[Math.floor(Math.random() * colores_carpeta.length)],
      usuarioId: usuarioActual.id, 
    };
    nextIdRef.current += 1;

    setTodasLasCarpetas((prevCarpetas) => [...prevCarpetas, nuevaCarpeta]);
  };

  const editarCarpeta = (id: string, nuevo_nombre: string) => {

    setTodasLasCarpetas(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, nombre: nuevo_nombre }
          : c
      )
    );
  };

  const eliminarCarpeta = (id: string) => {
    setTodasLasCarpetas((prev) => {
      const nuevas = prev.filter((carpeta) => carpeta.id !== id);
      return nuevas
    });
  };

  // Borra carpetas y sus tareas asociadas que no tienen usuarioId asignado
  const borrarCarpetasSinUsuario = () => {
    setTodasLasCarpetas(prevCarpetas => {
      const carpetasConUsuario = prevCarpetas.filter(c => c.usuarioId && c.usuarioId !== '');
      const idsConUsuario = new Set(carpetasConUsuario.map(c => c.id));
      // Borra tareas asociadas a carpetas sin usuario
      setTareas(prevTareas => prevTareas.filter(t => idsConUsuario.has(t.carpetaId)));
      return carpetasConUsuario;
    });
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <CarpetaContext.Provider value={{
      carpetas: carpetasDelUsuario, 
      tareas, 
      agregarCarpeta,
      editarCarpeta,
      eliminarCarpeta,
      borrarCarpetasSinUsuario // <-- exportar la función
    }}>
      {children}
    </CarpetaContext.Provider>
  );
};