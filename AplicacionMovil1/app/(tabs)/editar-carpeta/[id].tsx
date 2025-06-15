import { useCustomColors } from '@/hooks/useCustomColors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CarpetaContext } from '../../../components/CarpetaContext';

export default function EditarCarpeta() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [nombreCarpeta, setNombreCarpeta] = useState<string>('');
    const context = useContext(CarpetaContext);
    const router = useRouter(); 
    const colores = useCustomColors();

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
        <View style={[styles.container, { backgroundColor: colores.fondo }]}>
          <Text style={[styles.centeredHeader, { color: colores.texto }]}>Editar carpeta</Text>
          
          <TextInput
            placeholder="Nombre de la carpeta"
            placeholderTextColor={colores.textoSecundario || '#aaa'}
            value={nombreCarpeta}
            onChangeText={setNombreCarpeta}
            style={[styles.input, {
              color: colores.texto,
              borderColor: colores.texto,
              backgroundColor: colores.inputFondo || 'transparent',
            }]} 
          />
        
          <Pressable
            style={[styles.button, { backgroundColor: colores.primario }]}
            onPress={handleEditarCarpeta}
            accessibilityLabel="Guardar Cambios"
            accessibilityHint="Guarda los cambios realizados a la carpeta actual"
          >
            <Text style={styles.textcolor}>Guardar Cambios</Text>
          </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
