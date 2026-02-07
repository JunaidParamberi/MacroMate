import { ActivityListContainer, ActivityListItem, AITipCard, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

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
  const themeColors = isDark ? Colors.dark : Colors.light;
  const styles = getStyles(isDark);

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
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
        </View>

        {/* Main Stats Card - Featured */}
        <View style={styles.featuredSection}>
          <ActivityCard
            theme="calories"
            title="Daily Calories"
            value="1,840"
            goal="/ 2,200 kcal"
            additionalInfo="+120 today"
            progress={0.84}
            variant="featured"
            icon="flame"
            iconBackgroundColor={Colors.activityColors.calories}
            progressColor={Colors.activityColors.calories}
            additionalInfoColor={Colors.activityColors.calories}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Typography variant="h3" style={styles.sectionTitle}>Quick Log</Typography>
          <View style={styles.quickActionsRow}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
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
            ))}
          </View>
        </View>

        {/* Secondary Stats */}
        <View style={styles.secondaryStats}>
          <View style={styles.statCardHalf}>
            <ActivityCard
              theme="steps"
              title="Steps"
              value="12,345"
              additionalInfo="+1.2k"
              progress={0.82}
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
              value="48 min"
              additionalInfo="+12 min"
              progress={0.6}
              variant="compact"
              showGoal={false}
              showProgressBar={true}
              iconBackgroundColor={Colors.activityColors.active}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Typography variant="h3" style={styles.sectionTitle}>Recent Activity</Typography>
            <Pressable onPress={() => router.push('/activity')}>
              <Typography variant="link" style={styles.seeAll}>See All</Typography>
            </Pressable>
          </View>
          
          <ActivityListContainer>
            <ActivityListItem
              title="Morning Run"
              subtitle="5.2 km • 28 min • 320 kcal"
              icon="walk"
              iconLibrary="ionicons"
              onPress={() => console.log('Pressed')}
              iconBackgroundColor={Colors.activityColors.running + '20'}
              iconColor={Colors.activityColors.running}
            />
            <ActivityListItem
              title="Cycling Session"
              subtitle="12.8 km • 45 min • 420 kcal"
              icon="bicycle"
              iconLibrary="ionicons"
              onPress={() => console.log('Pressed')}
              iconBackgroundColor={Colors.activityColors.cycling + '20'}
              iconColor={Colors.activityColors.cycling}
            />
          </ActivityListContainer>
        </View>

        {/* AI Tip */}
        <Container paddingTop="lg">
          <AITipCard
            title="Recovery Tip"
            tip="Your muscles need rest to grow stronger. Consider a light stretch session today."
            category="Recovery"
            aiType="recovery"
            aiConfidence={0.85}
            priority="medium"
          />
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
  greeting: {
    fontSize: 28,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.accent,
  },
  featuredSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    fontWeight: '500',
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCardHalf: {
    flex: 1,
  },
  activitySection: {
    marginBottom: 24,
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
});
