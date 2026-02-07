import React from 'react';
import { StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { Typography } from './Typography';

export interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  value?: string;
  label?: string;
  style?: ViewStyle;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 130,
  strokeWidth = 8,
  backgroundColor,
  progressColor = Colors.brand.primary,
  value,
  label,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalBgColor = backgroundColor || (isDark ? Colors.neutral[700] : Colors.neutral[200]);
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // Calculate SVG parameters - increase inner space by reducing stroke
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - clampedProgress * circumference;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* SVG Ring */}
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={finalBgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center content - positioned absolutely in center */}
      <View style={styles.centerContent}>
        {value && (
          <Typography 
            variant="h2" 
            style={[styles.valueText, { color: isDark ? Colors.neutral.white : Colors.neutral[800] }]}
            numberOfLines={1}
          >
            {value}
          </Typography>
        )}
        {label && (
          <Typography 
            variant="metaLabel" 
            style={[styles.labelText, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}
            numberOfLines={1}
          >
            {label}
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  valueText: {
    fontWeight: '800',
    fontSize: 24,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
