import { useCustomColors } from '@/hooks/useCustomColors';
import { Tarea } from "@/types/Tarea";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTareas } from "../../../components/TareasContext";

export default function EditarTarea() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tareas, editarTarea } = useTareas();
  const router = useRouter();
  const colores = useCustomColors();

  const tarea = tareas.find(t => t.id.toString() === id);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>("");
  const [componenteListo, setComponenteListo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tarea) {
      Alert.alert("Error", "No se encontró la tarea", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setPrioridad(tarea.prioridad);
      setComponenteListo(true);
    }
  }, [tarea]);

const handleEditar = () => {
  // Validación para asegurar que el título no esté vacío
  if (!titulo.trim()) {
    setError("El título no puede estar vacío.");
    return;
  }

  // Validación para asegurar que la prioridad sea válida
  if (!["alta", "media", "baja"].includes(prioridad)) {
    setError("Debes seleccionar una prioridad válida.");
    return;
  }

  // Limpiar cualquier error previo
  setError("");

  if (!id || !tarea) {
    setError("Error: ID de tarea o datos de tarea no disponibles para edición.");
    return;
  }

 
  editarTarea(
    id, 
    {
      ...tarea, 
      titulo,     
      descripcion, 
      prioridad,   
      carpetaId: String(tarea.carpetaId || ""),
    },
    String(tarea.carpetaId || "")
  );
  router.back(); 

};


  if (!componenteListo) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colores.fondo }}>
      <View style={[styles.container, { backgroundColor: colores.fondo }]}>
        <Text style={{ fontSize: 30, fontWeight: "bold", alignSelf: "center", margin: 20, color: colores.texto }}>Editar Tarea</Text>
        <TextInput
          placeholder="Título"
          placeholderTextColor={colores.textoSecundario || '#aaa'}
          value={titulo}
          onChangeText={setTitulo}
          style={[styles.input, {
                color: colores.texto,
                borderColor: colores.borde || colores.texto,
                backgroundColor: colores.inputFondo || 'transparent',
          }]} 
        />
        <TextInput
          placeholder="Descripción"
          placeholderTextColor={colores.textoSecundario || '#aaa'}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          style={[styles.input, {
                color: colores.texto,
                borderColor: colores.borde || colores.texto,
                backgroundColor: colores.inputFondo || 'transparent',
                height: 100,
          }]} 
        />
        <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 20, color: colores.texto }}>
          Seleccione el nivel de prioridad de la tarea:
        </Text>
        <Picker
          selectedValue={prioridad}
          onValueChange={(value) => setPrioridad(value)}
          style={[styles.picker, { color: colores.texto, backgroundColor: colores.inputFondo }]}
          dropdownIconColor={colores.texto}
        >
          <Picker.Item label="Nivel de Prioridad" value="" />
          <Picker.Item label="Alta" value="alta" />
          <Picker.Item label="Media" value="media" />
          <Picker.Item label="Baja" value="baja" />
        </Picker>

        {error ? (
          <Text style={{ color: "red", fontWeight: "bold", alignSelf: "center"}}>{error}</Text>
        ) : null}

        <Pressable style={[styles.button, { backgroundColor: colores.primario }]} onPress={handleEditar} accessibilityLabel="Guardar Cambios">
          <Text style={styles.textcolor}>Guardar Cambios</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  picker: {
    marginTop: -20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 9,
  },
  button:{
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 20,
    marginTop:10,
  },
  textcolor: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  }
});
