/* Index representa la Ventana Inicial (Home) */

import { Text, View, Button, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useTareas } from "../components/TareasContext";

export default function HomeScreen() {
  const router = useRouter();
  const { tareas } = useTareas();

  return (
    <View style={{ padding: 20 }}>
      <Button title="Nueva Tarea" onPress={() => router.push("/nueva-tarea")} />
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text>{item.titulo}</Text>
            <Text>{item.prioridad}</Text>
            <Text>{item.estado}</Text>
          </View>
        )}
      />
    </View>
  );
}