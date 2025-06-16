import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

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
  isLoadingAuth: boolean;
  authError: string | null;
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
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);


  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const storedUsuarios = await AsyncStorage.getItem(USUARIOS_STORAGE_KEY);
        let parsedUsuarios: Usuario[] = [];
        if (storedUsuarios) {
          parsedUsuarios = JSON.parse(storedUsuarios);
          setUsuarios(parsedUsuarios);
          const maxId = parsedUsuarios.reduce((max, user) => Math.max(max, parseInt(user.id)), 0);
          nextIdRef.current = maxId + 1;
        }
        // Ensure default user exists
        if (!parsedUsuarios.some(u => u.username === "Usuario1" && u.password === "Usuario1")) {
          const defaultUser: Usuario = {
            id: nextIdRef.current.toString(),
            username: "Usuario1",
            password: "Usuario1",
          };
          nextIdRef.current += 1;
          const updatedUsuarios = [...parsedUsuarios, defaultUser];
          setUsuarios(updatedUsuarios);
          await AsyncStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(updatedUsuarios));
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

  const registrarUsuario = (username: string, password: string): boolean => {
    setIsLoadingAuth(true);
    setAuthError(null);
    if (usuarios.some(u => u.username === username)) {
      setAuthError('El nombre de usuario ya existe.');
      setIsLoadingAuth(false);
      return false;
    }
    const nuevoUsuario: Usuario = {
      id: nextIdRef.current.toString(),
      username,
      password,
    };
    nextIdRef.current += 1;
    setUsuarios(prev => [...prev, nuevoUsuario]);
    setUsuarioActual(nuevoUsuario);
    setIsLoadingAuth(false);
    return true;
  };

  const loginUsuario = (username: string, password: string): boolean => {
    setIsLoadingAuth(true);
    setAuthError(null);
    const usuarioBase = usuarios.find(u => u.username === "Usuario1" && u.password === "Usuario1");
    if (!usuarios.length && !usuarioBase) {
      const nuevoUsuario: Usuario = {
        id: nextIdRef.current.toString(),
        username: "Usuario1",
        password: "Usuario1",

    };
    setUsuarios(prev => [...prev, nuevoUsuario]);
      setUsuarioActual(nuevoUsuario);
      setIsLoadingAuth(false);
      return true;
    }
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      setUsuarioActual(user);
      setIsLoadingAuth(false);
      return true;
    }
    setAuthError('Credenciales incorrectas.');
    setIsLoadingAuth(false);
    return false;
  };

  const logoutUsuario = () => {
    setUsuarioActual(null);
    setAuthError(null); 
  };

  if (!isLoaded) {
    return null; 
  }

  return (
    <UsuarioContext.Provider value={{ usuarios, usuarioActual, registrarUsuario, loginUsuario, logoutUsuario, isLoadingAuth, authError }}>
      {children}
    </UsuarioContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un UsuarioProvider');
  }
  return context;
};