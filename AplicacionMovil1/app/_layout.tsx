import { TareasProvider } from '@/components/TareasContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return (
      <SafeAreaProvider>
        <TareasProvider>
          <StatusBar style="auto" />
        </TareasProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <TareasProvider>
            <Slot />
            <StatusBar style="auto" />
      </TareasProvider>
    </SafeAreaProvider>
  );
}
