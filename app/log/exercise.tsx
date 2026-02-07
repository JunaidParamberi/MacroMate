import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

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
  const [selectedType, setSelectedType] = useState('running');
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  const selectedExercise = exerciseTypes.find(e => e.id === selectedType);
  const estimatedCalories = selectedExercise 
    ? Math.round(selectedExercise.calories * (parseInt(duration) || 0) / 60 * (intensity === 'low' ? 0.8 : intensity === 'high' ? 1.2 : 1))
    : 0;

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
        <Pressable style={[styles.logButton, { backgroundColor: selectedExercise?.color || Colors.brand.primary }]}>
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
    marginBottom: 24,
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
    marginBottom: 12,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  exerciseCard: {
    width: '31%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Shadows.sm,
    position: 'relative',
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  durationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  durationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral[200],
  },
  durationInput: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 100,
  },
  quickDurations: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  quickDuration: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  caloriesCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Shadows.sm,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  workoutLeft: {
    flex: 1,
  },
  logButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  logText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
});
