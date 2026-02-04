import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { Card } from './Card';
import { Icon, IconLibrary } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Typography } from './Typography';

export type FitnessCardVariant = 'large' | 'small';
export type FitnessCardType = 'calories' | 'steps' | 'active' | 'custom';

export interface BaseFitnessCardProps {
  variant?: FitnessCardVariant;
  icon?: string;
  iconLibrary?: IconLibrary;
  iconBackgroundColor?: string;
  progress?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export interface CaloriesCardProps extends BaseFitnessCardProps {
  type: 'calories';
  value: string;
  goal?: string;
  additionalInfo?: string;
}

export interface StepsCardProps extends BaseFitnessCardProps {
  type: 'steps';
  value: string;
}

export interface ActiveCardProps extends BaseFitnessCardProps {
  type: 'active';
  value: string;
}

export interface CustomCardProps extends BaseFitnessCardProps {
  type: 'custom';
  title: string;
  value: string;
  goal?: string;
  additionalInfo?: string;
}

export type FitnessCardProps = CaloriesCardProps | StepsCardProps | ActiveCardProps | CustomCardProps;

const getCardConfig = (type: FitnessCardType) => {
  switch (type) {
    case 'calories':
      return {
        defaultIcon: 'flame',
        defaultIconBg: '#FF6B35',
        title: 'Daily Calories',
      };
    case 'steps':
      return {
        defaultIcon: 'walk',
        defaultIconBg: '#4A90E2',
        title: 'Steps',
      };
    case 'active':
      return {
        defaultIcon: 'time',
        defaultIconBg: '#9B59B6',
        title: 'Active',
      };
    case 'custom':
      return {
        defaultIcon: 'star',
        defaultIconBg: Colors.emeraldGreen,
        title: '',
      };
    default:
      return {
        defaultIcon: 'help',
        defaultIconBg: Colors.borderGray,
        title: '',
      };
  }
};

export const FitnessCard: React.FC<FitnessCardProps> = ({
  variant = 'large',
  type,
  icon,
  iconLibrary = 'ionicons',
  iconBackgroundColor,
  progress = 0,
  style,
  onPress,
  ...props
}) => {
  const config = getCardConfig(type);
  const cardIcon = icon || config.defaultIcon;
  const cardIconBg = iconBackgroundColor || config.defaultIconBg;
  const cardTitle = type === 'custom' ? (props as CustomCardProps).title : config.title;

  const cardStyle = variant === 'large' ? styles.largeCard : styles.smallCard;

  return (
    <Card variant="metric" style={cardStyle} onPress={onPress}>
      {/* Header with icon and title */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: cardIconBg }]}>
          <Icon name={cardIcon} library={iconLibrary} size={20} color={Colors.pureWhite} />
        </View>
        <Typography variant="bodyText" style={styles.title}>
          {cardTitle}
        </Typography>
      </View>

      {/* Main value */}
      <Typography variant={variant === 'large' ? 'h2' : 'h3'} style={styles.value}>
        {(props as any).value}
      </Typography>

      {/* Goal text */}
      {('goal' in props && props.goal) && (
        <Typography variant="caption" style={styles.goal}>
          {props.goal}
        </Typography>
      )}

      {/* Progress bar */}
      {progress > 0 && (
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          progressColor={Colors.emeraldGreen}
        />
      )}

      {/* Additional info */}
      {('additionalInfo' in props && props.additionalInfo) && (
        <Typography variant="caption" style={styles.additionalInfo}>
          {props.additionalInfo}
        </Typography>
      )}
    </Card>
  );
};

// Convenience components for specific card types
export const CaloriesCard: React.FC<Omit<CaloriesCardProps, 'type'>> = (props) => (
  <FitnessCard {...props} type="calories" />
);

export const StepsCard: React.FC<Omit<StepsCardProps, 'type'>> = (props) => (
  <FitnessCard {...props} type="steps" />
);

export const ActiveCard: React.FC<Omit<ActiveCardProps, 'type'>> = (props) => (
  <FitnessCard {...props} type="active" />
);

export const CustomFitnessCard: React.FC<Omit<CustomCardProps, 'type'>> = (props) => (
  <FitnessCard {...props} type="custom" />
);

const styles = StyleSheet.create({
  largeCard: {
    minHeight: 120,
  },
  smallCard: {
    minHeight: 100,
  },
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
  goal: {
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    marginBottom: Spacing.sm,
  },
  additionalInfo: {
    color: Colors.emeraldGreen,
    fontWeight: '500',
  },
});
