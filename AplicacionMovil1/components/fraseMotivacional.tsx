import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";

interface Frase {
  content: string;
  author: string;
}

export default function FraseMotivacional() {
  const [frase, setFrase] = useState<Frase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrase = async () => {
      try {
        const response = await fetch("http://api.quotable.io/random");
        if (!response.ok) throw new Error("Error al obtener la frase");
        const data = await response.json();
        setFrase({ content: data.content, author: data.author });
      } catch (e) {
        setError("No se pudo cargar la frase");
      } finally {
        setLoading(false);
      }
    };
    fetchFrase();
  }, []);

  if (loading) return <ActivityIndicator size="small" color="#007AFF" style={{ marginBottom: 10 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.cita}>"{frase?.content}"</Text>
      <Text style={styles.autor}>- {frase?.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0, 0, 0, 0)", // Color de fondo con opacidad
    borderRadius: 8,
    marginBottom: -130, // Ajuste para que se vea bien en la pantalla
  },
  cita: {
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 26,
    fontWeight: "bold",
    color: "rgb(255, 255, 255)", // Color de texto con opacidad
    marginBottom: 10,
  },
  autor: {
    fontWeight: "bold",
    textAlign: "center",
    color: "rgba(235, 255, 253, 0.8)", 
    fontSize: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
