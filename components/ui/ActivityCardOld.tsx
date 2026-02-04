import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { Card } from './Card';
import { Icon, IconLibrary } from './Icon';
import { ProgressBar } from './ProgressBar';
import { Typography } from './Typography';

export interface ActivityCardProps {
  title: string;
  value: string;
  icon: string;
  iconLibrary?: IconLibrary;
  iconBackgroundColor?: string;
  progress?: number;
  goal?: string;
  additionalInfo?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  value,
  icon,
  iconLibrary = 'ionicons',
  iconBackgroundColor = Colors.emeraldGreen,
  progress = 0,
  goal,
  additionalInfo,
  style,
  onPress,
}) => {
  return (
    <Card variant="metric" style={styles.container} onPress={onPress}>
      {/* Header with icon and title */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
          <Icon name={icon} library={iconLibrary} size={20} color={Colors.pureWhite} />
        </View>
        <Typography variant="bodyText" style={styles.title}>
          {title}
        </Typography>
      </View>

      {/* Main value */}
      <Typography variant="h2" style={styles.value}>
        {value}
      </Typography>

      {/* Goal text */}
      {goal && (
        <Typography variant="caption" style={styles.goal}>
          {goal}
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
      {additionalInfo && (
        <Typography variant="caption" style={styles.additionalInfo}>
          {additionalInfo}
        </Typography>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120,
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
