import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tarea } from "../types/Tarea";

interface TareaDetalleProps {
  tarea: Tarea;
  onEditar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onCambiarEstado?: () => void;
}

export default function TareaDetalle({
  tarea,
  onEditar,
  onEliminar,
  onCambiarEstado,
}: TareaDetalleProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{tarea.titulo}</Text>
      <Text style={styles.descripcion}>{tarea.descripcion}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          <Text style={styles.label}>Prioridad: </Text>
          {tarea.prioridad}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Estado: </Text>
          {tarea.estado}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {onCambiarEstado && (
          <TouchableOpacity
            style={[styles.button, styles.estado]}
            onPress={onCambiarEstado}
          >
            <Text style={styles.buttonText}>Cambiar Estado</Text>
          </TouchableOpacity>
        )}
        {onEditar && (
          <TouchableOpacity
            style={[styles.button, styles.editar]}
            onPress={() => onEditar(tarea.id)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
        {onEliminar && (
          <TouchableOpacity
            style={[styles.button, styles.eliminar]}
            onPress={() => onEliminar(tarea.id)}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  descripcion: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  label: {
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexGrow: 1,
    alignItems: "center",
    marginVertical: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editar: {
    backgroundColor: "#2196F3",
  },
  estado: {
    backgroundColor: "#FF9800",
  },
  eliminar: {
    backgroundColor: "#E53935",
  },
});
