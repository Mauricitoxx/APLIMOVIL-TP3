import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';

export interface Usuario {
  id: string;
  username: string;
  password: string;
}

interface UsuarioContextType {
  usuarios: Usuario[];
  usuarioActual: Usuario | null;
  registrarUsuario: (username: string, password: string) => boolean;
  loginUsuario: (username: string, password: string) => boolean;
  logoutUsuario: () => void;
}

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

const USUARIOS_STORAGE_KEY = '@usuarios_storage';
const USUARIO_ACTUAL_KEY = '@usuario_actual';

interface UsuarioProviderProps {
  children: ReactNode;
}

export const UsuarioProvider: React.FC<UsuarioProviderProps> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const nextIdRef = useRef<number>(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const storedUsuarios = await AsyncStorage.getItem(USUARIOS_STORAGE_KEY);
        if (storedUsuarios) {
          setUsuarios(JSON.parse(storedUsuarios));
        }
        const storedUsuarioActual = await AsyncStorage.getItem(USUARIO_ACTUAL_KEY);
        if (storedUsuarioActual) {
          setUsuarioActual(JSON.parse(storedUsuarioActual));
        }
      } catch (error) {
        console.error("Error al cargar usuarios de AsyncStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveUsuarios = async () => {
        try {
          await AsyncStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
        } catch (error) {
          console.error("Error al guardar usuarios en AsyncStorage:", error);
        }
      };
      saveUsuarios();
    }
  }, [usuarios, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const saveUsuarioActual = async () => {
        try {
          if (usuarioActual) {
            await AsyncStorage.setItem(USUARIO_ACTUAL_KEY, JSON.stringify(usuarioActual));
          } else {
            await AsyncStorage.removeItem(USUARIO_ACTUAL_KEY);
          }
        } catch (error) {
          console.error("Error al guardar usuario actual en AsyncStorage:", error);
        }
      };
      saveUsuarioActual();
    }
  }, [usuarioActual, isLoaded]);

  const registrarUsuario = (username: string, password: string) => {
    if (usuarios.some(u => u.username === username)) return false;
    const nuevoUsuario: Usuario = {
      id: nextIdRef.current.toString(),
      username,
      password,
    };
    nextIdRef.current += 1;
    setUsuarios(prev => [...prev, nuevoUsuario]);
    setUsuarioActual(nuevoUsuario);
    return true;
  };

  const loginUsuario = (username: string, password: string) => {
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      setUsuarioActual(user);
      return true;
    }
    return false;
  };

  const logoutUsuario = () => {
    setUsuarioActual(null);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <UsuarioContext.Provider value={{ usuarios, usuarioActual, registrarUsuario, loginUsuario, logoutUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};