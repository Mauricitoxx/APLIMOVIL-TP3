/* Index representa la Ventana Inicial (Home) */

import { Link, useRouter } from "expo-router";
import { useContext } from "react";
import { Button, FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarpetaContext } from '../../components/CarpetaContext';

export default function HomeScreen() {
  const context = useContext(CarpetaContext);
  const router = useRouter();

  if (!context) {
    return <Text>Error: CarpetaContext no disponible.</Text>;
  }

  const { carpetas } = context;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.header}>Mis Carpetas</Text>
        <FlatList
          data={carpetas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.carpetaItem}
              onPress={() => router.push({ pathname: "/carpeta/[id]", params: { id: item.id } })}
            >
              <Text style={styles.carpetaNombre}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No hay carpetas creadas.</Text>}
        />
        <Button title="Crear nueva carpeta" onPress={() => router.push('/nueva-carpeta')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    gap: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  carpetaItem: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
  },
  carpetaNombre: {
    fontSize: 18,
  },
});
