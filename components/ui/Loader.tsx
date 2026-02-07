import React from 'react';
import { Animated, StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

// Spinner Loader
export interface SpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  strokeWidth?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color,
  style,
  strokeWidth = 2,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.spinnerContainer, { width: size, height: size }, style]}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r={10 - strokeWidth / 2}
            stroke={finalColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="15"
          />
        </svg>
      </Animated.View>
    </View>
  );
};

// Pulse Loader
export interface PulseProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  count?: number;
}

export const Pulse: React.FC<PulseProps> = ({
  size = 8,
  color,
  style,
  count = 3,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  const createPulseAnimation = (delay: number) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }, [animatedValue, delay]);

    return animatedValue;
  };

  return (
    <View style={[styles.pulseContainer, style]}>
      {Array.from({ length: count }, (_, index) => {
        const animatedValue = createPulseAnimation(index * 200);
        const scale = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        });
        const opacity = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.pulseDot,
              {
                width: size,
                height: size,
                backgroundColor: finalColor,
                borderRadius: size / 2,
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Dots Loader
export interface DotsProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  count?: number;
  spacing?: number;
}

export const Dots: React.FC<DotsProps> = ({
  size = 8,
  color,
  style,
  count = 3,
  spacing = 4,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  const createDotAnimation = (delay: number) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const dotAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 600,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      dotAnimation.start();
      return () => dotAnimation.stop();
    }, [animatedValue, delay]);

    return animatedValue;
  };

  return (
    <View style={[styles.dotsContainer, style]}>
      {Array.from({ length: count }, (_, index) => {
        const animatedValue = createDotAnimation(index * 200);
        const translateY = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                backgroundColor: finalColor,
                borderRadius: size / 2,
                transform: [{ translateY }],
                marginLeft: index > 0 ? spacing : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Bar Loader
export interface BarProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
  count?: number;
  spacing?: number;
}

export const Bar: React.FC<BarProps> = ({
  width = 4,
  height = 20,
  color,
  style,
  count = 5,
  spacing = 2,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  const createBarAnimation = (delay: number) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const barAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      barAnimation.start();
      return () => barAnimation.stop();
    }, [animatedValue, delay]);

    return animatedValue;
  };

  return (
    <View style={[styles.barContainer, style]}>
      {Array.from({ length: count }, (_, index) => {
        const animatedValue = createBarAnimation(index * 100);
        const scaleY = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                width,
                height,
                backgroundColor: finalColor,
                borderRadius: width / 2,
                transform: [{ scaleY }],
                marginLeft: index > 0 ? spacing : 0,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Circle Loader
export interface CircleProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  strokeWidth?: number;
}

export const Circle: React.FC<CircleProps> = ({
  size = 40,
  color,
  style,
  strokeWidth = 3,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    scaleAnimation.start();
    rotateAnimation.start();

    return () => {
      scaleAnimation.stop();
      rotateAnimation.stop();
    };
  }, [scaleValue, rotateValue]);

  const scale = scaleValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.circleContainer, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderWidth: strokeWidth,
            borderColor: finalColor,
            borderRadius: size / 2,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: [{ scale }, { rotate }],
          },
        ]}
      />
    </View>
  );
};

// Full Screen Loader
export interface FullScreenLoaderProps {
  visible?: boolean;
  message?: string;
  loaderType?: 'spinner' | 'pulse' | 'dots' | 'bar' | 'circle';
  loaderProps?: any;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible = true,
  message,
  loaderType = 'spinner',
  loaderProps = {},
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  if (!visible) return null;

  const renderLoader = () => {
    switch (loaderType) {
      case 'pulse':
        return <Pulse {...loaderProps} />;
      case 'dots':
        return <Dots {...loaderProps} />;
      case 'bar':
        return <Bar {...loaderProps} />;
      case 'circle':
        return <Circle {...loaderProps} />;
      default:
        return <Spinner {...loaderProps} />;
    }
  };

  return (
    <View style={[styles.fullScreenLoader, { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
      <View style={styles.fullScreenLoaderContent}>
        {renderLoader()}
        {message && (
          <View style={styles.fullScreenLoaderMessage}>
            <Typography variant="bodyText" style={styles.messageText}>
              {message}
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
};

// Inline Loader - for use within components
export interface InlineLoaderProps {
  visible?: boolean;
  size?: number;
  color?: string;
  type?: 'spinner' | 'pulse' | 'dots';
  style?: ViewStyle;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  visible = true,
  size = 16,
  color,
  type = 'spinner',
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const finalColor = color || (isDark ? Colors.brand.primaryLight : Colors.brand.primary);
  
  if (!visible) return null;

  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return <Pulse size={size} color={finalColor} count={2} />;
      case 'dots':
        return <Dots size={size} color={finalColor} count={3} />;
      default:
        return <Spinner size={size} color={finalColor} strokeWidth={2} />;
    }
  };

  return (
    <View style={[styles.inlineLoader, style]}>
      {renderLoader()}
    </View>
  );
};

// Import Typography for FullScreenLoader
import { Typography } from './Typography';

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    marginHorizontal: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    // Dot styles are applied inline
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bar: {
    // Bar styles are applied inline
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    // Circle styles are applied inline
  },
  fullScreenLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  fullScreenLoaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreenLoaderMessage: {
    marginTop: 16,
  },
  messageText: {
    textAlign: 'center',
    // color set dynamically inline
  },
  inlineLoader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
