import { Colors } from '@/constants/theme';
import { View, type ViewProps, useColorScheme } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  
  const backgroundColor = isDark ? (darkColor || themeColors.background) : (lightColor || themeColors.background);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
