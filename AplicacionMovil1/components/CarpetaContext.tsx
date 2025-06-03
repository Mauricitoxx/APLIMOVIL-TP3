import React, { createContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Carpeta } from '../types/Carpeta'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface CarpetaContextType {
  carpetas: Carpeta[];
  agregarCarpeta: (nombre: string) => void;
}


export const CarpetaContext = createContext<CarpetaContextType | undefined>(undefined);


const CARPETAS_STORAGE_KEY = '@carpetas_storage';
const NEXT_CARPETA_ID_KEY = '@next_carpeta_id';


interface CarpetaProviderProps {
  children: ReactNode;
}

export const CarpetaProvider: React.FC<CarpetaProviderProps> = ({ children }) => {
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);

  const nextIdRef = useRef<number>(1);
  const [isLoaded, setIsLoaded] = useState(false); 


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
    const nuevaCarpeta: Carpeta = {
      id: nextIdRef.current.toString(), 
      nombre: nombre,
    };
    nextIdRef.current += 1; 

    setCarpetas((prevCarpetas) => [...prevCarpetas, nuevaCarpeta]);
    console.log(`Carpeta "${nombre}" agregada con ID: ${nuevaCarpeta.id}. Próximo ID: ${nextIdRef.current}`); 
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <CarpetaContext.Provider value={{ carpetas, agregarCarpeta }}>
      {children}
    </CarpetaContext.Provider>
  );
};