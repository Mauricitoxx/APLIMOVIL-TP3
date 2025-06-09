import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 
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
      
      <Button title="Crear carpeta" onPress={handleGuardarCarpeta} />
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

export default AltaCarpeta;