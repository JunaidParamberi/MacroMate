import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/theme';
import { Typography } from './Typography';

const { width: screenWidth } = Dimensions.get('window');

// Chart data interfaces
export interface ChartDataPoint {
  value: number;
  label?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  style?: any;
}

// Area Chart Component
export interface AreaChartProps extends ChartProps {
  showGrid?: boolean;
  showLabels?: boolean;
  maxValue?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 200,
  color = Colors.emeraldGreen,
  showGrid = true,
  showLabels = true,
  maxValue,
  style,
}) => {
  const chartWidth = screenWidth - 32; // Account for padding
  const chartHeight = height - 40; // Account for labels
  
  const actualMaxValue = maxValue || Math.max(...data.map(d => d.value));
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (point.value / actualMaxValue) * chartHeight;
    return `${x},${y}`;
  });

  const areaPath = `M0,${chartHeight} L${points.join(' L')} L${chartWidth},${chartHeight} Z`;
  const linePath = `M${points.join(' L')}`;

  return (
    <View style={[styles.container, style, { height }]}>
      {showGrid && (
        <View style={styles.grid}>
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                {
                  top: (index / 4) * chartHeight,
                  width: chartWidth,
                },
              ]}
            />
          ))}
        </View>
      )}
      
      <svg width={chartWidth} height={chartHeight} style={styles.svg}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#gradient)"
        />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      </svg>

      {showLabels && (
        <View style={styles.labels}>
          {data.map((point, index) => (
            <View key={index} style={styles.label}>
              <Typography variant="caption" style={styles.labelText}>
                {point.label || point.value}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Segment Ring (Donut Chart) Component
export interface SegmentRingProps {
  data: Array<{ value: number; label: string; color: string }>;
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  style?: any;
}

export const SegmentRing: React.FC<SegmentRingProps> = ({
  data,
  size = 200,
  strokeWidth = 20,
  showLabels = true,
  showPercentage = true,
  style,
}) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Calculate path for arc
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    ].join(' ');

    currentAngle = endAngle;

    return {
      path,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <svg width={size} height={size} style={styles.svg}>
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {showLabels && (
        <View style={styles.ringLabels}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.ringLabel}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: segment.color },
                ]}
              />
              <Typography variant="caption" style={styles.labelText}>
                {segment.label}
                {showPercentage && ` (${segment.percentage.toFixed(1)}%)`}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Simple Progress Bar Component
export interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  style?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = Colors.emeraldGreen,
  backgroundColor = Colors.borderGray,
  showPercentage = false,
  style,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.progressBarContainer, style]}>
      <View
        style={[
          styles.progressBarBackground,
          {
            height,
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${clampedProgress * 100}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Typography variant="caption" style={styles.progressText}>
          {Math.round(clampedProgress * 100)}%
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.borderGray,
    opacity: 0.3,
  },
  labels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    alignItems: 'center',
  },
  labelText: {
    color: Colors.textSecondary,
  },
  ringLabels: {
    marginTop: 16,
  },
  ringLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressBarContainer: {
    flexDirection: 'column',
  },
  progressBarBackground: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 4,
    color: Colors.textSecondary,
  },
});
