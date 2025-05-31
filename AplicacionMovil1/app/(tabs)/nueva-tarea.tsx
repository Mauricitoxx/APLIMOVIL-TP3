import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { useTareas } from "../../components/TareasContext";
import { Tarea } from "../../types/Tarea";

export default function NuevaTarea() {
    const { agregarTarea } = useTareas();
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("")
    const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>("media");

    const crearTarea = () => {
        if (!titulo.trim()) {
        Alert.alert("Validación", "El título es obligatorio.");
        return;
        }

        const nuevaTarea: Tarea = {
        id: uuidv4(),
        titulo,
        descripcion,
        prioridad,
        estado: "pendiente",
        };

        agregarTarea(nuevaTarea);
        router.back();
    };

    return(
        <View style={styles.container}>
            <center><h2>Crear una nueva tarea</h2></center>
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
            <h3>Seleccione el nivel de prioridad de la tarea: </h3>
            <Picker
                selectedValue={prioridad}
                onValueChange={(value) => setPrioridad(value)}
                style={styles.picker}
            >
                <Picker.Item label="Alta" value="alta" />
                <Picker.Item label="Media" value="media" />
                <Picker.Item label="Baja" value="baja" />
            </Picker>
            <Button title="Crear tarea" onPress={crearTarea} />
        </View>
    )
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