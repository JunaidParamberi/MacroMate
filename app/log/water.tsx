import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { useDailyLogStore } from '@/store/dailyLog';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const CUP_SIZE = 250; // ml

export default function WaterLogScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const addWater = useDailyLogStore((state) => state.addWater);
  
  const [cups, setCups] = useState(0);
  const [goal] = useState(8); // 8 cups goal
  
  const waterHeight = useSharedValue(0);

  React.useEffect(() => {
    waterHeight.value = withSpring((cups / goal) * 200, {
      damping: 12,
      stiffness: 100,
    });
  }, [cups]);

  const animatedWaterStyle = useAnimatedStyle(() => ({
    height: waterHeight.value,
  }));

  const addCup = () => setCups(Math.min(cups + 1, goal + 4));
  const removeCup = () => setCups(Math.max(cups - 1, 0));

  const handleLogWater = () => {
    if (cups === 0) {
      Alert.alert('No Water', 'Please add at least one cup of water');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const totalMl = cups * CUP_SIZE;
    addWater(totalMl);
    
    Alert.alert(
      'Water Logged!',
      `${totalMl}ml (${cups} cups) added to your daily log.`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Log Water
          </Typography>
          <View style={{ width: 44 }} />
        </Animated.View>

        {/* Water Visualization */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.waterContainer}>
          <View style={[styles.glass, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[200] }]}>
            <Animated.View style={[styles.water, animatedWaterStyle]} />
            
            {/* Measurement Lines */}
            {[25, 50, 75, 100].map((mark) => (
              <View key={mark} style={[styles.measurementLine, { bottom: mark * 2 }]}>
                <View style={[styles.line, { backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[400] }]} />
                <Typography variant="caption" style={{ color: isDark ? Colors.neutral[500] : Colors.neutral[500] }}>
                  {mark}%
                </Typography>
              </View>
            ))}
          </View>
          
          <Typography variant="h1" style={[styles.cupCount, { color: Colors.activityColors.active }]}>
            {cups}
          </Typography>
          <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
            cups of {CUP_SIZE}ml
          </Typography>
          <Typography variant="h3" style={{ marginTop: 8, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
            {cups * CUP_SIZE}ml / {goal * CUP_SIZE}ml
          </Typography>
        </Animated.View>

        {/* Controls */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.controls}>
          <Pressable style={[styles.controlButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} onPress={removeCup}>
            <Ionicons name="remove" size={24} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          
          <Pressable style={[styles.addButton, { backgroundColor: Colors.activityColors.active }]} onPress={addCup}>
            <Ionicons name="water" size={32} color={Colors.neutral.white} />
          </Pressable>
          
          <Pressable style={[styles.controlButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} onPress={addCup}>
            <Ionicons name="add" size={24} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
        </Animated.View>

        {/* Presets */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.presetsContainer}>
          <Typography variant="metaLabel" style={{ marginBottom: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
            Quick Add
          </Typography>
          <View style={styles.presets}>
            {[1, 2, 3].map((num, index) => (
              <Animated.View key={num} entering={FadeIn.delay(350 + index * 40)} style={{ flex: 1 }}>
                <Pressable
                  style={[styles.presetButton, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}
                  onPress={() => setCups(cups + num)}
                >
                  <Ionicons name="water" size={20} color={Colors.activityColors.active} />
                  <Typography variant="caption" style={{ marginLeft: 6, color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                    +{num}
                  </Typography>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* History */}
        <Animated.View entering={FadeIn.delay(400)} style={[styles.historyCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
          <Typography variant="h3" style={{ marginBottom: 12, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
            Today's Log
          </Typography>
          {cups > 0 ? (
            Array.from({ length: Math.min(cups, 5) }).map((_, i) => (
              <View key={i} style={styles.logItem}>
                <Ionicons name="water" size={20} color={Colors.activityColors.active} />
                <Typography variant="bodyText" style={{ marginLeft: 12, flex: 1, color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                  {CUP_SIZE}ml
                </Typography>
                <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[500] : Colors.neutral[500] }}>
                  {9 + i}:00 AM
                </Typography>
              </View>
            ))
          ) : (
            <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[500] : Colors.neutral[500] }}>
              No water logged yet today
            </Typography>
          )}
        </Animated.View>

        {/* Save Button */}
        <Animated.View entering={FadeInUp.delay(500)}>
          <Pressable 
            style={[styles.saveButton, { backgroundColor: Colors.activityColors.active }]} 
            onPress={handleLogWater}
          >
            <Typography variant="bodyText" style={styles.saveText}>Log Water</Typography>
          </Pressable>
        </Animated.View>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 4,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  waterContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  glass: {
    width: 120,
    height: 200,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.activityColors.active,
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.activityColors.active,
    opacity: 0.85,
  },
  measurementLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    marginRight: 8,
  },
  cupCount: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  presetsContainer: {
    marginBottom: 20,
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
  },
  presetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  saveButton: {
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 15,
  },
});
