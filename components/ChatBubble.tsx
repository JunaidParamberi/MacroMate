import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function ChatBubble() {
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);
  
  // Animated style must be defined before any conditional returns
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Don't show on onboarding, trainer screen, or log screens
  const currentPath = segments.join('/');
  const isHidden = 
    currentPath.includes('onboarding') || 
    currentPath.includes('trainer') ||
    currentPath.includes('log/') ||
    currentPath.includes('meal-scan') ||
    currentPath.includes('barcode');
  
  if (isHidden) return null;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1);
    });
    router.push('/trainer');
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable 
        style={[styles.bubble, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]} 
        onPress={handlePress}
      >
        <View style={[styles.avatar, { backgroundColor: Colors.brand.primary }]}>
          <Ionicons name="fitness" size={24} color={Colors.neutral.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Coach Alex
          </Text>
          <Text style={[styles.status, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
            Ask me anything!
          </Text>
        </View>
        <View style={[styles.pulse, { backgroundColor: Colors.brand.primary }]} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingRight: 16,
    ...Shadows.lg,
    shadowColor: Colors.brand.primary,
    shadowOpacity: 0.2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textContainer: {
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    marginTop: 1,
  },
  pulse: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
