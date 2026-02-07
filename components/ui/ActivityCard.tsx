import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../../constants/theme';
import { Icon, IconLibrary } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Typography } from './Typography';

export type ActivityCardVariant = 'large' | 'small' | 'compact' | 'featured';
export type ActivityCardTheme = 'calories' | 'steps' | 'active' | 'water' | 'sleep' | 'weight' | 'heart' | 'custom';

export interface ActivityCardProps {
  title?: string;
  value: string;
  subtitle?: string;
  variant?: ActivityCardVariant;
  theme?: ActivityCardTheme;
  icon?: string;
  iconLibrary?: IconLibrary;
  iconBackgroundColor?: string;
  iconSize?: number;
  progress?: number;
  progressColor?: string;
  showProgressBar?: boolean;
  goal?: string;
  additionalInfo?: string;
  additionalInfoColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
  showIcon?: boolean;
  showTitle?: boolean;
  showGoal?: boolean;
  showAdditionalInfo?: boolean;
  featured?: boolean;
}

const getThemeConfig = (theme: ActivityCardTheme) => {
  switch (theme) {
    case 'calories':
      return {
        defaultIcon: 'flame-outline',
        defaultIconBg: '#FF6B35',
        defaultTitle: 'Daily Calories',
        defaultProgressColor: '#FF6B35',
      };
    case 'steps':
      return {
        defaultIcon: 'walk-outline',
        defaultIconBg: '#4A90E2',
        defaultTitle: 'Steps',
        defaultProgressColor: '#4A90E2',
      };
    case 'active':
      return {
        defaultIcon: 'time-outline',
        defaultIconBg: '#9B59B6',
        defaultTitle: 'Active',
        defaultProgressColor: '#9B59B6',
      };
    case 'water':
      return {
        defaultIcon: 'water-outline',
        defaultIconBg: '#3498DB',
        defaultTitle: 'Water Intake',
        defaultProgressColor: '#3498DB',
      };
    case 'sleep':
      return {
        defaultIcon: 'moon-outline',
        defaultIconBg: '#34495E',
        defaultTitle: 'Sleep',
        defaultProgressColor: '#34495E',
      };
    case 'weight':
      return {
        defaultIcon: 'speedometer-outline',
        defaultIconBg: '#E74C3C',
        defaultTitle: 'Weight',
        defaultProgressColor: '#E74C3C',
      };
    case 'heart':
      return {
        defaultIcon: 'heart-outline',
        defaultIconBg: '#E91E63',
        defaultTitle: 'Heart Rate',
        defaultProgressColor: '#E91E63',
      };
    case 'custom':
      return {
        defaultIcon: 'star-outline',
        defaultIconBg: Colors.emeraldGreen,
        defaultTitle: '',
        defaultProgressColor: Colors.emeraldGreen,
      };
    default:
      return {
        defaultIcon: 'help-outline',
        defaultIconBg: Colors.borderGray,
        defaultTitle: '',
        defaultProgressColor: Colors.emeraldGreen,
      };
  }
};

const getVariantStyles = (variant: ActivityCardVariant) => {
  switch (variant) {
    case 'featured':
      return {
        minHeight: 140,
        valueVariant: 'h2' as const,
        iconSize: 28,
        titleVariant: 'bodyText' as const,
      };
    case 'large':
      return {
        minHeight: 120,
        valueVariant: 'h2' as const,
        iconSize: 24,
        titleVariant: 'bodyText' as const,
      };
    case 'small':
      return {
        minHeight: 100,
        valueVariant: 'h3' as const,
        iconSize: 20,
        titleVariant: 'caption' as const,
      };
    case 'compact':
      return {
        minHeight: 80,
        valueVariant: 'h3' as const,
        iconSize: 18,
        titleVariant: 'caption' as const,
      };
    default:
      return {
        minHeight: 120,
        valueVariant: 'h2' as const,
        iconSize: 24,
        titleVariant: 'bodyText' as const,
      };
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'large',
  theme = 'custom',
  icon,
  iconLibrary = 'ionicons',
  iconBackgroundColor,
  iconSize,
  progress = 0,
  progressColor,
  showProgressBar = true,
  goal,
  additionalInfo,
  additionalInfoColor = Colors.brand.primary,
  style,
  onPress,
  showIcon = true,
  showTitle = true,
  showGoal = true,
  showAdditionalInfo = true,
  featured = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  
  const themeConfig = getThemeConfig(theme);
  const variantConfig = getVariantStyles(variant);
  
  const cardIcon = icon || themeConfig.defaultIcon;
  const cardIconBg = iconBackgroundColor || themeConfig.defaultIconBg;
  const cardTitle = title || themeConfig.defaultTitle;
  const cardProgressColor = progressColor || themeConfig.defaultProgressColor;
  const cardIconSize = iconSize || variantConfig.iconSize;

  const isFeatured = variant === 'featured' || featured;
  
  // Dynamic card background
  const cardBackgroundColor = isFeatured 
    ? cardIconBg + (isDark ? '20' : '10')
    : themeColors.cardBackground;

  // Dynamic text colors
  const titleColor = isFeatured 
    ? (isDark ? Colors.neutral[200] : Colors.neutral[800])
    : (isDark ? Colors.neutral[400] : Colors.neutral[600]);
  
  const valueColor = isFeatured 
    ? (isDark ? Colors.neutral.white : Colors.neutral[800])
    : (isDark ? Colors.neutral[50] : Colors.neutral[800]);

  const subtitleColor = isDark ? Colors.neutral[400] : Colors.neutral[500];

  return (
    <Pressable 
      onPress={onPress} 
      style={[styles.container, isFeatured && styles.featuredContainer, { backgroundColor: cardBackgroundColor }, style]}
    >
      <View style={styles.cardInner}>
        {/* Header with icon and title */}
        {(showIcon || showTitle) && (
          <View style={styles.header}>
            {showIcon && (
              <View style={[styles.iconContainer, { backgroundColor: cardIconBg + '20' }]}>
                <Icon name={cardIcon} library={iconLibrary} size={cardIconSize} color={cardIconBg} />
              </View>
            )}
            {showTitle && cardTitle && (
              <Typography variant={variantConfig.titleVariant} style={{...styles.title, color: titleColor} as any}>
                {cardTitle}
              </Typography>
            )}
          </View>
        )}

        {/* Main value */}
        <Typography variant={variantConfig.valueVariant} style={{...styles.value, color: valueColor} as any}>
          {value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="caption" style={{...styles.subtitle, color: subtitleColor} as any}>
            {subtitle}
          </Typography>
        )}

        {/* Goal text */}
        {showGoal && goal && (
          <Typography variant="caption" style={{...styles.goal, color: subtitleColor} as any}>
            {goal}
          </Typography>
        )}

        {/* Progress bar */}
        {showProgressBar && progress > 0 && (
          <ProgressBar progress={progress} style={styles.progressBar} progressColor={cardProgressColor} />
        )}

        {/* Additional info */}
        {showAdditionalInfo && additionalInfo && (
          <View style={styles.additionalInfoContainer}>
            <Typography variant="caption" style={{...styles.additionalInfo, color: additionalInfoColor} as any}>
              {additionalInfo}
            </Typography>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    ...Shadows.md,
  },
  featuredContainer: {
    ...Shadows.lg,
  },
  cardInner: {
    padding: Spacing.cardPadding,
    minHeight: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  goal: {
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  additionalInfo: {
    fontWeight: '600',
    fontSize: 13,
  },
});
