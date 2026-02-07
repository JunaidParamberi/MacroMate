import { Card, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

const activeGoals = [
  {
    id: '1',
    title: 'Daily Steps',
    target: '10,000',
    current: '8,420',
    unit: 'steps',
    progress: 0.84,
    color: Colors.activityColors.steps,
    icon: 'walk',
    deadline: 'Daily',
  },
  {
    id: '2',
    title: 'Weekly Calories',
    target: '15,000',
    current: '12,840',
    unit: 'kcal',
    progress: 0.86,
    color: Colors.activityColors.calories,
    icon: 'flame',
    deadline: '6 days left',
  },
  {
    id: '3',
    title: 'Gym Sessions',
    target: '4',
    current: '3',
    unit: 'sessions',
    progress: 0.75,
    color: Colors.activityColors.gym,
    icon: 'barbell',
    deadline: '2 days left',
  },
];

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
  const themeColors = isDark ? Colors.dark : Colors.light;
  const styles = getStyles(isDark);

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="bodyText" style={styles.dateText}>
              YOUR TARGETS
            </Typography>
            <Typography variant="h2" style={styles.title}>
              Goals
            </Typography>
          </View>
          <Pressable 
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="add" size={24} color={Colors.neutral.white} />
          </Pressable>
        </View>

        <Typography variant="bodyText" style={styles.subtitle}>
          Track your progress and crush your targets
        </Typography>

        {/* Overall Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIconContainer}>
              <Ionicons name="trophy" size={24} color={Colors.brand.primary} />
            </View>
            <View style={styles.progressTextContainer}>
              <Typography variant="h3">Overall Progress</Typography>
              <Typography variant="caption" style={styles.progressSubtitle}>
                3 active goals • 2 completed this month
              </Typography>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '82%' }]} />
            </View>
            <Typography variant="caption" style={styles.progressPercentage}>
              82%
            </Typography>
          </View>
        </Card>

        {/* Weekly Streak */}
        <Container paddingTop="lg">
          <Typography variant="h3" style={styles.sectionTitle}>Weekly Streak</Typography>
          <View style={styles.streakContainer}>
            {weeklyTargets.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View style={[
                  styles.dayCircle,
                  day.completed && { backgroundColor: Colors.brand.primary }
                ]}>
                  {day.completed && (
                    <Ionicons name="checkmark" size={16} color={Colors.neutral.white} />
                  )}
                </View>
                <Typography variant="caption" style={styles.dayLabel}>
                  {day.day}
                </Typography>
              </View>
            ))}
          </View>
        </Container>

        {/* Active Goals */}
        <Container paddingTop="lg">
          <View style={styles.sectionHeader}>
            <Typography variant="h3" style={styles.sectionTitle}>Active Goals</Typography>
            <Pressable>
              <Typography variant="link" style={styles.seeAll}>See All</Typography>
            </Pressable>
          </View>

          <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
            {activeGoals.map((goal) => (
              <Pressable 
                key={goal.id} 
                style={styles.goalCard}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <View style={styles.goalHeader}>
                  <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '15' }]}>
                    <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                  </View>
                  <View style={styles.goalInfo}>
                    <Typography variant="bodyText" style={styles.goalTitle}>
                      {goal.title}
                    </Typography>
                    <Typography variant="caption" style={styles.goalDeadline}>
                      {goal.deadline}
                    </Typography>
                  </View>
                  <View style={styles.goalProgressText}>
                    <Typography variant="bodyText" style={{...styles.goalPercent, color: goal.color}}>
                      {Math.round(goal.progress * 100)}%
                    </Typography>
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
                  <Typography variant="caption" style={styles.goalCurrent}>
                    {goal.current} / {goal.target} {goal.unit}
                  </Typography>
                  <Typography variant="caption" style={styles.goalRemaining}>
                    {Math.round((parseInt(goal.target) - parseInt(goal.current)) * 100) / 100} {goal.unit} remaining
                  </Typography>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Container>

        {/* Completed Goals */}
        <Container paddingTop="lg">
          <Typography variant="h3" style={styles.sectionTitle}>Recently Completed</Typography>
          <View style={styles.completedList}>
            {completedGoals.map((goal, index) => (
              <View key={index} style={styles.completedCard}>
                <View style={[styles.completedIconContainer, { backgroundColor: goal.color + '15' }]}>
                  <Ionicons name={goal.icon as any} size={20} color={goal.color} />
                </View>
                <View style={styles.completedInfo}>
                  <Typography variant="bodyText" style={styles.completedTitle}>
                    {goal.title}
                  </Typography>
                  <Typography variant="caption" style={styles.completedDate}>
                    {goal.date}
                  </Typography>
                </View>
                <Ionicons name="checkmark-circle" size={24} color={Colors.brand.primary} />
              </View>
            ))}
          </View>
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
  },
  dateText: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    textTransform: 'uppercase',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  subtitle: {
    marginBottom: 24,
    fontWeight: '400',
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  progressCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    ...Shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.brand.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressSubtitle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    marginLeft: 12,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
  sectionTitle: {
    marginBottom: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.sm,
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
    marginBottom: 8,
  },
  dayLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 12,
    fontWeight: '500',
  },
  goalsList: {
    maxHeight: 400,
  },
  goalCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  goalDeadline: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 2,
  },
  goalProgressText: {
    alignItems: 'flex-end',
  },
  goalPercent: {
    fontWeight: '700',
    fontSize: 20,
  },
  progressRow: {
    marginBottom: 8,
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
    fontWeight: '500',
  },
  goalRemaining: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
  },
  completedList: {
    gap: 12,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  completedIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedInfo: {
    flex: 1,
  },
  completedTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  completedDate: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginTop: 2,
  },
});
