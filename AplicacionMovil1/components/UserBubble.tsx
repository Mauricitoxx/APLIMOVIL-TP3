import { useCustomColors } from '@/hooks/useCustomColors';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CarpetaContext } from './CarpetaContext';
import TemaCambio from './SwitchTema';
import { useTareas } from './TareasContext';
import { useAuth } from './UsuarioContext';

type UserBubbleProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function UserBubble({ theme, toggleTheme }: UserBubbleProps) {
  const { usuarioActual, logoutUsuario } = useAuth();
  const colores = useCustomColors();  
  const { tareas } = useTareas();
  const carpetaContext = useContext(CarpetaContext);
  const carpetasUsuario = carpetaContext?.carpetas || [];
  const carpetasIdsUsuario = new Set(carpetasUsuario.map(c => c.id));

  const [mostrarRealizadas, setMostrarRealizadas] = useState(true);
  const [mostrarNoRealizadas, setMostrarNoRealizadas] = useState(true);
  const [visible, setVisible] = useState(false);  
  
  const router = useRouter();

  if (!usuarioActual) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: colores.texto }}>Cargando o redirigiendo...</Text>
      </View>
    );
  }

  const tareasUsuario = tareas.filter(t => carpetasIdsUsuario.has(t.carpetaId));
  const tareasCompletadas = tareasUsuario.filter(t => t.estado === 'completada');
  const tareasTotales = tareasUsuario.length;

  return (
    <>
      <TouchableOpacity style={[styles.bubble, { backgroundColor: colores.accent }]} onPress={() => setVisible(true)}>
        <View style={[styles.avatarContainer, { backgroundColor: colores.fondoSecundario, borderColor: colores.accent }]}>
          <Text style={[styles.avatarText, { color: colores.textoSecundario }]}>
            {usuarioActual.username[0]?.toUpperCase() || '?'}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={[styles.overlay]}>
          <View style={[styles.drawer, { backgroundColor: colores.fondoUsuario }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={[styles.closeText, { color: colores.texto }]}>×</Text>
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <View style={[styles.avatarLarge, { backgroundColor: colores.accent }]}>
                <Text style={[styles.avatarLargeText, { color: colores.textoSecundario }]}>
                  {usuarioActual.username[0]?.toUpperCase() || '?'}
                </Text>
              </View>
              <Text style={[styles.userName, { color: colores.texto }]}>{usuarioActual.username}</Text>
              <Text style={[styles.userCantidadTotal, { color: colores.textoSecundario }]}>
                Tareas completadas ({tareasCompletadas.length}/{tareasTotales})
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 12 }}>
              <TemaCambio />
            </View>

            {/* Tareas realizadas colapsable */}
            <TouchableOpacity onPress={() => setMostrarRealizadas(v => !v)}>
              <Text style={[styles.sectionTitle, { color: colores.accent }]}>
                {mostrarRealizadas ? '▲' : '▼'} Tareas realizadas
              </Text>
            </TouchableOpacity>
            {mostrarRealizadas && (
              <FlatList
                data={tareasCompletadas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.taskCard, { backgroundColor: colores.fondoSecundario }]}>
                    <Text style={[styles.taskDone, { color: colores.accent }]}>✔ {item.titulo}</Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colores.textoSecundario }]}>No hay tareas completadas.</Text>
                }
              />
            )}

            {/* Tareas no realizadas colapsable */}
            <TouchableOpacity onPress={() => setMostrarNoRealizadas(v => !v)}>
              <Text style={[styles.sectionTitle, { color: colores.accent }]}>
                {mostrarNoRealizadas ? '▲' : '▼'} Tareas no realizadas
              </Text>
            </TouchableOpacity>
            {mostrarNoRealizadas && (
              <FlatList
                data={tareasUsuario.filter(t => t.estado !== 'completada')}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={[styles.taskCard, { backgroundColor: colores.fondoSecundario }]}>
                    <Text style={[styles.taskNotDone, { color: colores.error }]}>✗ {item.titulo}</Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colores.error }]}>No hay tareas pendientes.</Text>
                }
              />
            )}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setTimeout(() => {
                    logoutUsuario();
                    router.replace('/');
                  }, 300);
                }}
                style={{
                  backgroundColor: colores.accionEliminar,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  drawer: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '800',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  userCantidadTotal: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  taskCard: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  taskDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskNotDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 8,
  },
});
