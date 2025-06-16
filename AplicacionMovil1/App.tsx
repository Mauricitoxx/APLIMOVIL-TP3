import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import UserBubble from './components/UserBubble';

export default function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}>
        <UserBubble theme={theme} toggleTheme={toggleTheme} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
});