import TemaCambio from '@/components/SwitchTema';
import { useCustomColors } from '@/hooks/useCustomColors';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { UsuarioContext } from '../components/UsuarioContext'; // Importa el contexto
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const usuarioContext = useContext(UsuarioContext); // Usa el contexto
  const colores = useCustomColors();
  // Paletas de colores para ambos modos
  const theme = darkMode
    ? {
        bg: '#181c25',
        card: '#23283a',
        primary: '#8fa7ff',
        text: '#fff',
        textSecondary: '#bbb',
        input: '#23283a',
        buttonText: '#23283a',
        border: '#8fa7ff',
      }
    : {
        bg: '#f4f7fb',
        card: '#fff',
        primary: '#4962f2',
        text: '#222',
        textSecondary: '#888',
        input: '#f7f9fd',
        buttonText: '#fff',
        border: '#4962f2',
      };

    const styles = StyleSheet.create({
      bg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      card: { width: '90%', borderRadius: 18, padding: 28, alignItems: 'center', shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
      title: { fontSize: 28, fontWeight: 'bold', color: theme.primary, marginBottom: 10, textAlign: 'center', letterSpacing: 1, marginTop: 10 },
      subtitle: { fontSize: 17, marginBottom: 18, textAlign: 'center' },
      separator: { width: 40, height: 4, backgroundColor: theme.primary, borderRadius: 2, marginBottom: 18, opacity: 0.15 },
      input: { width: '100%', borderWidth: 1, borderColor: theme.border, borderRadius: 10, padding: 14, marginBottom: 14, backgroundColor: theme.input, color: theme.text, fontSize: 16 },
      button: { backgroundColor: theme.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', width: '100%', marginBottom: 10, marginTop: 6, shadowColor: theme.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 2 },
      buttonText: { color: theme.buttonText, fontWeight: 'bold', fontSize: 17, letterSpacing: 1 },
      error: { color: '#d32f2f', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
      link: { color: theme.primary, textAlign: 'center', marginTop: 20, textDecorationLine: 'underline', fontWeight: 'bold', fontSize: 18 },
      switchRow: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
      switchLabel: { color: theme.text, marginRight: 8, fontWeight: 'bold' },
    });

  const handleLogin = () => {
    if (!username || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (usuarioContext && usuarioContext.loginUsuario(username, password)) {
      setError('');
      Alert.alert('¡Bienvenido!', 'Login exitoso');
      router.replace('/home');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <View style={[{ backgroundColor: colores.fondo }, styles.bg]}>
      <View style={[{ backgroundColor: colores.fondoUsuario }, styles.card]}>
        <View style={styles.switchRow}>
              <TemaCambio />
        </View>
        <Text style={[{color : colores.texto}, styles.title]}>¡Bienvenido!</Text>
        <Text style={[styles.subtitle , {color: colores.texto}]}>
          Organiza tus tareas y logra tus objetivos diarios
        </Text>
        <View style={styles.separator} />
        <TextInput
          style={[{color : colores.texto}, styles.input]}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.textSecondary}
        />
        <TextInput
          style={[{color : colores.texto}, styles.input]}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.textSecondary}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/Register')}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </View>
  );
}