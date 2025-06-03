import { TareasProvider } from '@/components/TareasContext'; 
import { CarpetaProvider } from '../components/CarpetaContext'; 
import { useColorScheme } from '@/hooks/useColorScheme';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <CarpetaProvider> 
      <TareasProvider> 
        <ThemeProvider value={DefaultTheme}> 
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="nueva-carpeta" 
              options={{ 
                title: 'Crear Nueva Carpeta', 
                headerShown: true 
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </TareasProvider>
    </CarpetaProvider>
  );
}