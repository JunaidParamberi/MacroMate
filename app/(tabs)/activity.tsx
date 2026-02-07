import { ActivityListContainer, ActivityListItem, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { Colors, Shadows } from '@/constants/theme';
import { useDailyLogStore } from '@/store/dailyLog';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const activityFilters = ['All', 'Running', 'Cycling', 'Walking', 'Gym'];

const recentActivities = [
  {
    id: '1',
    title: 'Morning Run',
    subtitle: '5.2 km • 28 min • 320 kcal',
    icon: 'walk',
    iconLibrary: 'ionicons' as const,
    iconBackgroundColor: Colors.activityColors.running + '20',
    iconColor: Colors.activityColors.running,
    category: 'Running',
    date: 'Today, 7:30 AM',
  },
  {
    id: '2',
    title: 'Cycling',
    subtitle: '12.8 km • 45 min • 420 kcal',
    icon: 'bicycle',
    iconLibrary: 'ionicons' as const,
    iconBackgroundColor: Colors.activityColors.cycling + '20',
    iconColor: Colors.activityColors.cycling,
    category: 'Cycling',
    date: 'Yesterday, 6:00 PM',
  },
  {
    id: '3',
    title: 'Evening Walk',
    subtitle: '3.1 km • 35 min • 180 kcal',
    icon: 'walk',
    iconLibrary: 'ionicons' as const,
    iconBackgroundColor: Colors.activityColors.walking + '20',
    iconColor: Colors.activityColors.walking,
    category: 'Walking',
    date: 'Yesterday, 8:30 PM',
  },
  {
    id: '4',
    title: 'Gym Workout',
    subtitle: 'Strength • 55 min • 280 kcal',
    icon: 'barbell',
    iconLibrary: 'ionicons' as const,
    iconBackgroundColor: Colors.activityColors.gym + '20',
    iconColor: Colors.activityColors.gym,
    category: 'Gym',
    date: 'Mon, 5:30 PM',
  },
  {
    id: '5',
    title: 'Morning Run',
    subtitle: '4.5 km • 25 min • 290 kcal',
    icon: 'walk',
    iconLibrary: 'ionicons' as const,
    iconBackgroundColor: Colors.activityColors.running + '20',
    iconColor: Colors.activityColors.running,
    category: 'Running',
    date: 'Sun, 7:00 AM',
  },
];

const weeklyStats = [
  { label: 'Workouts', value: '12', unit: 'sessions', icon: 'calendar', color: Colors.brand.primary },
  { label: 'Calories', value: '8,420', unit: 'kcal', icon: 'flame', color: Colors.activityColors.calories },
  { label: 'Duration', value: '6.5', unit: 'hours', icon: 'time', color: Colors.activityColors.active },
];

export default function ActivityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { dailyCalorieTarget, proteinTarget, carbsTarget, fatsTarget } = useUserProfileStore();
  const { getTodaysExercise, getTodaysTotals, getTodaysSteps, getTodaysActiveMinutes } = useDailyLogStore();
  
  const todaysExercise = getTodaysExercise();
  const todaysTotals = getTodaysTotals();
  const todaysSteps = getTodaysSteps();
  const todaysActiveMinutes = getTodaysActiveMinutes();

  const totalWorkouts = todaysExercise.length;
  const totalCaloriesBurned = todaysTotals.exercise;
  const totalDuration = todaysExercise.reduce((sum, e) => sum + e.duration, 0) / 60; // in hours

  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  const filteredActivities = activeFilter === 'All' 
    ? todaysExercise 
    : todaysExercise.filter(exercise => exercise.type === activeFilter.toLowerCase());

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <View>
            <Typography variant="bodyText" style={styles.dateText}>TODAY</Typography>
            <Typography variant="h2">Activity</Typography>
          </View>
          <Pressable style={styles.addButton} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/modal'); }}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </Animated.View>

        <Typography variant="bodyText" style={styles.subtitle}>
          Track your workouts and stay consistent
        </Typography>

        {/* Today's Stats Cards */}
        <View style={styles.statsContainer}>
          {[
            { label: 'Workouts', value: totalWorkouts.toString(), unit: 'sessions', icon: 'calendar', color: Colors.brand.primary },
            { label: 'Calories', value: Math.round(totalCaloriesBurned).toLocaleString(), unit: 'kcal', icon: 'flame', color: Colors.activityColors.calories },
            { label: 'Duration', value: totalDuration.toFixed(1), unit: 'hours', icon: 'time', color: Colors.activityColors.active },
          ].map((stat, index) => (
            <Animated.View key={index} entering={FadeInUp.delay(index * 50).duration(300)} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={`${stat.icon}-outline` as any} size={20} color={stat.color} />
              </View>
              <Typography variant="h3" style={styles.statValue}>{stat.value}</Typography>
              <Typography variant="caption" style={styles.statLabel}>{stat.label}</Typography>
              <Typography variant="caption" style={styles.statUnit}>{stat.unit}</Typography>
            </Animated.View>
          ))}
        </View>

        {/* Progress Card */}
        <Container paddingTop='lg'>
          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <ActivityCard
              theme="calories"
              title="Daily Calories"
              value={todaysTotals.calories.toLocaleString()}
              goal={`/ ${dailyCalorieTarget.toLocaleString()} kcal`}
              additionalInfo={`${Math.max(0, dailyCalorieTarget - todaysTotals.calories + todaysTotals.exercise).toLocaleString()} remaining`}
              progress={Math.min(todaysTotals.calories / dailyCalorieTarget, 1)}
              variant="featured"
              icon="flame"
              iconBackgroundColor={Colors.activityColors.calories}
              progressColor={Colors.activityColors.calories}
              additionalInfoColor={Colors.activityColors.calories}
            />
          </Animated.View>
        </Container>

        {/* Filters */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Typography variant="h2">Recent Activities</Typography>
            <Typography variant="link">See All</Typography>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {activityFilters.map((filter, index) => (
              <Animated.View key={filter} entering={FadeIn.delay(350 + index * 30)}>
                <Pressable
                  style={activeFilter === filter ? {...styles.filterChip, ...styles.filterChipActive} : styles.filterChip}
                  onPress={() => handleFilterPress(filter)}
                >
                  <Typography 
                    variant="bodyText" 
                    style={activeFilter === filter ? {...styles.filterText, ...styles.filterTextActive} : styles.filterText}
                  >
                    {filter}
                  </Typography>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Activity List */}
        <ActivityListContainer style={styles.listContainer}>
          {todaysExercise.length > 0 ? todaysExercise.map((exercise, index) => (
            <Animated.View key={exercise.id} entering={FadeInUp.delay(400 + index * 40).duration(300)}>
              <ActivityListItem
                title={exercise.name}
                subtitle={`${exercise.calories} kcal • ${Math.round(exercise.duration)} min • ${exercise.type}`}
                icon={exercise.type === 'cardio' ? 'walk' : exercise.type === 'strength' ? 'barbell' : 'fitness'}
                iconLibrary="ionicons"
                onPress={() => console.log('Pressed', exercise.name)}
                iconBackgroundColor={Colors.activityColors.gym + '20'}
                iconColor={Colors.activityColors.gym}
                showArrow={true}
              />
            </Animated.View>
          )) : (
            <Animated.View entering={FadeIn.delay(400)} style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={48} color={isDark ? Colors.neutral[600] : '#64748B'} />
              <Typography variant="bodyText" style={styles.emptyText}>
                No workouts logged today. Tap + to add one!
              </Typography>
            </Animated.View>
          )}
        </ActivityListContainer>
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
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 22,
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    letterSpacing: -0.3,
  },
  statLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginBottom: 2,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statUnit: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    fontSize: 10,
    fontWeight: '400',
  },
  filterSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
  },
  filterChipActive: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  filterText: {
    fontSize: 13,
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.neutral.white,
  },
  listContainer: {
    flexDirection: 'column',
    gap: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    borderRadius: 16,
    marginTop: 12,
  },
  emptyText: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[500],
    marginTop: 12,
    fontSize: 14,
    fontWeight: '400',
  },
});
