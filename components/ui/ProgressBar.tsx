import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor = Colors.borderGray,
  progressColor = Colors.emeraldGreen,
  style,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: progressColor,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 3,
  },
});
