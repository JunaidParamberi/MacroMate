import React from 'react';
import { StyleSheet, Text, TextProps, View, ViewProps, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

// Auto-themed View component
export const ThemedView: React.FC<ViewProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.dark.cardBackground : Colors.light.cardBackground;

  return (
    <View
      style={[{ backgroundColor }, style]}
      {...props}
    />
  );
};

// Auto-themed Text component
export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const color = isDark ? Colors.dark.text : Colors.light.text;

  return (
    <Text
      style={[{ color }, style]}
      {...props}
    />
  );
};

// Auto-themed Secondary Text component
export const ThemedSecondaryText: React.FC<TextProps> = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const color = isDark ? Colors.neutral[400] : Colors.neutral[500];

  return (
    <Text
      style={[{ color }, style]}
      {...props}
    />
  );
};

// Auto-themed Card component
interface CardProps extends ViewProps {
  elevated?: boolean;
}

export const ThemedCard: React.FC<CardProps> = ({ style, elevated = true, ...props }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? Colors.neutral[800] : Colors.neutral.white;

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: 20,
          ...(elevated && {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: isDark ? 4 : 3,
          }),
        },
        style,
      ]}
      {...props}
    />
  );
};

// Hook for themed values
export const useThemeColor = (
  lightColor: string,
  darkColor: string
): string => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColor : lightColor;
};

// Get all theme colors
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  return {
    isDark,
    theme: isDark ? Colors.dark : Colors.light,
    neutral: Colors.neutral,
    brand: Colors.brand,
    activityColors: Colors.activityColors,
  };
};
