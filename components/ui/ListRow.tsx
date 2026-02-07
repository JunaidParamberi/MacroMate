import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';
import { Typography } from './Typography';

export interface ListRowProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  style?: ViewStyle;
  rightComponent?: React.ReactNode;
}

export const ListRow: React.FC<ListRowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = false,
  style,
  rightComponent,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const containerStyle = [
    styles.container,
    style,
  ];

  const RowComponent = onPress ? TouchableOpacity : View;

  return (
    <RowComponent
      style={containerStyle}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <View style={styles.icon}>
          {icon}
        </View>
      )}
      
      <View style={styles.content}>
        <Typography variant="bodyText" style={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="metaLabel" style={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </View>

      {(rightComponent || showArrow) && (
        <View style={styles.rightContent}>
          {rightComponent}
          {showArrow && (
            <ChevronRightIcon size={20} color={isDark ? Colors.neutral[400] : Colors.textSecondary} />
          )}
        </View>
      )}
    </RowComponent>
  );
};

// Simple Chevron Right Icon Component
const ChevronRightIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={[styles.chevron, { width: size, height: size }]}>
    <Text style={{ color, fontSize: 16 }}>›</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    minHeight: 56,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '500' as const,
  },
  subtitle: {
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginLeft: 16,
  },
  chevron: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
});
