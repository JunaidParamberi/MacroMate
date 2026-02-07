import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, useColorScheme, View } from 'react-native';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: '1', title: 'Workout Reminders', description: 'Daily reminders to complete your workout', icon: 'fitness', enabled: true },
    { id: '2', title: 'Goal Progress', description: 'Updates when you reach milestones', icon: 'trophy', enabled: true },
    { id: '3', title: 'Water Intake', description: 'Reminders to stay hydrated', icon: 'water', enabled: false },
    { id: '4', title: 'Meal Logging', description: 'Remind me to log meals', icon: 'restaurant', enabled: true },
    { id: '5', title: 'Sleep Tracking', description: 'Bedtime reminders', icon: 'moon', enabled: false },
    { id: '6', title: 'Weekly Report', description: 'Sunday summary of your week', icon: 'stats-chart', enabled: true },
    { id: '7', title: 'AI Insights', description: 'Personalized tips from AI coach', icon: 'bulb', enabled: true },
    { id: '8', title: 'Friend Activity', description: 'When friends complete workouts', icon: 'people', enabled: false },
    { id: '9', title: 'New Features', description: 'Updates about new app features', icon: 'sparkles', enabled: true },
  ]);

  const toggleSetting = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>Notifications</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Master Toggle */}
          <View style={styles.masterToggle}>
            <View style={styles.masterToggleContent}>
              <View style={styles.masterIconContainer}>
                <Ionicons name="notifications" size={28} color={Colors.neutral.white} />
              </View>
              <View style={styles.masterTextContainer}>
                <Typography variant="h3" style={styles.masterTitle}>Allow Notifications</Typography>
                <Typography variant="metaLabel" style={styles.masterSubtitle}>Turn on to receive all notifications</Typography>
              </View>
              <Switch
                value={settings.some(s => s.enabled)}
                onValueChange={() => {
                  const anyEnabled = settings.some(s => s.enabled);
                  setSettings(prev => prev.map(s => ({ ...s, enabled: !anyEnabled })));
                }}
                trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                thumbColor={Colors.neutral.white}
              />
            </View>
          </View>

          {/* Notification Groups */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Workout & Health</Typography>
            <View style={styles.settingsCard}>
              {settings.slice(0, 5).map((setting, index) => (
                <View key={setting.id}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: Colors.brand.primary + '20' }]}>
                        <Ionicons name={setting.icon as any} size={22} color={Colors.brand.primary} />
                      </View>
                      <View style={styles.settingText}>
                        <Typography variant="bodyText" style={styles.settingTitle}>{setting.title}</Typography>
                        <Typography variant="metaLabel" style={styles.settingDesc}>{setting.description}</Typography>
                      </View>
                    </View>
                    <Switch
                      value={setting.enabled}
                      onValueChange={() => toggleSetting(setting.id)}
                      trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                      thumbColor={Colors.neutral.white}
                    />
                  </View>
                  {index < 4 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Updates & Social</Typography>
            <View style={styles.settingsCard}>
              {settings.slice(5).map((setting, index) => (
                <View key={setting.id}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: Colors.activityColors.running + '20' }]}>
                        <Ionicons name={setting.icon as any} size={22} color={Colors.activityColors.running} />
                      </View>
                      <View style={styles.settingText}>
                        <Typography variant="bodyText" style={styles.settingTitle}>{setting.title}</Typography>
                        <Typography variant="metaLabel" style={styles.settingDesc}>{setting.description}</Typography>
                      </View>
                    </View>
                    <Switch
                      value={setting.enabled}
                      onValueChange={() => toggleSetting(setting.id)}
                      trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                      thumbColor={Colors.neutral.white}
                    />
                  </View>
                  {index < 3 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Quiet Hours */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Quiet Hours</Typography>
            <View style={styles.quietHoursCard}>
              <View style={styles.quietHoursHeader}>
                <Ionicons name="time" size={24} color={Colors.brand.primary} />
                <Typography variant="bodyText" style={styles.quietHoursTitle}>Do Not Disturb</Typography>
                <Switch
                  value={false}
                  trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                  thumbColor={Colors.neutral.white}
                />
              </View>
              <View style={styles.timeRow}>
                <Pressable style={styles.timeButton}>
                  <Typography variant="bodyText" style={styles.timeText}>10:00 PM</Typography>
                  <Ionicons name="chevron-down" size={16} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                </Pressable>
                <Typography variant="metaLabel" style={styles.timeLabel}>to</Typography>
                <Pressable style={styles.timeButton}>
                  <Typography variant="bodyText" style={styles.timeText}>7:00 AM</Typography>
                  <Ionicons name="chevron-down" size={16} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                </Pressable>
              </View>
            </View>
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
    marginBottom: 8,
    paddingTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
  },
  masterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  masterIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masterTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  masterToggleContent: {
    flex: 1,
    marginLeft: 12,
  },
  masterTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 2,
  },
  masterSubtitle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 13,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 14,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  settingsCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontWeight: '500',
    fontSize: 14,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 2,
  },
  settingDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginHorizontal: 14,
  },
  quietHoursCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  quietHoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  quietHoursTitle: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '500',
    fontSize: 14,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  timeText: {
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    fontWeight: '500',
    fontSize: 14,
  },
  timeLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontWeight: '400',
  },
});
