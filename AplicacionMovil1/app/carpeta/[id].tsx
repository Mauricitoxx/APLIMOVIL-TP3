import React, { useContext, useState } from "react";
import { View, Text, FlatList, Pressable, Button, StyleSheet, Alert, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CarpetaContext } from "../../components/CarpetaContext";
import { useTareas } from "../../components/TareasContext";
import { Tarea } from "../../types/Tarea";

export default function CarpetaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const context = useContext(CarpetaContext);
  const { tareas, eliminarTarea, cambioEstado, editarTarea } = useTareas();
  const router = useRouter();

  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "completada">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<"" | "alta" | "media" | "baja">("");

  if (!context) {
    return <Text>Error: CarpetaContext no disponible.</Text>;
  }

  const carpeta = context.carpetas.find(c => c.id.toString() === id);

  if (!carpeta) {
    return <Text>Carpeta no encontrada.</Text>;
  }

  // Filtrar tareas por carpetaId y eliminar tareas sin carpetaId
  let tareasCarpeta = tareas.filter(t => t.carpetaId === id);

  // Eliminar tareas que no tengan carpetaId (limpieza)
  if (tareas.some(t => !t.carpetaId)) {
    tareas
      .filter(t => !t.carpetaId)
      .forEach(t => eliminarTarea(t.id));
  }

  // Aplicar filtros
  tareasCarpeta = tareasCarpeta.filter(t => {
    const coincideEstado = filtroEstado === "todos" || t.estado === filtroEstado;
    const coincidePrioridad = !filtroPrioridad || t.prioridad === filtroPrioridad;
    return coincideEstado && coincidePrioridad;
  });

  // Ordenar: primero no completadas, luego completadas; dentro de cada grupo, alta prioridad arriba
  tareasCarpeta = tareasCarpeta.sort((a, b) => {
    if (a.estado !== b.estado) {
      return a.estado === "pendiente" ? -1 : 1;
    }
    const prioridadOrden = { alta: 3, media: 2, baja: 1, "": 0 };
    return prioridadOrden[b.prioridad] - prioridadOrden[a.prioridad];
  });

  const confirmarEliminacion = (tareaId: string, carpetaId?: string) => {
    const carpetaIdFinal = carpetaId || id;
    console.log("Eliminar tarea con id:", tareaId, "de la carpeta:", carpetaIdFinal);
    eliminarTarea(tareaId); // Solo pasa el id, ya que eliminarTarea espera un argumento
  };

  // Nueva función para editar tarea desde aquí
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{carpeta.nombre}</Text>
      <Button
        title="Crear nueva tarea"
        onPress={() => router.push({ pathname: "/nueva-tarea", params: { carpetaId: id } })}
      />

      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Filtrar por Estado:</Text>
      <Picker
        selectedValue={filtroEstado}
        onValueChange={(value) => setFiltroEstado(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todos" value="todos" />
        <Picker.Item label="Pendiente" value="pendiente" />
        <Picker.Item label="Completada" value="completada" />
      </Picker>

      <Text style={{ fontWeight: "bold" }}>Filtrar por Prioridad:</Text>
      <Picker
        selectedValue={filtroPrioridad}
        onValueChange={(value) => setFiltroPrioridad(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todas" value="" />
        <Picker.Item label="Alta" value="alta" />
        <Picker.Item label="Media" value="media" />
        <Picker.Item label="Baja" value="baja" />
      </Picker>

      <FlatList
        data={tareasCarpeta}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.estado === "completada" && styles.cardCompletada
            ]}
          >
            <Pressable
              style={styles.editIcon}
              onPress={async () => {
                // Navega a editar-tarea y espera los nuevos datos al volver
                const result = await router.push({ pathname: "/editar-tarea/[id]", params: { id: item.id } });
                // Si tienes lógica para recibir datos editados, puedes actualizar aquí
                // Si no, el contexto debe actualizar automáticamente al volver
              }}
              accessibilityLabel="Editar tarea"
            >
              <Feather name="edit" size={22} color="#007BFF" />
            </Pressable>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={[styles.prioridad, styles[`prioridad_${item.prioridad}`]]}>
              Prioridad: {item.prioridad}
            </Text>
            <View style={styles.estadoRow}>
              <Text style={styles.estado}>
                Estado: {item.estado}
              </Text>
              <Switch
                value={item.estado === "completada"}
                onValueChange={() => cambioEstado(item.id)}
                trackColor={{ false: "#ccc", true: "#4cd137" }}
                thumbColor={item.estado === "completada" ? "#2ecc71" : "#f4f3f4"}
              />
            </View>
            <Pressable
              style={styles.eliminarBtn}
              onPress={() => confirmarEliminacion(item.id, item.carpetaId)}
              accessibilityLabel="Eliminar tarea"
            >
              <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noTasks}>No hay tareas en esta carpeta.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  picker: {
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompletada: {
    backgroundColor: "#d4f8e8",
    borderColor: "#2ecc71",
  },
  editIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#222",
    marginRight: 32, // espacio para el icono
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 2,
    color: "#555",
  },
  prioridad: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  prioridad_alta: { color: "#d32f2f" },
  prioridad_media: { color: "#f9a825" },
  prioridad_baja: { color: "#388e3c" },
  prioridad_: {},
  estadoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 2,
  },
  estado: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#3348ff",
    fontWeight: "bold",
  },
  eliminarBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  eliminarBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  noTasks: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
});
