import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CarpetaContext } from '../../components/CarpetaContext';

const AltaCarpeta: React.FC = () => {
  const [nombreCarpeta, setNombreCarpeta] = useState<string>('');
  const context = useContext(CarpetaContext);
  const router = useRouter(); 

  if (!context) {
    return <Text>Error: CarpetaContext no disponible. Asegúrate de envolver tu aplicación con CarpetaProvider.</Text>;
  }

  const { agregarCarpeta } = context;

  const handleGuardarCarpeta = () => {
    if (nombreCarpeta.trim() === '') {
      Alert.alert('Error', 'El nombre de la carpeta no puede estar vacío.');
      return;
    }
    
    agregarCarpeta(nombreCarpeta);
    setNombreCarpeta('');
    Alert.alert('Éxito', `Carpeta "${nombreCarpeta}" creada.`);
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.centeredHeader}>Crear una nueva carpeta</Text>
      
      <TextInput
        placeholder="Nombre de la carpeta"
        value={nombreCarpeta}
        onChangeText={setNombreCarpeta}
        style={styles.input} 
      />
      
      <Pressable style={styles.button} onPress={handleGuardarCarpeta} accessibilityLabel="Guardar Cambios">
        <Text style={styles.textcolor}>Guardar Cambios</Text>
      </Pressable>
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

export default AltaCarpeta;