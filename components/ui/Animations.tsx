import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring
} from 'react-native-reanimated';

interface AnimatedItemProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoom' | 'bounce' | 'flip';
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  index = 0,
  delay = 0,
  style,
  animation = 'slideUp',
}) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    const baseDelay = delay + index * 50;
    
    translateY.value = withDelay(
      baseDelay,
      withSpring(0, { damping: 15, stiffness: 150 })
    );
    opacity.value = withDelay(
      baseDelay,
      withSpring(1, { damping: 15, stiffness: 150 })
    );
    scale.value = withDelay(
      baseDelay,
      withSpring(1, { damping: 15, stiffness: 150 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'slideUp':
        return {
          transform: [{ translateY: translateY.value }],
          opacity: opacity.value,
        };
      case 'slideDown':
        return {
          transform: [{ translateY: -translateY.value }],
          opacity: opacity.value,
        };
      case 'zoom':
        return {
          transform: [{ scale: scale.value }],
          opacity: opacity.value,
        };
      case 'fade':
        return {
          opacity: opacity.value,
        };
      default:
        return {
          transform: [{ translateY: translateY.value }],
          opacity: opacity.value,
        };
    }
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  style?: ViewStyle;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 50,
  style,
}) => {
  return (
    <Animated.View
      style={style}
      entering={FadeIn.duration(300)}
    >
      {React.Children.map(children, (child, index) => (
        <Animated.View
          key={index}
          entering={FadeInUp
            .duration(400)
            .delay(index * staggerDelay)
            .springify()
            .damping(15)
            .stiffness(150)
          }
        >
          {child}
        </Animated.View>
      ))}
    </Animated.View>
  );
};

// Press scale animation hook
export const usePressAnimation = () => {
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPressIn, onPressOut, animatedStyle };
};

// Pulse animation for attention
export const usePulseAnimation = (duration = 1500) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withSpring(1, { damping: 2, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulse.value,
          [0, 0.5, 1],
          [1, 1.05, 1]
        ),
      },
    ],
  }));

  return animatedStyle;
};

// Number counter animation
export const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  style?: any;
}> = ({ value, duration = 1000, style }) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(value, {
      damping: 15,
      stiffness: 100,
      mass: 1,
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    // Number is handled in render
  }));

  return (
    <Animated.Text style={[style, animatedStyle]}>
      {Math.round(animatedValue.value)}
    </Animated.Text>
  );
};
