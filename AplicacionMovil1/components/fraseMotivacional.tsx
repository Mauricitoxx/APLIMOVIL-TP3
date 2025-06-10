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
        const response = await fetch("https://api.quotable.io/random");
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
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  autor: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#3348ff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
