import { Colores } from '@/constants/Colores';
import { useCustomTheme } from "../components/TemaContext";

export const useCustomColors = () => {
    const { tema } = useCustomTheme();
    return Colores[tema];
};