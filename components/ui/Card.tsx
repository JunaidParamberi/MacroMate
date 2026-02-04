import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Components } from '../../constants/theme';

export type CardVariant = 'master' | 'metric';

export interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  variant = 'master',
  children,
  style,
  onPress,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle = Components.card[variant];
    return {
      ...baseStyle,
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), styles.card, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), styles.card, style]}>
      {children}
    </View>
  );
};

// Convenience components for specific card types
export const MasterCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="master" {...props} />
);

export const MetricCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="metric" {...props} />
);

const styles = StyleSheet.create({
  card: {
    // Additional shared card styles if needed
  },
});
