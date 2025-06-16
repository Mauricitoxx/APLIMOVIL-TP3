import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TemaCambio from './CambiarTemaC';

const mockUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez',
};

const mockTasks = [
  { id: '1', title: 'Tarea 1', done: true },
  { id: '2', title: 'Tarea 2', done: false },
  { id: '3', title: 'Tarea 3', done: true },
  { id: '4', title: 'Tarea 4', done: false },
];

type UserBubbleProps = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function UserBubble({ theme, toggleTheme }: UserBubbleProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.bubble} onPress={() => setVisible(true)}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{mockUser.name[0]}</Text>
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
                <Text style={styles.avatarLargeText}>{mockUser.name[0]}</Text>
              </View>
              <Text style={[styles.userName, theme === 'dark' && { color: '#fff' }]}>{mockUser.name}</Text>
              <Text style={[styles.userEmail, theme === 'dark' && { color: '#ccc' }]}>{mockUser.email}</Text>
            </View>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <TemaCambio />
                    </View>
            <Text style={styles.sectionTitle}>Tareas realizadas</Text>
            <FlatList
              data={mockTasks.filter(t => t.done)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Text style={styles.taskDone}>✔ {item.title}</Text>}
            />
            <Text style={styles.sectionTitle}>Tareas no realizadas</Text>
            <FlatList
              data={mockTasks.filter(t => !t.done)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Text style={styles.taskNotDone}>✗ {item.title}</Text>}
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
