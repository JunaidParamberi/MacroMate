import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { useDailyLogStore } from '@/store/dailyLog';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

const exerciseTypes = [
  { id: 'running', name: 'Running', icon: 'walk', color: Colors.activityColors.running, calories: 600 },
  { id: 'cycling', name: 'Cycling', icon: 'bicycle', color: Colors.activityColors.active, calories: 500 },
  { id: 'gym', name: 'Gym Workout', icon: 'barbell', color: Colors.activityColors.gym, calories: 400 },
  { id: 'swimming', name: 'Swimming', icon: 'water', color: Colors.activityColors.active, calories: 550 },
  { id: 'yoga', name: 'Yoga', icon: 'body', color: Colors.brand.primary, calories: 200 },
  { id: 'hiit', name: 'HIIT', icon: 'timer', color: Colors.brand.accent, calories: 700 },
];

const recentExercises = [
  { name: 'Morning Run', duration: 30, calories: 320, date: 'Today' },
  { name: 'Gym Session', duration: 45, calories: 380, date: 'Yesterday' },
];

export default function ExerciseLogScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const addExercise = useDailyLogStore((state) => state.addExercise);
  
  const [selectedType, setSelectedType] = useState('running');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  const selectedExercise = exerciseTypes.find(e => e.id === selectedType);
  const estimatedCalories = selectedExercise 
    ? Math.round(selectedExercise.calories * (parseInt(duration) || 0) / 60 * (intensity === 'low' ? 0.8 : intensity === 'high' ? 1.2 : 1))
    : 0;

  const handleLogWorkout = () => {
    if (!selectedExercise || !duration) {
      Alert.alert('Missing Info', 'Please select exercise type and duration');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Map exercise ID to the correct type
    const typeMap: Record<string, 'cardio' | 'strength' | 'sports'> = {
      running: 'cardio',
      cycling: 'cardio',
      gym: 'strength',
      swimming: 'sports',
      yoga: 'strength',
      hiit: 'cardio',
    };
    
    addExercise({
      name: selectedExercise.name,
      type: typeMap[selectedType] || 'cardio',
      duration: parseInt(duration) || 0,
      calories: estimatedCalories,
    });
    
    Alert.alert(
      'Workout Logged!',
      `${selectedExercise.name} (${estimatedCalories} kcal) added to your daily log.`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Log Exercise
          </Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Exercise Type Grid */}
          <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Exercise Type
          </Typography>
          <View style={styles.exerciseGrid}>
            {exerciseTypes.map((exercise) => (
              <Pressable
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white },
                  selectedType === exercise.id && { borderColor: exercise.color, borderWidth: 2 },
                ]}
                onPress={() => setSelectedType(exercise.id)}
              >
                <View style={[styles.exerciseIcon, { backgroundColor: exercise.color + '20' }]}>
                  <Ionicons name={exercise.icon as any} size={24} color={exercise.color} />
                </View>
                <Typography variant="caption" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600], textAlign: 'center' }}>
                  {exercise.name}
                </Typography>
                {selectedType === exercise.id && (
                  <View style={[styles.selectedDot, { backgroundColor: exercise.color }]} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Duration Input */}
          <View style={[styles.inputCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="metaLabel" style={{ marginBottom: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              Duration (minutes)
            </Typography>
            <View style={styles.durationInputRow}>
              <Pressable style={styles.durationButton} onPress={() => setDuration(Math.max(5, parseInt(duration) - 5).toString())}>
                <Ionicons name="remove" size={20} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
              </Pressable>
              <TextInput
                style={[styles.durationInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
              />
              <Pressable style={styles.durationButton} onPress={() => setDuration((parseInt(duration || '0') + 5).toString())}>
                <Ionicons name="add" size={20} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
              </Pressable>
            </View>
            <View style={styles.quickDurations}>
              {[15, 30, 45, 60].map((min) => (
                <Pressable
                  key={min}
                  style={[styles.quickDuration, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }]}
                  onPress={() => setDuration(min.toString())}
                >
                  <Typography variant="caption" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                    {min}m
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Intensity Selector */}
          <View style={[styles.inputCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="metaLabel" style={{ marginBottom: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              Intensity
            </Typography>
            <View style={styles.intensityRow}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.intensityButton,
                    { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100] },
                    intensity === level && { backgroundColor: selectedExercise?.color + '30' },
                  ]}
                  onPress={() => setIntensity(level)}
                >
                  <Typography
                    variant="caption"
                    style={{
                      color: intensity === level ? selectedExercise?.color : (isDark ? Colors.neutral[300] : Colors.neutral[600]),
                      fontWeight: intensity === level ? '600' : '400',
                      textTransform: 'capitalize',
                    }}
                  >
                    {level}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Calories Preview */}
          <View style={[styles.caloriesCard, { backgroundColor: selectedExercise?.color + '15' }]}>
            <Ionicons name="flame" size={32} color={selectedExercise?.color} />
            <Typography variant="h1" style={{ marginTop: 8, color: selectedExercise?.color }}>
              {estimatedCalories}
            </Typography>
            <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              estimated calories burned
            </Typography>
          </View>

          {/* Recent History */}
          <View style={[styles.historyCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="h3" style={{ marginBottom: 16, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
              Recent Workouts
            </Typography>
            {recentExercises.map((workout, index) => (
              <View key={index} style={styles.workoutItem}>
                <View style={styles.workoutLeft}>
                  <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                    {workout.name}
                  </Typography>
                  <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    {workout.date} • {workout.duration} min
                  </Typography>
                </View>
                <Typography variant="bodyText" style={{ color: Colors.brand.accent, fontWeight: '600' }}>
                  {workout.calories} cal
                </Typography>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Log Button */}
        <Pressable 
          style={[styles.logButton, { backgroundColor: selectedExercise?.color || Colors.brand.primary }]} 
          onPress={handleLogWorkout}
        >
          <Typography variant="bodyText" style={styles.logText}>Log Workout</Typography>
        </Pressable>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 14,
    fontSize: 18,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  exerciseCard: {
    width: '31%',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    ...Shadows.sm,
    position: 'relative',
  },
  exerciseIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inputCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    ...Shadows.sm,
  },
  durationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  durationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationInput: {
    fontSize: 44,
    fontWeight: '800',
    textAlign: 'center',
    minWidth: 100,
    letterSpacing: -1,
  },
  quickDurations: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  quickDuration: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intensityButton: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  caloriesCard: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 24,
    marginBottom: 20,
  },
  historyCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    ...Shadows.sm,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  workoutLeft: {
    flex: 1,
  },
  logButton: {
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  logText: {
    color: Colors.neutral.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
