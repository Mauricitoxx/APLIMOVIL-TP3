import { useCustomColors } from "@/hooks/useCustomColors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tarea } from "../types/Tarea";

interface TareaCardProps {
  tarea: Tarea;
  onEditar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onCambioEstado?: (id: string) => void;
}

export const TareaCard = ({ tarea, onEditar, onEliminar, onCambioEstado }: TareaCardProps) => {
  const router = useRouter();
  const colores = useCustomColors();

  const prioridadColor: Record<"alta" | "media" | "baja", string> = {
    alta: "#CB0404",
    media: "#FF9F00",
    baja: "#309898",
  };

  const colorPrioridad = prioridadColor[tarea.prioridad as "alta" | "media" | "baja"];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tarea.estado === "completada" ? "#AEEA94" : colores.tarjeta,
          borderColor: colorPrioridad,
        },
      ]}
    >
      {/* Botón de edición */}
      <Pressable
        onPress={() =>
          onEditar
            ? onEditar(tarea.id)
            : router.push({ pathname: "/editar-tarea/[id]", params: { id: tarea.id } })
        }
        style={styles.editButton}
        accessibilityRole="button"
        accessibilityLabel="Editar tarea"
        accessibilityHint="Abre la pantalla de edición de esta tarea"
        hitSlop={10}
      >
        <Ionicons name="create-outline" size={22} color={colores.texto} />
      </Pressable>

      {/* Título con navegación */}
      <Pressable
        onPress={() => router.push({ pathname: "/tarea/[id]", params: { id: tarea.id } })}
        accessibilityRole="link"
        accessibilityLabel="Ver detalles de la tarea"
      >
        <Text
          style={[
            styles.titulo,
            {
              color: tarea.estado === "completada" ? colores.tarjeta : colores.texto,
              textDecorationLine: "underline",
              opacity: tarea.estado === "completada" ? 0.6 : 1,
            },
          ]}
        >
          {tarea.titulo}
        </Text>
      </Pressable>

      {/* Descripción */}
      <Text
        style={[styles.descripcion, { color: colores.textoSecundario || "#666" }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {tarea.descripcion}
      </Text>

      {/* Prioridad */}
      <Text style={[styles.prioridad, { color: colorPrioridad }]}>
        Prioridad: {tarea.prioridad}
      </Text>

      {/* Estado + ícono */}
      <View style={styles.estadoRow}>
        <Text style={[styles.estado, { color: colores.texto }]}>
          Estado: {tarea.estado}
        </Text>
        <Pressable
          onPress={() => onCambioEstado?.(tarea.id)}
          style={styles.estadoBtn}
          accessibilityRole="button"
          accessibilityLabel="Cambiar estado"
          accessibilityHint="Marca esta tarea como completada o pendiente"
          hitSlop={10}
        >
          <Ionicons
            name={tarea.estado === "completada" ? "checkbox-outline" : "square-outline"}
            size={25}
            color={tarea.estado === "completada" ? "#2ecc71" : "#999"}
          />
        </Pressable>
      </View>

      {/* Botón Eliminar */}
      <Pressable
        style={[styles.eliminarBtn, { backgroundColor: colores.accionEliminar }]}
        onPress={() => onEliminar?.(tarea.id)}
        accessibilityRole="button"
        accessibilityLabel="Eliminar tarea"
        accessibilityHint="Elimina permanentemente esta tarea"
        hitSlop={10}
      >
        <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    paddingRight: 50,
  },
  descripcion: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
  },
  prioridad: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 1,
  },
  estadoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  estado: {
    fontSize: 15,
    fontWeight: "500",
  },
  estadoBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  eliminarBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  eliminarBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
