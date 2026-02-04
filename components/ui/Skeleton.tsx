import React from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors } from '../../constants/theme';

// Skeleton base component with shimmer effect
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  borderRadius?: number;
  shimmer?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
  borderRadius = BorderRadius.sm,
  shimmer = true,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (shimmer) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [shimmer, animatedValue]);

  const shimmerStyle = shimmer
    ? {
        backgroundColor: Colors.borderGray,
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 0.7],
        }),
      }
    : {
        backgroundColor: Colors.borderGray,
      };

  return (
    <View
      style={[
        styles.skeleton,
        {
          width: typeof width === 'string' ? width : width,
          height: typeof height === 'string' ? height : height,
          borderRadius,
        },
        shimmerStyle,
        style,
      ]}
    />
  );
};

// Text Skeleton variants
export interface TextSkeletonProps {
  lines?: number;
  width?: number | string | Array<number | string>;
  height?: number;
  style?: ViewStyle;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 1,
  width = '100%',
  height = 16,
  style,
}) => {
  const widths = Array.isArray(width) ? width : [width];
  
  return (
    <View style={[styles.textSkeleton, style]}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          width={widths[index] || widths[0]}
          height={height}
          style={styles.textLine}
          borderRadius={4}
        />
      ))}
    </View>
  );
};

// Card Skeleton
export interface CardSkeletonProps {
  height?: number;
  showAvatar?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
  lines?: number;
  style?: ViewStyle;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  height = 120,
  showAvatar = false,
  showTitle = true,
  showSubtitle = false,
  lines = 2,
  style,
}) => {
  return (
    <View style={[styles.cardSkeleton, { height }, style]}>
      {showAvatar && (
        <Skeleton width={40} height={40} borderRadius={20} style={styles.avatar} />
      )}
      <View style={styles.cardContent}>
        {showTitle && (
          <Skeleton width="60%" height={20} style={styles.cardTitle} />
        )}
        {showSubtitle && (
          <Skeleton width="40%" height={14} style={styles.cardSubtitle} />
        )}
        <TextSkeleton lines={lines} height={14} />
      </View>
    </View>
  );
};

// List Row Skeleton
export interface ListRowSkeletonProps {
  showIcon?: boolean;
  showArrow?: boolean;
  height?: number;
  style?: ViewStyle;
}

export const ListRowSkeleton: React.FC<ListRowSkeletonProps> = ({
  showIcon = true,
  showArrow = true,
  height = 56,
  style,
}) => {
  return (
    <View style={[styles.listRowSkeleton, { height }, style]}>
      {showIcon && (
        <Skeleton width={24} height={24} borderRadius={12} style={styles.listIcon} />
      )}
      <View style={styles.listContent}>
        <Skeleton width="70%" height={16} style={styles.listTitle} />
        <Skeleton width="40%" height={12} style={styles.listSubtitle} />
      </View>
      {showArrow && (
        <Skeleton width={20} height={20} borderRadius={4} style={styles.listArrow} />
      )}
    </View>
  );
};

// Button Skeleton
export interface ButtonSkeletonProps {
  variant?: 'primary' | 'secondary';
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  variant = 'primary',
  width = '100%',
  height = 48,
  style,
}) => {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={BorderRadius.button}
      style={style}
    />
  );
};

// Stats Skeleton
export interface StatsSkeletonProps {
  showIcon?: boolean;
  showChange?: boolean;
  style?: ViewStyle;
}

export const StatsSkeleton: React.FC<StatsSkeletonProps> = ({
  showIcon = true,
  showChange = false,
  style,
}) => {
  return (
    <View style={[styles.statsSkeleton, style]}>
      {showIcon && (
        <Skeleton width={32} height={32} borderRadius={16} style={styles.statsIcon} />
      )}
      <View style={styles.statsContent}>
        <Skeleton width={80} height={32} style={styles.statsValue} />
        <Skeleton width={60} height={14} style={styles.statsLabel} />
        {showChange && (
          <Skeleton width={40} height={12} style={styles.statsChange} />
        )}
      </View>
    </View>
  );
};

// Chart Skeleton
export interface ChartSkeletonProps {
  height?: number;
  showGrid?: boolean;
  style?: ViewStyle;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  height = 200,
  showGrid = true,
  style,
}) => {
  return (
    <View style={[styles.chartSkeleton, { height }, style]}>
      {showGrid && (
        <View style={styles.chartGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height={1}
              style={styles.gridLine}
              shimmer={false}
            />
          ))}
        </View>
      )}
      <Skeleton width="100%" height={height * 0.6} borderRadius={4} />
    </View>
  );
};

// Metric Card Skeleton
export interface MetricCardSkeletonProps {
  style?: ViewStyle;
}

export const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ style }) => {
  return (
    <View style={[styles.metricCardSkeleton, style]}>
      <View style={styles.metricHeader}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <View style={styles.metricTitleArea}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <View style={styles.metricContent}>
        <Skeleton width={60} height={28} />
        <Skeleton width={40} height={14} />
      </View>
      <Skeleton width="100%" height={4} borderRadius={2} />
    </View>
  );
};

// Complete Screen Skeleton
export interface ScreenSkeletonProps {
  showHeader?: boolean;
  showCards?: number;
  showList?: number;
  showStats?: number;
  style?: ViewStyle;
}

export const ScreenSkeleton: React.FC<ScreenSkeletonProps> = ({
  showHeader = true,
  showCards = 2,
  showList = 3,
  showStats = 2,
  style,
}) => {
  return (
    <View style={[styles.screenSkeleton, style]}>
      {showHeader && (
        <View style={styles.headerSkeleton}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={24} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
      )}
      
      <View style={styles.contentSkeleton}>
        <Skeleton width="60%" height={32} style={styles.pageTitle} />
        <Skeleton width="80%" height={16} style={styles.pageSubtitle} />
        
        {showStats > 0 && (
          <View style={styles.statsGrid}>
            {Array.from({ length: showStats }, (_, index) => (
              <StatsSkeleton key={index} />
            ))}
          </View>
        )}
        
        {showCards > 0 && (
          <View style={styles.cardsSection}>
            {Array.from({ length: showCards }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </View>
        )}
        
        {showList > 0 && (
          <View style={styles.listSection}>
            {Array.from({ length: showList }, (_, index) => (
              <ListRowSkeleton key={index} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  textSkeleton: {
    gap: 4,
  },
  textLine: {
    marginBottom: 2,
  },
  cardSkeleton: {
    padding: 16,
    backgroundColor: Colors.pureWhite,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardSubtitle: {
    marginBottom: 8,
  },
  listRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.pureWhite,
  },
  listIcon: {
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    marginBottom: 2,
  },
  listSubtitle: {
    marginBottom: 2,
  },
  listArrow: {
    marginLeft: 16,
  },
  statsSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  statsIcon: {
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    marginBottom: 4,
  },
  statsLabel: {
    marginBottom: 4,
  },
  statsChange: {
    width: 40,
  },
  chartSkeleton: {
    padding: 16,
    backgroundColor: Colors.pureWhite,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  chartGrid: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  },
  gridLine: {
    marginBottom: 20,
  },
  metricCardSkeleton: {
    padding: 16,
    backgroundColor: Colors.pureWhite,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.borderGray,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  metricTitleArea: {
    flex: 1,
    marginLeft: 12,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenSkeleton: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  contentSkeleton: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    marginBottom: 4,
  },
  pageSubtitle: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  cardsSection: {
    gap: 16,
    marginBottom: 24,
  },
  listSection: {
    gap: 1,
    backgroundColor: Colors.borderGray,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
  },
});
