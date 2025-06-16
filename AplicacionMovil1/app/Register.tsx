import TemaCambio from '@/components/SwitchTema';
import { useCustomColors } from '@/hooks/useCustomColors';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../components/UsuarioContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const colores = useCustomColors();
  const { registrarUsuario, isLoadingAuth, authError } = useAuth(); 

  // Paletas de color particular para Login y Registro para ambos modos
  const theme = darkMode
    ? { 
        bg: '#181c25', card: '#23283a', primary: '#8fa7ff', text: '#fff', 
        textSecondary: '#bbb', input: '#23283a', buttonText: '#23283a', border: '#8fa7ff', 
      }
    : { 
        bg: '#f4f7fb', card: '#fff', primary: '#4962f2', text: '#222', 
        textSecondary: '#888', input: '#f7f9fd', buttonText: '#fff', border: '#4962f2', 
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

  const handleRegister = () => { 
    if (!username || !password) {
      setLocalError('Completa todos los campos');
      return;
    }

    setLocalError(''); 
    
    
    const success = registrarUsuario(username, password);

    if (success) {
      router.replace('/home'); 
    } else {
    }
  };

  return (
    <View style={[{backgroundColor: colores.fondo }, styles.bg]}>
      <Stack.Screen options={{ title: 'Regístrate', headerShown: true }} />

      <View style={[{backgroundColor: colores.fondoUsuario }, styles.card]}>
        <View style={styles.switchRow}>
              <TemaCambio />
        </View>
        <Text style={styles.title}>Crea tu Cuenta</Text>
        <Text style={[{color: colores.texto}, styles.subtitle]}>
          Regístrate para organizar tus tareas y lograr tus objetivos diarios
        </Text>
        <View style={styles.separator} />
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario (Nickname)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.textSecondary}
        />
        {localError ? <Text style={styles.error}>{localError}</Text> : null}
        {/* Muestra el error del contexto si existe y no hay un error local */}
        {authError && !localError ? <Text style={styles.error}>{authError}</Text> : null} 
        
        <Pressable style={styles.button} onPress={handleRegister} disabled={isLoadingAuth}>
          {isLoadingAuth ? (
            <ActivityIndicator color={theme.buttonText} /> 
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/Login')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}