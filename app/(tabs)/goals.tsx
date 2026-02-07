import { Card, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { useDailyLogStore } from '@/store/dailyLog';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const weeklyTargets = [
  { day: 'Mon', completed: true },
  { day: 'Tue', completed: true },
  { day: 'Wed', completed: true },
  { day: 'Thu', completed: false },
  { day: 'Fri', completed: false },
  { day: 'Sat', completed: false },
  { day: 'Sun', completed: false },
];

const completedGoals = [
  { title: 'First 5K Run', date: 'Completed Jan 15', icon: 'trophy', color: '#F59E0B' },
  { title: '30-Day Streak', date: 'Completed Dec 28', icon: 'flame', color: '#EF4444' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  
  const { dailyCalorieTarget, targetWeight, currentWeight, primaryGoal, projectedMilestone, streakDays } = useUserProfileStore();
  const { getTodaysTotals, getTodaysExercise } = useDailyLogStore();
  
  const todaysTotals = getTodaysTotals();
  const todaysExercise = getTodaysExercise();
  
  const goalLabels: Record<string, string> = {
    lose_weight: 'Lose Weight',
    maintain_weight: 'Maintain Weight',
    build_muscle: 'Build Muscle',
    improve_endurance: 'Improve Endurance',
  };
  
  // Calculate real goal progress
  const calorieProgress = Math.min(todaysTotals.calories / dailyCalorieTarget, 1);
  const weightProgress = currentWeight > 0 && targetWeight > 0 
    ? Math.min(1, Math.abs(currentWeight - targetWeight) / currentWeight)
    : 0;
  
  // Count exercise sessions this week (simplified - just today's for now)
  const exerciseCount = todaysExercise.length;
  const exerciseTarget = 4; // Could be made configurable
  const exerciseProgress = Math.min(exerciseCount / exerciseTarget, 1);
  
  const activeGoals = [
    {
      id: '1',
      title: 'Daily Calories',
      target: dailyCalorieTarget.toLocaleString(),
      current: todaysTotals.calories.toLocaleString(),
      unit: 'kcal',
      progress: calorieProgress,
      color: Colors.activityColors.calories,
      icon: 'flame',
      deadline: 'Daily',
    },
    {
      id: '2',
      title: goalLabels[primaryGoal || ''] || 'Weight Goal',
      target: `${targetWeight} kg`,
      current: `${currentWeight} kg`,
      unit: 'kg',
      progress: weightProgress,
      color: Colors.brand.primary,
      icon: 'fitness',
      deadline: projectedMilestone || 'In progress',
    },
    {
      id: '3',
      title: 'Workouts',
      target: exerciseTarget.toString(),
      current: exerciseCount.toString(),
      unit: 'sessions',
      progress: exerciseProgress,
      color: Colors.activityColors.gym,
      icon: 'barbell',
      deadline: `${exerciseTarget - exerciseCount} remaining`,
    },
  ];

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View>
            <Typography variant="bodyText" style={styles.dateText}>YOUR TARGETS</Typography>
            <Typography variant="h2" style={styles.title}>Goals</Typography>
          </View>
          <Pressable style={styles.addButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
            <Ionicons name="add" size={24} color={Colors.neutral.white} />
          </Pressable>
        </Animated.View>

        <Typography variant="bodyText" style={styles.subtitle}>
          Track your progress and crush your targets
        </Typography>

        {/* Overall Progress Card */}
        <Animated.View entering={FadeIn.delay(100)}>
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressIconContainer}>
                <Ionicons name="trophy" size={24} color={Colors.brand.primary} />
              </View>
              <View style={styles.progressTextContainer}>
                <Typography variant="h3">Overall Progress</Typography>
                <Typography variant="caption" style={styles.progressSubtitle}>{streakDays || 0} day streak • {activeGoals.length} active goals</Typography>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${(calorieProgress * 100)}%` }]} />
              </View>
              <Typography variant="caption" style={styles.progressPercentage}>{Math.round(calorieProgress * 100)}%</Typography>
            </View>
          </Card>
        </Animated.View>

        {/* Weekly Streak */}
        <Container paddingTop="lg">
          <Animated.View entering={FadeIn.delay(200)}>
            <Typography variant="h3" style={styles.sectionTitle}>Weekly Streak</Typography>
            <View style={styles.streakContainer}>
              {weeklyTargets.map((day, index) => (
                <Animated.View key={index} entering={FadeIn.delay(250 + index * 40)} style={styles.dayContainer}>
                  <View style={[styles.dayCircle, day.completed && { backgroundColor: Colors.brand.primary }]}>
                    {day.completed && <Ionicons name="checkmark" size={16} color={Colors.neutral.white} />}
                  </View>
                  <Typography variant="caption" style={styles.dayLabel}>{day.day}</Typography>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </Container>

        {/* Active Goals */}
        <Container paddingTop="lg">
          <Animated.View entering={FadeInUp.delay(300)}>
            <View style={styles.sectionHeader}>
              <Typography variant="h3" style={styles.sectionTitle}>Active Goals</Typography>
              <Pressable><Typography variant="link" style={styles.seeAll}>See All</Typography></Pressable>
            </View>
            <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
              {activeGoals.map((goal, index) => (
                <Animated.View key={goal.id} entering={FadeIn.delay(350 + index * 50)}>
                  <Pressable style={styles.goalCard} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '15' }]}>
                        <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                      </View>
                      <View style={styles.goalInfo}>
                        <Typography variant="bodyText" style={styles.goalTitle}>{goal.title}</Typography>
                        <Typography variant="caption" style={styles.goalDeadline}>{goal.deadline}</Typography>
                      </View>
                      <View style={styles.goalProgressText}>
                        <Typography variant="bodyText" style={{...styles.goalPercent, color: goal.color}}>{Math.round(goal.progress * 100)}%</Typography>
                      </View>
                    </View>
                    <View style={styles.progressRow}>
                      <View style={styles.progressBarWrapper}>
                        <View style={styles.goalProgressBackground}>
                          <View style={[styles.goalProgressFill, { width: `${goal.progress * 100}%`, backgroundColor: goal.color }]} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.goalStats}>
                      <Typography variant="caption" style={styles.goalCurrent}>{goal.current} / {goal.target} {goal.unit}</Typography>
                      <Typography variant="caption" style={styles.goalRemaining}>{Math.round((parseInt(goal.target) - parseInt(goal.current)) * 100) / 100} {goal.unit} remaining</Typography>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </Container>

        {/* Completed Goals */}
        <Container paddingTop="lg">
          <Animated.View entering={FadeInUp.delay(400)}>
            <Typography variant="h3" style={styles.sectionTitle}>Recently Completed</Typography>
            <View style={styles.completedList}>
              {completedGoals.map((goal, index) => (
                <Animated.View key={index} entering={FadeIn.delay(450 + index * 50)} style={styles.completedCard}>
                  <View style={[styles.completedIconContainer, { backgroundColor: goal.color + '15' }]}>
                    <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                  </View>
                  <View style={styles.completedInfo}>
                    <Typography variant="bodyText" style={styles.completedTitle}>{goal.title}</Typography>
                    <Typography variant="caption" style={styles.completedDate}>{goal.date}</Typography>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.brand.primary} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </Container>
      </ScreenContent>
    </Screen>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingTop: 4,
  },
  dateText: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    letterSpacing: -0.3,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  subtitle: {
    marginBottom: 20,
    fontWeight: '400',
    fontSize: 14,
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    lineHeight: 20,
  },
  progressCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.brand.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressSubtitle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 4,
    fontSize: 13,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 5,
  },
  progressPercentage: {
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 14,
    color: Colors.brand.primary,
  },
  sectionTitle: {
    marginBottom: 12,
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.brand.primary,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 11,
    fontWeight: '500',
  },
  goalsList: {
    maxHeight: 400,
  },
  goalCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  goalDeadline: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 4,
    fontSize: 13,
  },
  goalProgressText: {
    alignItems: 'flex-end',
  },
  goalPercent: {
    fontWeight: '800',
    fontSize: 24,
  },
  progressRow: {
    marginBottom: 12,
  },
  progressBarWrapper: {
    height: 8,
  },
  goalProgressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCurrent: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    fontWeight: '600',
    fontSize: 13,
  },
  goalRemaining: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    fontSize: 13,
  },
  completedList: {
    gap: 12,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  completedIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  completedInfo: {
    flex: 1,
  },
  completedTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  completedDate: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 4,
    fontSize: 13,
  },
});
