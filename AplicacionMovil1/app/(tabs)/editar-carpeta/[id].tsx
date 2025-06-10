import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CarpetaContext } from '../../../components/CarpetaContext';

export default function EditarCarpeta() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [nombreCarpeta, setNombreCarpeta] = useState<string>('');
    const context = useContext(CarpetaContext);
    const router = useRouter(); 

    if (!context) {
        return <Text>Error: CarpetaContext no disponible. Asegúrate de envolver tu aplicación con CarpetaProvider.</Text>;
    }

    const { carpetas, editarCarpeta } = context;
    const carpeta = carpetas.find(c =>c.id.toString() === id);

    useEffect(() => {
        if (carpeta) {
            setNombreCarpeta(carpeta.nombre); // Carga el nombre actual al abrir
        }
    }, [carpeta]);

    const handleEditarCarpeta = () => {
        if (nombreCarpeta.trim() === '') {
            Alert.alert('Error', 'El nombre de la carpeta no puede estar vacío.');
            return;
        }

        editarCarpeta(id!, nombreCarpeta);
        setNombreCarpeta('');
        Alert.alert('Éxito', `Carpeta "${nombreCarpeta}" editada.`);
        router.back(); 
    };

    return (
        <View style={styles.container}>
        <Text style={styles.centeredHeader}>Editar carpeta</Text>
        
        <TextInput
            placeholder="Nombre de la carpeta"
            value={nombreCarpeta}
            onChangeText={setNombreCarpeta}
            style={styles.input} 
        />
        
        <Button title="Guardar Cambios" onPress={handleEditarCarpeta} />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12, 
  },
  centeredHeader: {
    fontSize: 24, 
    fontWeight: 'bold',
    textAlign: 'center', 
    marginBottom: 10, 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
});
