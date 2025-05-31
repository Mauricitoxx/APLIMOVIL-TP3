/* Index representa la Ventana Inicial (Home) */

import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTareas } from "../components/TareasContext";

export default function HomeScreen() {
  const { tareas, eliminarTarea, cambioEstado } = useTareas();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>

      <Link href="/nueva-tarea" asChild>
        <Pressable style={styles.botonNuevaTarea}>
          <Text style={styles.botonTexto}>+ Nueva tarea</Text>
        </Pressable>
      </Link>


      {tareas.length === 0 ? (
        <Text style={styles.noTasks}>No hay tareas aún.</Text>
      ) : (
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => cambioEstado(item.id)}>
                <Text style={[styles.titulo, item.estado === "completada" && styles.completada]}>
                  ✅ {item.titulo}
                </Text>
              </TouchableOpacity>
              <Text style={styles.descripcion}>{item.descripcion}</Text>
              
              <Text style={[styles.etiqueta, styles[`prioridad_${item.prioridad}`]]}>
                Prioridad: {item.prioridad}
              </Text>
              <Text style={[styles.etiqueta, styles[`estado_${item.estado}`]]}>
                Estado: {item.estado}
              </Text>


              <Pressable
                style={styles.eliminarBtn}
                onPress={() => eliminarTarea(item.id)}
              >
                <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
              </Pressable>

            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  botonNuevaTarea: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
  },
  botonTexto: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 25,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  noTasks: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  completada: {
  textDecorationLine: "line-through",
  color: "#888",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5,
    color: "#555",
  },
  link: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
  },
  crearTarea: {
    fontSize: 18,
    color: "blue",
  },
  eliminarBtn: {
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  eliminarBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  etiqueta: {
  fontSize: 14,
  fontWeight: "600",
  marginTop: 4,
  },
  prioridad_alta: { fontSize:17, color: "#d32f2f" }, // rojo
  prioridad_media: { fontSize:17, color: "#f9a825" }, // amarillo
  prioridad_baja: { fontSize:17, color: "#388e3c" }, // verde
  estado_pendiente: { fontStyle: "italic", fontSize:17, color: "#e67e22" }, // naranja
  estado_completada: { textDecorationLine: "line-through", fontSize:17, color: "#888" },

});
