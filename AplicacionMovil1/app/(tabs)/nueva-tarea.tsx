import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTareas } from "../../components/TareasContext";
import { Tarea } from "../../types/Tarea";

export default function NuevaTarea() {
    const { agregarTarea } = useTareas();
    const router = useRouter();
    const { carpetaId } = useLocalSearchParams<{ carpetaId?: string }>();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("")
    const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>("");
    const [error, setError] = useState("");

    const crearTarea = () => {
        if (!titulo.trim()) {
            setError("El título no puede estar vacío.");
            return;
        }

        if (!["alta", "media", "baja"].includes(prioridad)) {
            setError("Debes seleccionar una prioridad válida.");
            return;
        }

        setError("");

        const nuevaTarea: Tarea = {
            id: "",
            titulo,
            descripcion,
            prioridad,
            estado: "pendiente",
            carpetaId: carpetaId ? String(carpetaId) : "",
        };
        try {
            agregarTarea(nuevaTarea);
            router.back();
        } catch (e: any) {
            setError(e.message || "Error al agregar tarea.");
        }
    };

    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: "center"}}>Crear una nueva Tarea</Text>
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
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>Seleccione el nivel de prioridad de la tarea:</Text>
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

            <Pressable style={styles.button} onPress={crearTarea} accessibilityLabel="Guardar Cambios">
                <Text style={styles.textcolor}>Guardar Cambios</Text>
            </Pressable>
        </View>
      </SafeAreaView>
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