import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';
import { FitnessIcons } from './Icon';
import { Typography } from './Typography';

// Data Token Component - Small data display with icon and value
export interface DataTokenProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const DataToken: React.FC<DataTokenProps> = ({
  value,
  label,
  icon,
  color = Colors.charcoal,
  size = 'medium',
  style,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.tokenSmall,
          value: styles.valueSmall,
          label: styles.labelSmall,
        };
      case 'large':
        return {
          container: styles.tokenLarge,
          value: styles.valueLarge,
          label: styles.labelLarge,
        };
      default:
        return {
          container: styles.tokenMedium,
          value: styles.valueMedium,
          label: styles.labelMedium,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.tokenContainer, sizeStyles.container, style]}>
      {icon && <View style={styles.tokenIcon}>{icon}</View>}
      <View style={styles.tokenContent}>
        <Typography 
          variant="bodyText" 
          style={[styles.tokenValue, sizeStyles.value, { color } as any]}
        >
          {value}
        </Typography>
        <Typography 
          variant="metaLabel" 
          style={[styles.tokenLabel, sizeStyles.label] as any}
        >
          {label}
        </Typography>
      </View>
    </View>
  );
};

// Stats Component - Larger data display for main metrics
export interface StatsProps {
  value: string | number;
  label: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  style?: ViewStyle;
}

export const Stats: React.FC<StatsProps> = ({
  value,
  label,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
  color = Colors.charcoal,
  style,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <FitnessIcons.ArrowUp size={16} color={Colors.emeraldGreen} />;
      case 'down':
        return <FitnessIcons.ArrowDown size={16} color={Colors.borderGray} />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return Colors.emeraldGreen;
      case 'down':
        return Colors.borderGray;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.statsContainer, style]}>
      {icon && <View style={styles.statsIcon}>{icon}</View>}
      <View style={styles.statsContent}>
        <Typography variant="h1" style={[styles.statsValue, { color }] as any}>
          {value}
        </Typography>
        <Typography variant="metaLabel" style={styles.statsLabel}>
          {label}
        </Typography>
        {(change !== undefined || changeLabel) && (
          <View style={styles.statsChange}>
            {getTrendIcon()}
            <Typography 
              variant="caption" 
              style={[styles.statsChangeText, { color: getChangeColor() }] as any}
            >
              {change !== undefined && `${change > 0 ? '+' : ''}${change}%`}
              {changeLabel && ` ${changeLabel}`}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

// Label Component - Various label styles
export interface LabelProps {
  text: string;
  variant?: 'default' | 'badge' | 'pill' | 'tag';
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Label: React.FC<LabelProps> = ({
  text,
  variant = 'default',
  color = Colors.charcoal,
  backgroundColor = Colors.borderGray,
  size = 'medium',
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'badge':
        return styles.labelBadge;
      case 'pill':
        return styles.labelPill;
      case 'tag':
        return styles.labelTag;
      default:
        return styles.labelDefault;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          text: styles.textSmall,
          padding: styles.paddingSmall,
        };
      case 'large':
        return {
          text: styles.textLarge,
          padding: styles.paddingLarge,
        };
      default:
        return {
          text: styles.textMedium,
          padding: styles.paddingMedium,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <View
      style={[
        styles.labelContainer,
        variantStyle,
        sizeStyle.padding,
        { backgroundColor },
        style,
      ]}
    >
      <Typography
        variant="caption"
        style={[sizeStyle.text, { color: color || 'black' }] as any}
      >
        {text}
      </Typography>
    </View>
  );
};

// Metric Card Component - Combines stats with card styling
export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  progress?: number; // 0-1 for progress bar
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  progress,
  trend,
  change,
  color = Colors.emeraldGreen,
  onPress,
  style,
}) => {
  return (
    <View style={[styles.metricCard, style]}>
      <View style={styles.metricHeader}>
        {icon && <View style={styles.metricIcon}>{icon}</View>}
        <View style={styles.metricTitleContainer}>
          <Typography variant="bodyText" style={styles.metricTitle}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="metaLabel" style={styles.metricSubtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
      
      <View style={styles.metricContent}>
        <Typography variant="h2" style={[styles.metricValue, { color }] as any}>
          {value}
        </Typography>
        
        {change !== undefined && (
          <View style={styles.metricChange}>
            {trend === 'up' && <FitnessIcons.ArrowUp size={16} color={Colors.emeraldGreen} />}
            {trend === 'down' && <FitnessIcons.ArrowDown size={16} color={Colors.borderGray} />}
            <Typography 
              variant="caption" 
              style={[
                styles.metricChangeText,
                { color: trend === 'up' ? Colors.emeraldGreen : Colors.borderGray } as any
              ]}
            >
              {change > 0 ? '+' : ''}{change}%
            </Typography>
          </View>
        )}
      </View>
      
      {progress !== undefined && (
        <View style={styles.metricProgress}>
          <View style={styles.metricProgressBar}>
            <View 
              style={[
                styles.metricProgressFill,
                { 
                  width: `${progress * 100}%`,
                  backgroundColor: color,
                }
              ]} 
            />
          </View>
          <Typography variant="caption" style={styles.metricProgressText}>
            {Math.round(progress * 100)}%
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Data Token styles
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tokenMedium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tokenLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  tokenIcon: {
    marginRight: 8,
  },
  tokenContent: {
    flex: 1,
  },
  tokenValue: {
    fontWeight: '600',
  },
  valueSmall: {
    fontSize: 16,
  },
  valueMedium: {
    fontSize: 20,
  },
  valueLarge: {
    fontSize: 24,
  },
  tokenLabel: {
    marginTop: 2,
  },
  labelSmall: {
    fontSize: 12,
  },
  labelMedium: {
    fontSize: 14,
  },
  labelLarge: {
    fontSize: 16,
  },

  // Stats styles
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statsIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontWeight: 'bold',
  },
  statsLabel: {
    marginTop: 4,
  },
  statsChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statsChangeText: {
    marginLeft: 4,
  },

  // Label styles
  labelContainer: {
    alignSelf: 'flex-start',
  },
  labelDefault: {
    borderRadius: 4,
  },
  labelBadge: {
    borderRadius: 8,
  },
  labelPill: {
    borderRadius: 16,
  },
  labelTag: {
    borderRadius: 2,
  },
  paddingSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paddingMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paddingLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },

  // Metric Card styles
  metricCard: {
    backgroundColor: Colors.pureWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricIcon: {
    marginRight: 12,
  },
  metricTitleContainer: {
    flex: 1,
  },
  metricTitle: {
    fontWeight: '500',
  },
  metricSubtitle: {
    marginTop: 2,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricValue: {
    fontWeight: 'bold',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChangeText: {
    marginLeft: 4,
  },
  metricProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderGray,
    borderRadius: 2,
    marginRight: 8,
  },
  metricProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  metricProgressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
