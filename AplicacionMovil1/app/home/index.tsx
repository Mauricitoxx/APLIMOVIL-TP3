/* Index representa la Ventana Inicial (Home) */

import CarpetaCard from "@/components/CarpetaCard";
import { useTareas } from "@/components/TareasContext";
import { useCustomColors } from '@/hooks/useCustomColors';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { CarpetaContext } from '../../components/CarpetaContext';

export default function HomeScreen() {
  const context = useContext(CarpetaContext);
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [carpetaIdToDelete, setCarpetaIdToDelete] = useState<string | null>(null);
  const colores = useCustomColors();

  if (!context) {
    return <Text>Error: CarpetaContext no disponible.</Text>;
  }

  const confirmarEliminacionCarpeta = (id: string) => {
    setCarpetaIdToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDeleteCarpeta = () => {
    if (carpetaIdToDelete !== null) {
      eliminarCarpeta(carpetaIdToDelete);
    }
    setShowConfirmModal(false);
    setCarpetaIdToDelete(null);
  };

  const handleCancelDeleteCarpeta = () => {
    setShowConfirmModal(false);
    setCarpetaIdToDelete(null);
  };

  const { carpetas, eliminarCarpeta } = context;
  const { tareas } = useTareas();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 25,
      gap: 12,
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: colores.texto,
    },
    botonCrear: {
      backgroundColor: "#4962f2",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      marginBottom:10,
    },
    textoBotonCrear: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 1,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 10,
      width: '80%',
      elevation: 5,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colores.texto }]}>Mis Carpetas</Text>
        
          <Pressable
            style={styles.botonCrear}
            onPress={() => router.push('/nueva-carpeta')}
          >
            <Text style={styles.textoBotonCrear}>Crear nueva carpeta</Text>
          </Pressable>

        <FlatList
          data={carpetas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CarpetaCard
              carpeta={item}
              tareas={tareas.filter(t => t.carpetaId === item.id)}
              onEditar={(id) => router.push({ pathname: "/editar-carpeta/[id]", params: { id } })}
              onEliminar={(id) => confirmarEliminacionCarpeta(id)}
              onPress={(id) => router.push({ pathname: "/carpeta/[id]", params: { id } })}
            />
          )}
          ListEmptyComponent={<Text>No hay carpetas creadas.</Text>}
        />

        {/* MODAL DE CONFIRMACIÓN */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmModal}
          onRequestClose={handleCancelDeleteCarpeta} // Para manejar el botón de retroceso en Android
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>
                ¿Estás seguro de que deseas eliminar esta carpeta? Esta acción no se puede deshacer.
              </Text>
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                  style={[modalStyles.button, modalStyles.buttonCancel]}
                  onPress={handleCancelDeleteCarpeta}
                >
                  <Text style={modalStyles.textStyle}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modalStyles.button, modalStyles.buttonConfirm]}
                  onPress={handleConfirmDeleteCarpeta}
                >
                  <Text style={modalStyles.textStyle}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}



const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  buttonCancel: {
    backgroundColor: '#A9A9A9',
  },
  buttonConfirm: {
    backgroundColor: '#FF6347',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
