import { useCustomColors } from '@/hooks/useCustomColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Carpeta = {
  id: string;
  nombre: string;
  color: string;
};

type Estado = 'pendiente' | 'completada';

type Tarea = {
  id: string;
  titulo: string;
  estado: Estado;
  carpetaId: string;
};

type Props = {
  carpeta: Carpeta;
  tareas: Tarea[];
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  onPress: (id: string) => void;
};

const CarpetaCard: React.FC<Props> = ({ carpeta, tareas, onEditar, onEliminar, onPress }) => {
  const tareasDeCarpeta = tareas.filter(t => t.carpetaId === carpeta.id);
  const total = tareasDeCarpeta.length;
  const realizadas = tareasDeCarpeta.filter(t => t.estado === 'completada').length;
  const colores = useCustomColors();

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colores.borde,
      borderRadius: 12,
      overflow: 'hidden',
      marginVertical: 10,
      backgroundColor: colores.tarjeta,
    },
    headerColor: {
      height: 60,
      width: '100%',
      backgroundColor: carpeta.color,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
    },
    nombre: {
      fontSize: 16,
      fontWeight: '600',
      color: colores.texto,
    },
    buttons: {
      flexDirection: 'row',
      gap: 10,
    },
    icon: {
      marginLeft: 10,
    },
  });

  return (
    <TouchableOpacity onPress={() => onPress(carpeta.id)} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={[styles.headerColor, { backgroundColor: carpeta.color }]} />
        <View style={styles.content}>
          <Text style={styles.nombre}>
            {carpeta.nombre} ({realizadas}/{total})
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => onEditar(carpeta.id)} style={styles.icon}>
              <Ionicons name="create-outline" size={22} color={colores.icono} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onEliminar(carpeta.id)} style={styles.icon}>
              <Ionicons name="trash-outline" size={22} color={colores.icono} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CarpetaCard;


