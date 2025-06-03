import { Tarea } from "@/types/Tarea";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useTareas } from "../../../components/TareasContext";

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
    if (!titulo.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }

    if (!["alta", "media", "baja"].includes(prioridad)) {
      setError("Debes seleccionar una prioridad válida.");
      return;
    }

    setError("");

    editarTarea(id!, {
      ...tarea!,
      titulo,
      descripcion,
      prioridad,
    });

    router.replace("/");
  };

  if (!componenteListo) return null;

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: "bold", alignSelf: "center" }}>Editar Tarea</Text>
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

      <Button title="Guardar Cambios" onPress={handleEditar} />
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
});
