import { ActivityListContainer, ActivityListItem, AITipCard, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { Colors, Shadows } from '@/constants/theme';
import { geminiService } from '@/services/gemini';
import { useDailyLogStore } from '@/store/dailyLog';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const quickActions = [
  { icon: 'walk', label: 'Run', color: Colors.activityColors.running },
  { icon: 'bicycle', label: 'Cycle', color: Colors.activityColors.cycling },
  { icon: 'barbell', label: 'Gym', color: Colors.activityColors.gym },
  { icon: 'water', label: 'Water', color: '#3B82F6' },
];

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  
  const { 
    dailyCalorieTarget, 
    projectedMilestone, 
    primaryGoal,
    proteinTarget,
    streakDays = 5 
  } = useUserProfileStore();

  // Subscribe to store changes for real-time updates
  const dailyLogStore = useDailyLogStore();
  const todaysTotals = dailyLogStore.getTodaysTotals();
  const todaysFood = dailyLogStore.getTodaysFood();
  const todaysExercise = dailyLogStore.getTodaysExercise();
  const todaysWater = dailyLogStore.getTodaysWater();
  const todaysSteps = dailyLogStore.getTodaysSteps();
  const todaysActiveMinutes = dailyLogStore.getTodaysActiveMinutes();

  const [aiInsight, setAiInsight] = useState<{ title: string; message: string; action?: string; type: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  const generateInsight = useCallback(async () => {
    setLoadingInsight(true);
    try {
      const insight = await geminiService.generateDailyInsight({
        goal: primaryGoal || 'maintain',
        dailyCalories: dailyCalorieTarget,
        consumedCalories: todaysTotals.calories,
        remainingCalories: Math.max(0, dailyCalorieTarget - todaysTotals.calories + todaysTotals.exercise),
        proteinConsumed: todaysTotals.protein,
        proteinTarget: proteinTarget,
        streakDays: streakDays,
      });
      setAiInsight(insight);
    } catch (error) {
      console.error('Failed to generate insight:', error);
      setAiInsight({
        title: 'Keep Going!',
        message: `You've logged ${todaysTotals.calories} calories today. Stay on track!`,
        type: 'tip',
      });
    } finally {
      setLoadingInsight(false);
    }
  }, [dailyCalorieTarget, primaryGoal, proteinTarget, streakDays, todaysTotals.calories, todaysTotals.protein, todaysTotals.exercise]);

  useEffect(() => {
    generateInsight();
    // Only run once on mount, not when generateInsight changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remainingCalories = dailyCalorieTarget - todaysTotals.calories + todaysTotals.exercise;

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View>
            <Typography variant="bodyText" style={styles.dateText}>
              TODAY
            </Typography>
            <Typography variant="h2" style={styles.greeting}>
              Hey, Champion! 
            </Typography>
          </View>
          <Pressable 
            style={styles.notificationButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="notifications-outline" size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
            <View style={styles.notificationBadge} />
          </Pressable>
        </Animated.View>

        {/* Main Stats Card - Featured */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.featuredSection}>
          <ActivityCard
            theme="calories"
            title="Daily Calories"
            value={todaysTotals.calories.toLocaleString()}
            goal={`/ ${dailyCalorieTarget.toLocaleString()} kcal`}
            progress={Math.min(todaysTotals.calories / dailyCalorieTarget, 1)}
            variant="featured"
            icon="flame"
            iconBackgroundColor={Colors.activityColors.calories}
            progressColor={Colors.activityColors.calories}
            additionalInfoColor={Colors.activityColors.calories}
            foodValue={`${todaysTotals.calories} kcal`}
            exerciseValue={`${todaysTotals.exercise} kcal`}
            baseGoalValue={`${Math.max(0, dailyCalorieTarget - todaysTotals.calories + todaysTotals.exercise).toLocaleString()} kcal`}
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.quickActionsSection}>
          <Typography variant="h3" style={styles.sectionTitle}>Quick Log</Typography>
          <View style={styles.quickActionsRow}>
            {quickActions.map((action, index) => (
              <Animated.View key={index} entering={FadeIn.delay(250 + index * 40)}>
                <Pressable
                  style={styles.quickActionButton}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Typography variant="caption" style={styles.quickActionLabel}>
                    {action.label}
                  </Typography>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Secondary Stats */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.secondaryStats}>
          <View style={styles.statCardHalf}>
            <ActivityCard
              theme="steps"
              title="Steps"
              value={todaysSteps.toLocaleString()}
              additionalInfo="today"
              progress={Math.min(todaysSteps / 10000, 1)}
              variant="compact"
              showGoal={false}
              showProgressBar={true}
              iconBackgroundColor={Colors.activityColors.steps}
            />
          </View>
          <View style={styles.statCardHalf}>
            <ActivityCard
              theme="active"
              title="Active"
              value={`${todaysActiveMinutes} min`}
              additionalInfo="today"
              progress={Math.min(todaysActiveMinutes / 60, 1)}
              variant="compact"
              showGoal={false}
              showProgressBar={true}
              iconBackgroundColor={Colors.activityColors.active}
            />
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Typography variant="h3" style={styles.sectionTitle}>Recent Activity</Typography>
            <Pressable onPress={() => router.push('/activity')}>
              <Typography variant="link" style={styles.seeAll}>See All</Typography>
            </Pressable>
          </View>
          
          <ActivityListContainer>
            {todaysFood.slice(0, 3).map((food, index) => (
              <Animated.View key={food.id} entering={FadeIn.delay(450 + index * 50)}>
                <ActivityListItem
                  title={food.name}
                  subtitle={`${food.calories} kcal • ${food.protein}g protein • ${food.carbs}g carbs`}
                  icon="restaurant"
                  iconLibrary="ionicons"
                  onPress={() => console.log('Pressed', food.name)}
                  iconBackgroundColor={Colors.activityColors.calories + '20'}
                  iconColor={Colors.activityColors.calories}
                />
              </Animated.View>
            ))}
            {todaysExercise.slice(0, 3).map((exercise, index) => (
              <Animated.View key={exercise.id} entering={FadeIn.delay(500 + index * 50)}>
                <ActivityListItem
                  title={exercise.name}
                  subtitle={`${exercise.calories} kcal • ${Math.round(exercise.duration)} min`}
                  icon="fitness"
                  iconLibrary="ionicons"
                  onPress={() => console.log('Pressed', exercise.name)}
                  iconBackgroundColor={Colors.activityColors.running + '20'}
                  iconColor={Colors.activityColors.running}
                />
              </Animated.View>
            ))}
            {todaysFood.length === 0 && todaysExercise.length === 0 && (
              <Animated.View entering={FadeIn.delay(450)}>
                <ActivityListItem
                  title="No activity yet"
                  subtitle="Log your first meal or workout to get started"
                  icon="add-circle"
                  iconLibrary="ionicons"
                  onPress={() => router.push('/log/food')}
                  iconBackgroundColor={Colors.neutral[300] + '20'}
                  iconColor={Colors.neutral[500]}
                />
              </Animated.View>
            )}
          </ActivityListContainer>
        </Animated.View>

        {/* AI Insight */}
        <Animated.View entering={FadeInUp.delay(550)}>
          <Container paddingTop="lg">
            <AITipCard
              title={aiInsight?.title || (loadingInsight ? 'Analyzing...' : 'Daily Insight')}
              tip={aiInsight?.message || (loadingInsight ? 'Generating personalized insights based on your data...' : projectedMilestone || 'Keep going!')}
              category={aiInsight?.type === 'achievement' ? 'Success' : aiInsight?.type === 'warning' ? 'Alert' : aiInsight?.action || 'Tip'}
              aiType={(aiInsight?.type === 'warning' ? 'general' : aiInsight?.type === 'achievement' ? 'nutrition' : 'tip') as any}
              aiConfidence={0.9}
              priority={aiInsight?.type === 'warning' ? 'high' : 'medium'}
            />
          </Container>
        </Animated.View>
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    letterSpacing: -0.3,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.accent,
    borderWidth: 2,
    borderColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
  },
  featuredSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    fontWeight: '600',
    fontSize: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Shadows.sm,
  },
  quickActionLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    fontWeight: '600',
    fontSize: 13,
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCardHalf: {
    flex: 1,
  },
  activitySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
});
