import { Tarea } from "@/types/Tarea";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTareas } from "../../components/TareasContext";

export default function EditarTarea() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tareas, editarTarea } = useTareas();
  const router = useRouter();

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

  // Asegurarse de que el ID de la tarea y el objeto de la tarea no sean nulos o indefinidos.
  // Esto previene errores de tiempo de ejecución si los parámetros no están disponibles.
  if (!id || !tarea) {
    setError("Error: ID de tarea o datos de tarea no disponibles para edición.");
    return;
  }

  // Llamar a la función editarTarea de tu contexto.
  // Se espera que esta función actualice el estado global de las tareas.
  editarTarea(
    id, // El ID de la tarea a editar (ya validado)
    {
      ...tarea, // Copia los datos existentes de la tarea
      titulo,      // Actualiza el título con el nuevo valor
      descripcion, // Actualiza la descripción con el nuevo valor
      prioridad,   // Actualiza la prioridad con el nuevo valor
      // Asegúrate de que carpetaId siempre sea un string para consistencia.
      // Si tarea.carpetaId es null/undefined, se usará una cadena vacía.
      carpetaId: String(tarea.carpetaId || ""),
    },
    // También pasa el carpetaId como un string para el segundo argumento de editarTarea (si aplica).
    String(tarea.carpetaId || "")
  );

  // *** CAMBIO CRÍTICO AQUÍ ***
  // En lugar de router.replace, que puede causar duplicados o problemas de pila,
  // simplemente volvemos a la pantalla anterior (la carpeta).
  // Como `editarTarea` ya actualizó el contexto, la carpeta se mostrará con los cambios.
  router.back(); 

};


  if (!componenteListo) return null;

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, fontWeight: "bold", alignSelf: "center", margin: 20 }}>Editar Tarea</Text>
      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={[styles.input, { height: 100 }]}
      />
      <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 10, marginBottom: 10 }}>
        Seleccione el nivel de prioridad de la tarea:
      </Text>
      <Picker
        selectedValue={prioridad}
        onValueChange={(value) => setPrioridad(value)}
        style={styles.picker}
      >
        <Picker.Item label="Nivel de Prioridad" value="" />
        <Picker.Item label="Alta" value="alta" />
        <Picker.Item label="Media" value="media" />
        <Picker.Item label="Baja" value="baja" />
      </Picker>

      {error ? (
        <Text style={{ color: "red", fontWeight: "bold", alignSelf: "center"}}>{error}</Text>
      ) : null}

      <Pressable style={styles.button} onPress={handleEditar} accessibilityLabel="Guardar Cambios">
        <Text style={styles.textcolor}>Guardar Cambios</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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