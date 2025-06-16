import React, { useContext, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TemaCambio from './CambiarTemaC';
import { CarpetaContext } from './CarpetaContext';
import { useTareas } from './TareasContext';
import { useAuth } from './UsuarioContext';

const mockUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez',
};

type UserBubbleProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function UserBubble({ theme, toggleTheme }: UserBubbleProps) {
  const [visible, setVisible] = useState(false);
  const { usuarioActual } = useAuth();
  const { tareas } = useTareas();
  const carpetaContext = useContext(CarpetaContext);
  const carpetasUsuario = carpetaContext?.carpetas || [];
  const carpetasIdsUsuario = new Set(carpetasUsuario.map(c => c.id));

  if (!usuarioActual) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>Cargando o redirigiendo...</Text>
      </View>
    );
  }

  // Filtrar tareas solo de las carpetas del usuario actual
  const tareasUsuario = tareas.filter(t => carpetasIdsUsuario.has(t.carpetaId));
  const tareasCompletadas = tareasUsuario.filter(t => t.estado === 'completada');
  const tareasTotales = tareasUsuario.length;

  return (
    <>
      <TouchableOpacity style={styles.bubble} onPress={() => setVisible(true)}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{usuarioActual.username[0]?.toUpperCase() || '?'}</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.drawer, theme === 'dark' && styles.drawerDark]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>{usuarioActual.username[0]?.toUpperCase() || '?'}</Text>
              </View>
              <Text style={[styles.userName, theme === 'dark' && { color: '#fff' }]}>{usuarioActual.username}</Text>
              <Text style={[styles.userEmail, theme === 'dark' && { color: '#ccc' }]}>Tareas completadas ({tareasCompletadas.length}/{tareasTotales})</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <TemaCambio />
            </View>
            <Text style={styles.sectionTitle}>Tareas realizadas</Text>
            <FlatList
              data={tareasCompletadas}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Text style={styles.taskDone}>✔ {item.titulo}</Text>}
              ListEmptyComponent={<Text style={styles.taskNotDone}>No hay tareas completadas.</Text>}
            />
            <Text style={styles.sectionTitle}>Tareas no realizadas</Text>
            <FlatList
              data={tareasUsuario.filter(t => t.estado !== 'completada')}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Text style={styles.taskNotDone}>✗ {item.titulo}</Text>}
              ListEmptyComponent={<Text style={styles.taskNotDone}>No hay tareas pendientes.</Text>}
            />
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
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    margin: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
  },
  drawerDark: {
    backgroundColor: '#222',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  closeText: {
    fontSize: 28,
    color: '#888',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarLargeText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  themeText: {
    fontSize: 16,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#2196f3',
  },
  taskDone: {
    color: 'green',
    marginLeft: 8,
    marginVertical: 2,
  },
  taskNotDone: {
    color: 'red',
    marginLeft: 8,
    marginVertical: 2,
  },
});
