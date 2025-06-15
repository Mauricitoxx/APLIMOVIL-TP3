import { CarpetaProvider } from '@/components/CarpetaContext';
import { TareasProvider } from '@/components/TareasContext';
import { ThemeProviderCustom, useCustomTheme } from '@/components/TemaContext';
import { DefaultTheme, DarkTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCustomColors } from '@/hooks/useCustomColors';

function InnerApp() {
  const { tema } = useCustomTheme();
  const colores = useCustomColors();
  const theme = tema === 'claro' ? DefaultTheme : DarkTheme;

  return (
    <NavigationThemeProvider value={theme}>
      <View style={[styles.root, { backgroundColor: colores.fondo }]}>
        <Stack screenOptions={{ headerBackTitle: 'Volver', headerBackVisible: true }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ title: 'Inicio', headerShown: false }} />
          <Stack.Screen name="home/index" options={{ title: 'Inicio', headerShown: true }} />
          <Stack.Screen name="nueva-carpeta" options={{ title: 'Crear Nueva Carpeta', headerShown: true }} />
          <Stack.Screen name="editar-carpeta/[id]" options={{ presentation: 'modal', title: 'Editar Carpeta' }} />
          <Stack.Screen name="carpeta/[id]" options={{ title: 'Volver', headerShown: true }} />
          <Stack.Screen name="tarea/[id]" options={{ title: 'Volver', headerShown: true }} />
          <Stack.Screen name="nueva-tarea" options={{ presentation: 'modal', title: 'Crear Nueva Tarea' }} />
          <Stack.Screen name="editar-tarea/[id]" options={{ presentation: 'modal', title: 'Editar Tarea' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={tema === 'oscuro' ? 'light' : 'dark'} />
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

   return (
    <SafeAreaProvider>
      <ThemeProviderCustom>
        <CarpetaProvider>
          <TareasProvider>
            <InnerApp />
          </TareasProvider>
        </CarpetaProvider>
      </ThemeProviderCustom>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
