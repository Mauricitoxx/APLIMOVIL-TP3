import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tarea } from "../types/Tarea";
import { useTareas } from "../components/TareasContext";

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

        // El id será asignado automáticamente en el contexto, pero para TypeScript, puedes poner un valor temporal
        const nuevaTarea: Tarea = {
            id: "", // El contexto lo sobrescribirá con el autoincremental
            titulo,
            descripcion,
            prioridad,
            estado: "pendiente",
            carpetaId: carpetaId ? String(carpetaId) : "", // Asegúrate de que carpetaId sea un string
        };
        console.log("Nueva tarea creada:", nuevaTarea); // Para depuración
        agregarTarea(nuevaTarea);

        // *** CAMBIO CLAVE AQUÍ ***
        // En lugar de router.replace("/"), usamos router.back()
        // Esto cierra la pantalla actual y te lleva a la pantalla anterior en la pila.
        // Dado que agregarTarea ya actualizó el contexto, la pantalla anterior (CarpetaDetalle)
        // se re-renderizará con la nueva tarea visible.
        router.back();
    };

    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: "center", margin: 20}}>Crear una nueva Tarea</Text>
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

            <Button title="Crear tarea" onPress={crearTarea} />
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
});
