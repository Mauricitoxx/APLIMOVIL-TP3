import { useState } from "react";
import { View, TextInput, Button} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTareas } from "../components/TareasContext";
import { Tarea } from "../types/Tarea";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";

export default function NuevaTarea() {
    const { agregarTarea } = useTareas();
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("")
    const [prioridad, setPrioridad] = useState<Tarea["prioridad"]>("media");

    const crearTarea = () => {
        agregarTarea({
            id: uuidv4(), /* Genera un id automatico */
            titulo,
            descripcion,
            prioridad,
            estado: "pendiente",
        });
        router.back();
    };

    return(
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Título" onChangeText={setTitulo} />
            <TextInput placeholder="Descripción" onChangeText={setDescripcion} />
            <Picker selectedValue={prioridad} onValueChange={setPrioridad}>
                <Picker.Item label="Alta" value="alta" />
                <Picker.Item label="Media" value="media" />
                <Picker.Item label="Baja" value="baja" />
            </Picker>
            <Button title="Crear" onPress={crearTarea} />
        </View>
    )
}