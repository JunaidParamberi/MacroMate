import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import { CircularProgress } from './CircularProgress';
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
  // Dynamic stats for featured card
  foodValue?: string;
  exerciseValue?: string;
  baseGoalValue?: string;
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
  // Dynamic stats
  foodValue,
  exerciseValue = '0 kcal',
  baseGoalValue,
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
  
  // For featured variant with ring, hide the value/goal text since they're in the ring
  const showValueText = !isFeatured || !showProgressBar;
  const showGoalText = showGoal && goal && (!isFeatured || !showProgressBar);
  
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
        {showValueText && (
          <Typography variant={variantConfig.valueVariant} style={{...styles.value, color: valueColor} as any}>
            {value}
          </Typography>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="caption" style={{...styles.subtitle, color: subtitleColor} as any}>
            {subtitle}
          </Typography>
        )}

        {/* Goal text */}
        {showGoalText && (
          <Typography variant="caption" style={{...styles.goal, color: subtitleColor} as any}>
            {goal}
          </Typography>
        )}

        {/* Progress bar or ring */}
        {showProgressBar && (
          isFeatured ? (
            <View style={styles.featuredLayout}>
              {/* Left side - Ring with value */}
              <View style={styles.ringSection}>
                <CircularProgress 
                  progress={progress || 0} 
                  size={140} 
                  strokeWidth={10} 
                  progressColor={cardProgressColor}
                  backgroundColor={isDark ? Colors.neutral[700] : Colors.neutral[200]}
                  value={progress > 0 ? Math.round(parseInt(value.replace(/,/g, '')) * (1 - progress)).toString() : value}
                  label={progress > 0 ? "Remaining" : "Consumed"}
                />
              </View>
              
              {/* Right side - Stats */}
              <View style={styles.statsSection}>
                <View style={styles.statRow}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.activityColors.calories + '20' }]}>
                    <Icon name="flame" library="ionicons" size={18} color={Colors.activityColors.calories} />
                  </View>
                  <View>
                    <Typography variant="caption" style={{ color: subtitleColor }}>Food</Typography>
                    <Typography variant="bodyText" style={{ fontWeight: '700', color: valueColor }}>
                      {foodValue || `${value} kcal`}
                    </Typography>
                  </View>
                </View>
                <View style={styles.statRow}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.activityColors.running + '20' }]}>
                    <Icon name="walk" library="ionicons" size={18} color={Colors.activityColors.running} />
                  </View>
                  <View>
                    <Typography variant="caption" style={{ color: subtitleColor }}>Exercise</Typography>
                    <Typography variant="bodyText" style={{ fontWeight: '700', color: valueColor }}>
                      {exerciseValue || '0 kcal'}
                    </Typography>
                  </View>
                </View>
                <View style={styles.statRow}>
                  <View style={[styles.statIcon, { backgroundColor: Colors.brand.primary + '20' }]}>
                    <Icon name="flag" library="ionicons" size={18} color={Colors.brand.primary} />
                  </View>
                  <View>
                    <Typography variant="caption" style={{ color: subtitleColor }}>Target</Typography>
                    <Typography variant="bodyText" style={{ fontWeight: '700', color: valueColor }}>
                      {baseGoalValue || (goal ? goal.replace('/ ', '') : '0 kcal')}
                    </Typography>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <ProgressBar progress={progress || 0} style={styles.progressBar} progressColor={cardProgressColor} />
          )
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
    borderRadius: 20,
    ...Shadows.md,
  },
  featuredContainer: {
    ...Shadows.lg,
    borderRadius: 24,
  },
  cardInner: {
    padding: 20,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
  },
  value: {
    fontWeight: '800',
    fontSize: 32,
    marginBottom: 6,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  goal: {
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBar: {
    marginTop: 12,
    marginBottom: 8,
  },
  featuredLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
    gap: 16,
  },
  ringSection: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flex: 1,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  additionalInfo: {
    fontWeight: '700',
    fontSize: 14,
  },
});
