import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

type Estado = 'pendiente' | 'completada';
type Prioridad = "alta" | "media" | "baja" | "";


type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: Estado;
  carpetaId: string;
}

interface Props {
  tarea: Tarea
}

const getColorByPrioridad = (prioridad: string) => {
  switch (prioridad) {
    case 'alta':
      return 'bg-red-200 text-red-800'
    case 'media':
      return 'bg-yellow-200 text-yellow-800'
    case 'baja':
      return 'bg-green-200 text-green-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

export const TareaCard: React.FC<Props> = ({ tarea }) => {
  const navigation = useNavigation<any>()

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl shadow mb-3 flex-row justify-between items-center"
      onPress={() => navigation.navigate('DetalleTareaScreen', { idTarea: tarea.id })}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold">{tarea.titulo}</Text>
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {tarea.descripcion}
        </Text>

        <View className="flex-row gap-2 mt-2">
          <Text className={`text-xs px-2 py-1 rounded-full ${getColorByPrioridad(tarea.prioridad)}`}>
            {tarea.prioridad.toUpperCase()}
          </Text>
          <Text className={`text-xs px-2 py-1 rounded-full ${tarea.estado === 'completada' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {tarea.estado.toUpperCase()}
          </Text>
        </View>
      </View>

      <Feather name="chevron-right" size={20} color="#9ca3af" />
    </TouchableOpacity>
  )
}
