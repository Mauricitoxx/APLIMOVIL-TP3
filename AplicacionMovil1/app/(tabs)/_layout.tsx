
import { CarpetaProvider } from '@/components/CarpetaContext';
import { TareasProvider } from '@/components/TareasContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <CarpetaProvider>
        <TareasProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack screenOptions={{headerBackTitle: 'Volver', headerBackVisible: true,}}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
              
              <Stack.Screen
                name='index'
                options={{
                  title: 'Volver',
                  headerShown: false
                }}
              />
              
              <Stack.Screen
                name='home/index'
                options={{
                  title: 'Inicio',
                  headerShown: true
                }}
              />

              <Stack.Screen
                name="nueva-carpeta"
                options={{
                  title: 'Crear Nueva Carpeta',
                  headerShown: true
                }}
              />

              <Stack.Screen
                name='carpeta/[id]'
                options={{
                  title: 'Volver',
                  headerShown: true
                }}
              />

              <Stack.Screen
                name='tarea/[id]'
                options={{
                  title: 'Volver',
                  headerShown: true
                }}
              />

              <Stack.Screen
                name="nueva-tarea"
                options={{
                  presentation: 'modal',
                  title: 'Crear Nueva Tarea'
                }}
              />
             
              <Stack.Screen
                name="editar-tarea/[id]"
                options={{
                  presentation: 'modal', 
                  title: 'Editar Tarea'
                }}
              />

              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </TareasProvider>
      </CarpetaProvider>
    </SafeAreaProvider>
  );
}