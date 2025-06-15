import { useCustomColors } from "@/hooks/useCustomColors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TareaDetalleC from "../../components/TareaDetalleC";
import { useTareas } from "../../components/TareasContext";

export default function TareaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tareas, eliminarTarea, cambioEstado } = useTareas();
  const colores = useCustomColors();

  const tarea = tareas.find((c) => c.id.toString() === id);

  const [tareaIdToDelete, setTareaIdToDelete] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!tarea) return null;

  const handleEditar = () => {
    router.push({ pathname: "/editar-tarea/[id]", params: { id: tarea.id } });
  };

  const confirmarEliminacion = (tareaId: string) => {
    setTareaIdToDelete(tareaId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (tareaIdToDelete) eliminarTarea(tareaIdToDelete);
    setShowConfirmModal(false);
    setTareaIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setTareaIdToDelete(null);
  };

  const handleCambioEstado = (id: string) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      const nuevoEstado = tarea.estado === "pendiente" ? "completada" : "pendiente";
      cambioEstado(id);
    }
  };

  return (
    <View className="flex-1 bg-gray-100" style={[{ backgroundColor: colores.fondo, flex: 1 }]} >
      <TareaDetalleC
        tarea={tarea}
        onEditar={handleEditar}
        onEliminar={confirmarEliminacion}
        onCambiarEstado={() => handleCambioEstado(tarea.id)}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={handleCancelDelete}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalText}>
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
            </Text>
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonCancel]}
                onPress={handleCancelDelete}
              >
                <Text style={modalStyles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonConfirm]}
                onPress={handleConfirmDelete}
              >
                <Text style={modalStyles.textStyle}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos para el modal
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    flex: 1, // Para que los botones ocupen espacio equitativamente
    marginHorizontal: 5,
  },
  buttonConfirm: {
    backgroundColor: '#FF6347', // Color rojo para confirmar eliminación
  },
  buttonCancel: {
    backgroundColor: '#A9A9A9', // Color gris para cancelar
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
