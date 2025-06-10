import React, { useContext, useState, useRef } from "react";
import { View, Text, FlatList, Pressable, Button, StyleSheet, Switch, TouchableOpacity, Modal } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CarpetaContext } from "../../../components/CarpetaContext";
import { useTareas } from "../../../components/TareasContext";
import { Tarea } from "../../../types/Tarea";
import ConfettiCannon from "react-native-confetti-cannon";

export default function CarpetaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const context = useContext(CarpetaContext);
  const { tareas, eliminarTarea, cambioEstado, editarTarea } = useTareas();
  const router = useRouter();

  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tareaIdToDelete, setTareaIdToDelete] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [sadConfettiKey, setSadConfettiKey] = useState(0);
  const [confettiKeys, setConfettiKeys] = useState<number[]>([]);
  const [showSadEffect, setShowSadEffect] = useState(false);
  const confettiTimeouts = useRef<NodeJS.Timeout[]>([]);

  const [filtroEstado, setFiltroEstado] = useState<"todos" | "pendiente" | "completada">("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<"" | "alta" | "media" | "baja">("");

  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarFiltroEstado, setMostrarFiltroEstado] = useState(false);
  const [mostrarFiltroPrioridad, setMostrarFiltroPrioridad] = useState(false);

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
  // Esta lógica podría ser mejor manejada en un useEffect o en el contexto de tareas
  // para evitar ejecuciones repetidas en cada renderizado.
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

  // *** FUNCIÓN MODIFICADA PARA PEDIR CONFIRMACIÓN ***
  const confirmarEliminacion = (tareaId: string) => {
    // Establece el ID de la tarea a eliminar y muestra el modal
    setTareaIdToDelete(tareaId);
    setShowConfirmModal(true);
  };

  // Función que se llama si el usuario confirma la eliminación en el modal
  const handleConfirmDelete = () => {
    if (tareaIdToDelete) {
      eliminarTarea(tareaIdToDelete); // Ahora sí, elimina la tarea
    }
    setShowConfirmModal(false); // Oculta el modal
    setTareaIdToDelete(null); // Limpia el ID de la tarea a eliminar
  };

  // Función que se llama si el usuario cancela la eliminación en el modal
  const handleCancelDelete = () => {
    setShowConfirmModal(false); // Oculta el modal
    setTareaIdToDelete(null); // Limpia el ID de la tarea a eliminar
  };

  // Modifica la función para cambiar el estado de la tarea
  const handleCambioEstado = (id: string) => {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
      if (tarea.estado === "pendiente") {
        // Lanzar confetti feliz
        setConfettiKeys([Date.now()]);
        confettiTimeouts.current.forEach(clearTimeout);
        confettiTimeouts.current = [];
        confettiTimeouts.current.push(
          setTimeout(() => setConfettiKeys(keys => [...keys, Date.now() + 1]), 500)
        );
        confettiTimeouts.current.push(
          setTimeout(() => setConfettiKeys(keys => [...keys, Date.now() + 2]), 1000)
        );
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 2000);
        setShowSadEffect(false);
      } else {
        // Mostrar solo un modal triste, sin confetti
        setShowSadEffect(true);
        setTimeout(() => setShowSadEffect(false), 1800);
        setShowTryAgain(true);
        setTimeout(() => setShowTryAgain(false), 2000);
      }
      cambioEstado(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{carpeta.nombre}</Text>
      <Button
        title="Crear nueva tarea"
        onPress={() => router.push({ pathname: "/nueva-tarea", params: { carpetaId: id } })}
      />

      {/* Botones pequeños para filtros */}
      <View style={{ flexDirection: "row", alignSelf: "flex-end", gap: 8, marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setMostrarFiltroEstado(v => !v)}
          style={{
            paddingVertical: 4,
            paddingHorizontal: 10,
            backgroundColor: "#f2f2f2",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ color: "#555", fontSize: 13 }}>
            {mostrarFiltroEstado ? "▲ Estado" : "▼ Estado"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMostrarFiltroPrioridad(v => !v)}
          style={{
            paddingVertical: 4,
            paddingHorizontal: 10,
            backgroundColor: "#f2f2f2",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ color: "#555", fontSize: 13 }}>
            {mostrarFiltroPrioridad ? "▲ Prioridad" : "▼ Prioridad"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtro por Estado */}
      {mostrarFiltroEstado && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: "bold", marginTop: 4 }}>Filtrar por Estado:</Text>
          <Picker
            selectedValue={filtroEstado}
            onValueChange={(value) => setFiltroEstado(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos" value="todos" />
            <Picker.Item label="Pendiente" value="pendiente" />
            <Picker.Item label="Completada" value="completada" />
          </Picker>
        </View>
      )}

      {/* Filtro por Prioridad */}
      {mostrarFiltroPrioridad && (
        <View style={{ marginBottom: 12 }}>
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
        </View>
      )}

      {/* Lista de tareas */}
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
                const result = await router.push({ pathname: "/editar-tarea/[id]", params: { id: item.id } });
              }}
              accessibilityLabel="Editar tarea"
            >
              <Ionicons name="create-outline" size={25} color="black" />
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
                onValueChange={() => handleCambioEstado(item.id)}
                trackColor={{ false: "#ccc", true: "#4cd137" }}
                thumbColor={item.estado === "completada" ? "#2ecc71" : "#f4f3f4"}
              />
            </View>
            <Pressable
              style={styles.eliminarBtn}
              // *** LLAMADA A LA FUNCIÓN DE CONFIRMACIÓN ***
              onPress={() => confirmarEliminacion(item.id)} 
              accessibilityLabel="Eliminar tarea"
            >
              <Text style={styles.eliminarBtnTexto}>Eliminar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noTasks}>No hay tareas en esta carpeta.</Text>}
      />

      {/* *** MODAL DE CONFIRMACIÓN INTEGRADO *** */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={handleCancelDelete} // Para manejar el botón de retroceso en Android
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

      {/* Confetti effect when completing a task */}
      {confettiKeys.map((key, idx) => (
        <ConfettiCannon
          key={key}
          count={80}
          origin={
            idx === 0
              ? { x: 60, y: -30 }
              : idx === 1
              ? { x: 180, y: -30 }
              : { x: 300, y: -30 }
          }
          fallSpeed={2500}
          explosionSpeed={350}
          fadeOut={true}
          autoStart={true}
          colors={["#2ecc71", "#f9a825", "#d32f2f", "#4cd137"]}
          emojis={["🎉", "✨", "🔥", "🥳", "🎊"]}
        />
      ))}

      {/* Sad effect when uncompleting a task */}
      <Modal
        visible={showSadEffect}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSadEffect(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 32,
            alignItems: "center",
            elevation: 8,
          }}>
            <Text style={{ fontSize: 60, marginBottom: 10 }}>😢</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#607d8b", marginBottom: 8 }}>¡Qué pena!</Text>
            <Text style={{ fontSize: 18, color: "#333" }}>La tarea volvió a pendiente.</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de felicitación */}
      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCongrats(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 32,
            alignItems: "center",
            elevation: 8,
          }}>
            <Text style={{ fontSize: 60, marginBottom: 10 }}>🎉</Text>
            <Text style={{ fontSize: 26, fontWeight: "bold", color: "#2ecc71", marginBottom: 8 }}>¡Felicidades!</Text>
            <Text style={{ fontSize: 18, color: "#333" }}>¡Completaste una tarea!</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de "intenta de nuevo" */}
      <Modal
        visible={showTryAgain}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTryAgain(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 32,
            alignItems: "center",
            elevation: 8,
          }}>
            <Text style={{ fontSize: 60, marginBottom: 10 }}>💧</Text>
            <Text style={{ fontSize: 26, fontWeight: "bold", color: "#607d8b", marginBottom: 8 }}>¡Ups!</Text>
            <Text style={{ fontSize: 18, color: "#333" }}>La tarea volvió a pendiente.</Text>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#a3f7b5", // Verde más fuerte
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

// Estilos para el modal de confirmación (pueden ser parte de styles o separados)
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
