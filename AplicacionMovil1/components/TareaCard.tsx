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

  return (
    <View style={[
        styles.card,
        tarea.prioridad === "alta" && styles.cardAlta,
        tarea.prioridad === "media" && styles.cardMedia,
        tarea.prioridad === "baja" && styles.cardBaja,
        tarea.estado === "completada" && styles.cardCompletada,
      ]}
    >
      <Pressable
        style={styles.editIcon}
        onPress={() =>
          onEditar
            ? onEditar(tarea.id)
            : router.push({ pathname: "/editar-tarea/[id]", params: { id: tarea.id } })
        }
        accessibilityLabel="Editar tarea"
      >
         <Ionicons name="create-outline" size={25} color="black" />
      </Pressable>

      <Pressable
        onPress={() => router.push({ pathname: "/tarea/[id]", params: { id: tarea.id } })}
      >
        <Text style={[styles.titulo, { textDecorationLine: "underline" }]}>
          {tarea.titulo}
        </Text>
      </Pressable>

      <Text style={styles.descripcion} numberOfLines={1} ellipsizeMode="tail">
        {tarea.descripcion}
      </Text>

      <Text style={[styles.prioridad, styles[`prioridad_${tarea.prioridad}`]]}>
        Prioridad: {tarea.prioridad}
      </Text>

      <View style={styles.estadoRow}>
        <Text style={styles.estado}>Estado: {tarea.estado}</Text>
        <Pressable
          onPress={() => onCambioEstado?.(tarea.id)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 4,
          }}
        >
          <Ionicons
            name={tarea.estado === "completada" ? "checkbox-outline" : "square-outline"}
            size={25}
            color={tarea.estado === "completada" ? "#2ecc71" : "#999"}
          />
        </Pressable>
      </View>

      <Pressable
        style={styles.eliminarBtn}
        onPress={() => onEliminar?.(tarea.id)}
        accessibilityLabel="Eliminar tarea"
      >
        <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  cardAlta: {
    borderColor: "#d32f2f", // rojo para prioridad alta
  },
  cardMedia: {
    borderColor: "#f9a825", // amarillo
  },
  cardBaja: {
    borderColor: "#4caf50", // verde
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    borderWidth: 2,
    borderColor: "#607d8b",
  },
  cardCompletada: {
    backgroundColor: "#AEEA94",
    borderColor: "#607d8b",
  },
  editIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  prioridad: {
    fontSize: 14,
    fontWeight: "600",
  },
  prioridad_alta: { color: "#CB0404" },
  prioridad_media: { color: "#FF9F00" },
  prioridad_baja: { color: "#309898" },
  prioridad_: {},
  estadoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 2,
  },
  estado: {
    fontSize: 14,
    fontWeight: "500",
  },
  eliminarBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  eliminarBtnTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
