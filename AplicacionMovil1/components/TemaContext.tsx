import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'claro' | 'oscuro';

const TemaContext = createContext<{
    tema: ThemeType; 
    toggleTheme: () => void;
} | undefined>(undefined);

export const ThemeProviderCustom = ({ children }: { children: React.ReactNode }) => {
  const [tema, setTema] = useState<ThemeType>('claro');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const guardarTema = await AsyncStorage.getItem('appTheme');
        if (guardarTema === 'oscuro' || guardarTema === 'claro') {
          setTema(guardarTema);
        }
      } catch (error) {
        console.warn('Error cargando el tema:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);
    try {
      await AsyncStorage.setItem('appTheme', nuevoTema);
    } catch (error) {
      console.warn('Error guardando el tema:', error);
    }
  };

  const temaObjeto = tema === 'claro' ? DefaultTheme : DarkTheme;

  if (!isLoaded) return null;

  return (
    <TemaContext.Provider value={{ tema, toggleTheme }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(TemaContext);
  if (!context) throw new Error('useCustomTheme debe usarse dentro de ThemeProviderCustom');
  return context;
};