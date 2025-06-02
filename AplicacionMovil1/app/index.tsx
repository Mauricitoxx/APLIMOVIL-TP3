/* Index representa la Ventana Inicial (Home) */

import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTareas } from "../components/TareasContext";

export default function HomeScreen() {
  const { tareas, eliminarTarea, cambioEstado } = useTareas();
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "completada">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<"" | "alta" | "media" | "baja">("");

  const tareasFiltradas = tareas.filter(t => {
    const coincideEstado = filtroEstado === "todos" || t.estado === filtroEstado;
    const coincidePrioridad = !filtroPrioridad || t.prioridad === filtroPrioridad;
    return coincideEstado && coincidePrioridad;
  });


  /*No lo toma eliminarTarea, directamente el boton no funciona */  
  const confirmarEliminacion = (id: string) => {
    Alert.alert(
      "¿Eliminar tarea?",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminarTarea(id) },
      ]
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <Text style={styles.title}>Mis Tareas</Text>

        <Link href="/nueva-tarea" asChild>
          <Pressable style={styles.botonNuevaTarea} accessibilityLabel="Crear nueva tarea">
            <Text style={styles.botonTexto}>+ Nueva tarea</Text>
          </Pressable>
        </Link>

        
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Filtrar por Estado:</Text>
        <Picker
          selectedValue={filtroEstado}
          onValueChange={(value) => setFiltroEstado(value)}
          style={{ backgroundColor: "#f0f0f0", marginBottom: 10, padding: 5, borderRadius: 8 }}
        >
          <Picker.Item label="Todos" value="todos" />
          <Picker.Item label="Pendiente" value="pendiente" />
          <Picker.Item label="Completada" value="completada" />
        </Picker>

        <Text style={{ fontWeight: "bold" }}>Filtrar por Prioridad:</Text>
        <Picker
          selectedValue={filtroPrioridad}
          onValueChange={(value) => setFiltroPrioridad(value)}
          style={{ backgroundColor: "#f0f0f0", marginBottom: 10, padding: 5, borderRadius: 8 }}
        >
          <Picker.Item label="Todas" value="" />
          <Picker.Item label="Alta" value="alta" />
          <Picker.Item label="Media" value="media" />
          <Picker.Item label="Baja" value="baja" />
        </Picker>

        {tareas.length === 0 ? (
          <Text style={styles.noTasks}>No hay tareas aún.</Text>
        ) : (
          <FlatList
            data={tareasFiltradas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                
                <Link href={{ pathname: "/editar-tarea/[id]", params: { id: item.id }}}>
                  <Pressable style={styles.icon}>
                    <Feather name="edit" size={20} color="#007BFF" />
                  </Pressable>
                </Link>
                
                <Text style={styles.titulo}>{item.titulo}</Text>

                <Text style={styles.descripcion} numberOfLines={1} ellipsizeMode="tail">{item.descripcion}</Text>
                
                <Text style={[styles.etiqueta, styles[`prioridad_${item.prioridad}`]]}>
                  Prioridad: {item.prioridad}
                </Text>

                <View style={styles.estadoContainer}>
                  <Text style={[styles.etiqueta, styles[`estado_${item.estado}`]]}>Estado: {item.estado}</Text>
                  <Switch
                    value={item.estado === "completada"}
                    onValueChange={() => cambioEstado(item.id)}
                    trackColor={{ false: "#ccc", true: "#4cd137" }}
                    thumbColor={item.estado === "completada" ? "#2ecc71" : "#f4f3f4"}
                  />

                </View>

                <Pressable
                  style={styles.eliminarBtn}
                  onPress={() => eliminarTarea(item.id.toString())}
                >
                  <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
                </Pressable>

              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
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
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    position: "relative",
  },
  estadoContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 5,
  },
  icon: {
    position: "absolute",
    top: 8,
    right: 1,
    padding: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555"
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
  prioridad_:{},
  estado_pendiente: { fontSize:17, color: "#e67e22" }, // naranja
  estado_completada: { fontStyle: "italic", fontSize:17, color: "#3348ff" },

});
