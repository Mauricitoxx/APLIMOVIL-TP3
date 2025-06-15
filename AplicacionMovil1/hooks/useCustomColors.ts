import { useContext } from "react";
import { useCustomTheme } from "../components/TemaContext";
import { Colores } from '@/constants/Colores';
import TemaCambio from "@/components/CambiarTemaC";

export const useCustomColors = () => {
    const { tema } = useCustomTheme();
    return Colores[tema];
};