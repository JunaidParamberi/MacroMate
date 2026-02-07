import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

interface SelectionCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconLibrary?: 'ionicons' | 'material';
  isSelected: boolean;
  onPress: () => void;
  hasCheckmark?: boolean;
}

export function SelectionCard({
  title,
  subtitle,
  icon,
  iconLibrary = 'ionicons',
  isSelected,
  onPress,
  hasCheckmark = true,
}: SelectionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        { 
          backgroundColor: isSelected 
            ? Colors.brand.primary + '08' 
            : isDark ? Colors.neutral[800] : Colors.neutral.white,
          borderColor: isSelected 
            ? Colors.brand.primary 
            : isDark ? Colors.neutral[700] : Colors.neutral[200],
        }
      ]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[styles.iconContainer, { 
            backgroundColor: isSelected 
              ? Colors.brand.primary + '15' 
              : isDark ? Colors.neutral[700] : Colors.neutral[100]
          }]}>
            <Ionicons
              name={icon as any}
              size={24}
              color={isSelected ? Colors.brand.primary : isDark ? Colors.neutral[400] : Colors.neutral[500]}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Typography
            variant="bodyText"
            style={{ fontSize: 16, fontWeight: '600', marginBottom: 4, color: isSelected ? Colors.brand.primary : isDark ? Colors.neutral[100] : Colors.neutral[800] }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
      {hasCheckmark && (
        <View style={[styles.checkCircle, { 
          borderColor: isSelected ? Colors.brand.primary : isDark ? Colors.neutral[600] : Colors.neutral[300]
        }, isSelected && styles.selectedCheckCircle]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={Colors.neutral.white} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  selectedContainer: {
    borderColor: Colors.brand.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircle: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
});
