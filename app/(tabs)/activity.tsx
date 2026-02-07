import { ActivityListContainer, ActivityListItem, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

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
  const themeColors = isDark ? Colors.dark : Colors.light;
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredActivities = activeFilter === 'All' 
    ? recentActivities 
    : recentActivities.filter(activity => activity.category === activeFilter);

  const handleFilterPress = (filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filter);
  };

  const styles = getStyles(isDark);

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typography variant="bodyText" style={styles.dateText}>
              THIS WEEK
            </Typography>
            <Typography variant="h2">
              Activity
            </Typography>
          </View>
          <Pressable 
            style={styles.addButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/modal');
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <Typography variant="bodyText" style={styles.subtitle}>
          Track your workouts and stay consistent
        </Typography>

        {/* Weekly Stats Cards */}
        <View style={styles.statsContainer}>
          {weeklyStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={`${stat.icon}-outline` as any} size={20} color={stat.color} />
              </View>
              <Typography variant="h3" style={styles.statValue}>
                {stat.value}
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>
                {stat.label}
              </Typography>
              <Typography variant="caption" style={styles.statUnit}>
                {stat.unit}
              </Typography>
            </View>
          ))}
        </View>

        {/* Progress Card */}
        <Container paddingTop='lg'>
          <ActivityCard
            theme="calories"
            title="Weekly Goal"
            value="8,420"
            goal="/ 10,000 kcal"
            additionalInfo="+12%"
            progress={0.84}
            variant="featured"
            icon="flame"
            iconBackgroundColor={Colors.activityColors.calories}
            progressColor={Colors.activityColors.calories}
            additionalInfoColor={Colors.activityColors.calories}
          />
        </Container>

        {/* Filters */}
        <View style={styles.filterSection}>
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
            {activityFilters.map((filter) => (
              <Pressable
                key={filter}
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
            ))}
          </ScrollView>
        </View>

        {/* Activity List */}
        <ActivityListContainer style={styles.listContainer}>
          {filteredActivities.map((activity) => (
            <ActivityListItem
              key={activity.id}
              title={activity.title}
              subtitle={activity.subtitle}
              icon={activity.icon}
              iconLibrary={activity.iconLibrary}
              onPress={() => console.log('Pressed', activity.title)}
              iconBackgroundColor={activity.iconBackgroundColor}
              iconColor={activity.iconColor}
              showArrow={true}
            />
          ))}
        </ActivityListContainer>

        {/* Empty State if no activities */}
        {filteredActivities.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color="#64748B" />
            <Typography variant="bodyText" style={styles.emptyText}>
              No activities found for this filter
            </Typography>
          </View>
        )}
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 24,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  statLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginBottom: 2,
    fontSize: 12,
  },
  statUnit: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    fontSize: 11,
  },
  filterSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
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
    fontSize: 14,
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
  },
  emptyText: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[500],
    marginTop: 12,
  },
});
