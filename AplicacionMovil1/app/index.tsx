import FraseMotivacional from '@/components/fraseMotivacional';
import type { AVPlaybackStatus } from 'expo-av';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../assets/images/logo.png'; // Asegúrate de que la ruta sea correcta
import Intro from '../assets/video/intro.mp4';

export default function App() {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState({});
  const [isBuffering, setIsBuffering] = useState(false);
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fraseOpacity = useRef(new Animated.Value(0)).current;

  // Intenta reproducir el video cuando esté listo para mostrar
  const handleReadyForDisplay = async () => {
    console.log('handleReadyForDisplay called');
    if (video.current && video.current.playAsync) {
      try {
        await video.current.playAsync();
        console.log('Video playAsync called from handleReadyForDisplay');
      } catch (e) {
        console.log('Error en playAsync (handleReadyForDisplay):', e);
      }
    } else {
      console.log('video.current o playAsync no disponible en handleReadyForDisplay');
    }
  };

  // Asegura que el video siempre se mantenga reproduciéndose en el fondo
  useEffect(() => {
    const interval = setInterval(() => {
      if (video.current && video.current.getStatusAsync && video.current.playAsync) {
        video.current.getStatusAsync().then((status: AVPlaybackStatus) => {
          console.log('Interval status:', status);
          if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
            video.current?.playAsync();
            console.log('Video playAsync called from interval');
          }
        });
      } else {
        console.log('video.current o métodos no disponibles en interval');
      }
    }, 1000); // Verifica cada segundo
    return () => clearInterval(interval);
  }, []);

  // Maneja el estado del video y reinicia si se detiene inesperadamente
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    setIsBuffering(status.isLoaded ? status.isBuffering : false);
    console.log('handlePlaybackStatusUpdate', status);
    // Si el video se detiene inesperadamente, intenta reproducirlo de nuevo
    if (status.isLoaded && !status.isPlaying && !status.isBuffering) {
      if (video.current && video.current.playAsync) {
        video.current.playAsync();
        console.log('Video playAsync called from handlePlaybackStatusUpdate');
      } else {
        console.log('video.current o playAsync no disponible en handlePlaybackStatusUpdate');
      }
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fraseOpacity, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start();

    // Eliminado el efecto bounceAnim
  }, [floatAnim, fraseOpacity]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={Platform.OS === 'web' ? styles.videoWeb : styles.videoNative}
        source={Intro}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={true}
        onReadyForDisplay={handleReadyForDisplay}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      {isBuffering && (
        <View style={styles.bufferingOverlay}>
          <Text style={styles.bufferingText}>Cargando video...</Text>
        </View>
      )}
      {/* FraseMotivacional al frente y centrado */}
      <Animated.View style={[styles.fraseWrapper, { opacity: fraseOpacity }]} pointerEvents="none">
        <FraseMotivacional />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
        <Image source={logo} style={{ width: 100, height: 100, marginBottom: 100 }} />
      </Animated.View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.transparentButton, { marginTop: 20 }]}
          activeOpacity={0.7}
          onPress={() => router.push('/Login')}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.transparentButton, { marginTop: 20 }]}
          activeOpacity={0.7}
          onPress={() => router.push('/Register')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  videoNative: {
    ...StyleSheet.absoluteFillObject,
  },
  videoWeb: {
    width: '100%',
    height: '150%',
    position: 'fixed',
    overflow: 'hidden',
    top: -200,
    left: 0,
    zIndex: 0,
  },
  fraseWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    pointerEvents: 'none', // Permite que los botones sigan siendo clickeables
  },
  fraseText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  buttonsContainer: {
    marginTop: 200,
    top: 100,
    zIndex: 3,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16, // Espacio entre botones (puedes quitar si da error en RN antiguo)
  },
  transparentButton: {
    backgroundColor: 'rgb(255, 255, 255)', // completamente transparente
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'rgb(0, 0, 0)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bufferingText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
    borderRadius: 10,
  },
});
