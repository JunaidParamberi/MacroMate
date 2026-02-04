import React, { useEffect, useRef, ReactNode } from 'react';
import { Animated, ViewStyle } from 'react-native';

export interface SpringAnimationProps {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export const SpringAnimation: React.FC<SpringAnimationProps> = ({
  children,
  delay = 0,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 7,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 7,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
