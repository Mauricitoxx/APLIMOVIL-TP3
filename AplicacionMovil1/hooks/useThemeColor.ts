/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colores';
import { useColorScheme } from '@/hooks/useColorScheme';

/*export function useThemeColor(
  props: { claro?: string; oscuro?: string },
  colorName: keyof typeof Colors.claro & keyof typeof Colors.oscuro
) {
  const theme = useColorScheme() ?? 'claro';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}*/
