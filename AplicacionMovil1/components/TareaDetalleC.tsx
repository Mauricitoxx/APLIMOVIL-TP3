import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Tarea } from "../types/Tarea";

interface TareaDetalleProps {
  tarea: Tarea;
  onEditar?: (id: string) => void;
  onEliminar?: (id: string) => void;
  onCambiarEstado?: () => void;
}

export default function TareaDetalle({ tarea, onEditar, onEliminar, onCambiarEstado }: TareaDetalleProps) {
  
  return (
    <View style={[
      styles.card, 
      tarea.prioridad === "alta" && styles.cardAlta,
      tarea.prioridad === "media" && styles.cardMedia,
      tarea.prioridad === "baja" && styles.cardBaja,
      tarea.estado === "completada" && styles.cardCompletada,
    ]}>
      <Text style={styles.titulo}>{tarea.titulo}</Text>
      
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
      
      {!!tarea.descripcion && (
        <View style={styles.descripcionContainer}>
          <Text style={styles.descripcion}>{tarea.descripcion}</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        {onEditar && (
          <TouchableOpacity
            style={[styles.button, styles.editar]}
            onPress={() => onEditar(tarea.id)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
        
        {onCambiarEstado && (
          <TouchableOpacity
            style={[styles.button, styles.estado]}
            onPress={onCambiarEstado}
          >
            <Text style={styles.buttonText}>Cambiar Estado</Text>
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
  cardAlta: {
    backgroundColor: "#fc9a9a",
  },
  cardMedia: {
    backgroundColor: "#FCF596",
  },
  cardBaja: {
    backgroundColor: "#CCE0AC",
  },
  cardCompletada: {
    backgroundColor: "#AEEA94",
    borderColor: "#607d8b",
  },
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
    borderWidth: 1
  },
  titulo: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  descripcion: {
    fontSize: 18,
    color: "#555",
    margin: 10,
  },
  descripcionContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#faf2e8",
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginTop:16,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
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
