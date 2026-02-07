import { ActivityListItem, Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

// Profile stats data
const profileStats = [
  { label: 'Workouts', value: '156', icon: 'fitness', color: Colors.activityColors.gym },
  { label: 'Calories', value: '45.2K', icon: 'flame', color: Colors.activityColors.calories },
  { label: 'Streak', value: '12 days', icon: 'trophy', color: Colors.activityColors.running },
];

// Settings menu items
const settingsMenu = [
  { icon: 'person', title: 'Personal Info', subtitle: 'Update your profile details', route: '/personal-info' },
  { icon: 'fitness', title: 'Fitness Goals', subtitle: 'Set your targets', route: '/goals' },
  { icon: 'notifications', title: 'Notifications', subtitle: 'Manage alerts & reminders', route: '/notifications' },
  { icon: 'moon', title: 'Dark Mode', subtitle: 'Toggle appearance', route: null },
  { icon: 'shield', title: 'Privacy & Security', subtitle: 'Password & 2FA', route: '/security' },
  { icon: 'language', title: 'Language', subtitle: 'English (US)', route: '/language' },
  { icon: 'help-circle', title: 'Help & Support', subtitle: 'FAQ & Contact', route: '/support' },
  { icon: 'document-text', title: 'Terms of Service', subtitle: 'Legal information', route: '/terms' },
];

// Achievements data
const achievements = [
  { icon: '🏃', title: 'Marathon Runner', description: 'Complete 42km total distance', progress: 0.8, unlocked: true },
  { icon: '🔥', title: 'Streak Master', description: '30 days workout streak', progress: 0.4, unlocked: false },
  { icon: '💪', title: 'Iron Lifter', description: '100 gym sessions completed', progress: 0.6, unlocked: true },
  { icon: '🥗', title: 'Nutrition Pro', description: 'Log meals for 7 days', progress: 0.3, unlocked: false },
];

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handlePress = (route: string | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with Avatar */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Colors.brand.primary} />
              </View>
              <Pressable 
                style={styles.editAvatarButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="camera" size={14} color={Colors.neutral.white} />
              </Pressable>
            </View>
            <View style={styles.userInfo}>
              <Typography variant="h2" style={styles.userName}>John Doe</Typography>
              <Typography variant="metaLabel" style={styles.userHandle}>@johndoe_fitness</Typography>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.brand.primary} />
                  <Typography variant="caption" style={styles.badgeText}>Verified</Typography>
                </View>
                <View style={[styles.badge, styles.proBadge]}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Typography variant="caption" style={styles.proBadgeText}>PRO</Typography>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            {profileStats.map((stat, index) => (
              <Pressable
                key={index}
                style={[styles.statCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}
                onPress={() => handlePress('/stats')}
              >
                <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Typography variant="h3" style={styles.statValue}>{stat.value}</Typography>
                <Typography variant="metaLabel" style={styles.statLabel}>{stat.label}</Typography>
              </Pressable>
            ))}
          </View>

          {/* Subscription Card */}
          <Pressable
            style={styles.subscriptionCard}
            onPress={() => handlePress('/subscription')}
          >
            <View style={styles.subscriptionContent}>
              <View style={styles.subscriptionIcon}>
                <Ionicons name="diamond" size={28} color="#FFD700" />
              </View>
              <View style={styles.subscriptionInfo}>
                <Typography variant="h3" style={styles.subscriptionTitle}>MacroMate Pro</Typography>
                <Typography variant="metaLabel" style={styles.subscriptionSubtitle}>
                  Unlimited AI insights & advanced analytics
                </Typography>
              </View>
              <View style={styles.subscriptionButton}>
                <Typography variant="caption" style={styles.subscriptionButtonText}>Manage</Typography>
              </View>
            </View>
            <View style={styles.subscriptionFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark" size={14} color={Colors.brand.primary} />
                <Typography variant="caption" style={styles.featureText}>AI Meal Plans</Typography>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark" size={14} color={Colors.brand.primary} />
                <Typography variant="caption" style={styles.featureText}>Advanced Stats</Typography>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark" size={14} color={Colors.brand.primary} />
                <Typography variant="caption" style={styles.featureText}>No Ads</Typography>
              </View>
            </View>
          </Pressable>

          {/* Achievements Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography variant="h3" style={styles.sectionTitle}>Achievements</Typography>
              <Pressable onPress={() => handlePress('/achievements')}>
                <Typography variant="link" style={styles.seeAll}>See All</Typography>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.achievementsRow}>
                {achievements.map((achievement, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.achievementCard,
                      { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white },
                      achievement.unlocked && styles.unlockedCard
                    ]}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <View style={[styles.achievementIcon, !achievement.unlocked && styles.lockedIcon]}>
                      <Typography variant="h3">{achievement.icon}</Typography>
                    </View>
                    <Typography variant="bodyText" style={styles.achievementTitle}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption" style={styles.achievementDesc}>
                      {achievement.description}
                    </Typography>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${achievement.progress * 100}%` }
                        ]} 
                      />
                    </View>
                    <Typography variant="caption" style={styles.progressText}>
                      {Math.round(achievement.progress * 100)}%
                    </Typography>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Settings Menu */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Settings</Typography>
            <View style={styles.settingsContainer}>
              {settingsMenu.map((item, index) => (
                <ActivityListItem
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  icon={item.icon}
                  iconLibrary="ionicons"
                  iconColor={Colors.brand.primary}
                  backgroundColor={isDark ? Colors.neutral[800] + '00' : Colors.neutral.white + '00'}
                  showArrow={true}
                  onPress={() => handlePress(item.route)}
                />
              ))}
            </View>
          </View>

          {/* Sign Out Button */}
          <Pressable
            style={styles.signOutButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // Handle sign out
            }}
          >
            <Ionicons name="log-out" size={20} color={Colors.brand.accent} />
            <Typography variant="bodyText" style={styles.signOutText}>Sign Out</Typography>
          </Pressable>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Typography variant="caption" style={styles.versionText}>MacroMate v1.0.0</Typography>
            <Typography variant="caption" style={styles.versionText}>Built with ❤️ for fitness</Typography>
          </View>
        </ScrollView>
      </ScreenContent>
    </Screen>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 2,
  },
  userHandle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: isDark ? Colors.neutral[300] : Colors.neutral[600],
    fontWeight: '600',
  },
  proBadge: {
    backgroundColor: isDark ? '#1A237E' : '#FFF8E1',
  },
  proBadgeText: {
    color: '#B8860B',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: '700',
    fontSize: 18,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  statLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  subscriptionCard: {
    backgroundColor: isDark ? '#1A237E' : '#F3E5F5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: isDark ? '#3F51B5' : '#E1BEE7',
  },
  subscriptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTitle: {
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 4,
  },
  subscriptionSubtitle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
  },
  subscriptionButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  subscriptionButtonText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
  subscriptionFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    color: isDark ? Colors.neutral[300] : Colors.neutral[600],
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  seeAll: {
    fontSize: 14,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  achievementCard: {
    width: 140,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Shadows.sm,
  },
  unlockedCard: {
    borderWidth: 2,
    borderColor: Colors.brand.primary + '40',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  lockedIcon: {
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    opacity: 0.5,
  },
  achievementTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 3,
  },
  progressText: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  settingsContainer: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    paddingVertical: 8,
    ...Shadows.sm,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  signOutText: {
    color: Colors.brand.accent,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
    marginBottom: 4,
  },
});
