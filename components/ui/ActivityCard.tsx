import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { Card } from './Card';
import { Icon, IconLibrary } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Typography } from './Typography';

export type ActivityCardVariant = 'large' | 'small' | 'compact';
export type ActivityCardTheme = 'calories' | 'steps' | 'active' | 'water' | 'sleep' | 'weight' | 'heart' | 'custom';

export interface ActivityCardProps {
  // Basic props
  title?: string;
  value: string;
  subtitle?: string;
  
  // Variant and theme
  variant?: ActivityCardVariant;
  theme?: ActivityCardTheme;
  
  // Icon customization
  icon?: string;
  iconLibrary?: IconLibrary;
  iconBackgroundColor?: string;
  iconSize?: number;
  
  // Progress
  progress?: number;
  progressColor?: string;
  showProgressBar?: boolean;
  
  // Additional info
  goal?: string;
  additionalInfo?: string;
  additionalInfoColor?: string;
  
  // Styling
  style?: ViewStyle;
  onPress?: () => void;
  
  // Display options
  showIcon?: boolean;
  showTitle?: boolean;
  showGoal?: boolean;
  showAdditionalInfo?: boolean;
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
  additionalInfoColor = Colors.emeraldGreen,
  style,
  onPress,
  showIcon = true,
  showTitle = true,
  showGoal = true,
  showAdditionalInfo = true,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const dynamicColors = Colors[colorScheme];
  const themeConfig = getThemeConfig(theme);
  const variantConfig = getVariantStyles(variant);
  
  const cardIcon = icon || themeConfig.defaultIcon;
  const cardIconBg = iconBackgroundColor || themeConfig.defaultIconBg;
  const cardTitle = title || themeConfig.defaultTitle;
  const cardProgressColor = progressColor || themeConfig.defaultProgressColor;
  const cardIconSize = iconSize || variantConfig.iconSize;

  // Extract only the style properties for the Card component
  const cardStyle: ViewStyle = {
    minHeight: variantConfig.minHeight,
  };

  // Filter out undefined styles
  const cardStyles = [cardStyle, style].filter(Boolean) as ViewStyle[];

  return (
    <Card variant="metric" style={cardStyles} onPress={onPress}>
      {/* Header with icon and title */}
      {(showIcon || showTitle) && (
        <View style={styles.header}>
          {showIcon && (
            <View style={[styles.iconContainer, { backgroundColor: cardIconBg }]}>
              <Icon 
                name={cardIcon} 
                library={iconLibrary} 
                size={cardIconSize} 
                color={Colors.pureWhite} 
              />
            </View>
          )}
          {showTitle && cardTitle && (
            <Typography 
              variant={variantConfig.titleVariant} 
              style={styles.title}
            >
              {cardTitle}
            </Typography>
          )}
        </View>
      )}

      {/* Main value */}
      <Typography 
        variant={variantConfig.valueVariant} 
        style={styles.value}
      >
        {value}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography variant="caption" style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}

      {/* Goal text */}
      {showGoal && goal && (
        <Typography variant="caption" style={styles.goal}>
          {goal}
        </Typography>
      )}

      {/* Progress bar */}
      {showProgressBar && progress > 0 && (
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          progressColor={cardProgressColor}
        />
      )}

      {/* Additional info */}
      {showAdditionalInfo && additionalInfo && (
        <Typography 
          variant="caption" 
          style={[styles.additionalInfo, { color: additionalInfoColor }] as unknown as TextStyle}
        >
          {additionalInfo}
        </Typography>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  goal: {
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    marginBottom: Spacing.sm,
  },
  additionalInfo: {
    fontWeight: '500',
  },
});
