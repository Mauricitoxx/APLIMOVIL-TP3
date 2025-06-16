import { useCustomTheme } from '@/components/TemaContext';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Switch, View } from 'react-native';

export default function TemaCambio() {
    const { tema, toggleTheme } = useCustomTheme();
    const isDarkMode = tema === 'oscuro';

    return (
        <View style={styles.container}>
            <Feather name="sun" size={20} color={isDarkMode ? "#aaa" : "#f1c40f"} />
            <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#ccc", true: "#555" }}
                thumbColor={isDarkMode ? "#f1c40f" : "#fff"}
                ios_backgroundColor="#ccc"
            />
            <Feather name="moon" size={20} color={isDarkMode ? "#fff" : "#aaa"} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
});