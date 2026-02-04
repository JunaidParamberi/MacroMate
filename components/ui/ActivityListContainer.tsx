import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Spacing } from '../../constants/theme';

export interface ActivityListContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing | number;
  margin?: keyof typeof Spacing | number;
}

export const ActivityListContainer: React.FC<ActivityListContainerProps> = ({
  children,
  style,
  padding = 'md',
  margin,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const dynamicColors = Colors[colorScheme];
  
  const getSpacingValue = (value: keyof typeof Spacing | number): number => {
    if (typeof value === 'number') return value;
    return Spacing[value] || 0;
  };

  const containerStyle: ViewStyle = {
    padding: getSpacingValue(padding),
    ...(margin !== undefined && {
      margin: getSpacingValue(margin),
    }),
  };

  return (
    <View style={[styles.container, { backgroundColor: dynamicColors?.cardBackground || Colors.pureWhite, borderColor: dynamicColors?.border || Colors.border }, containerStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pureWhite,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
