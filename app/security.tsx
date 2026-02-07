import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, useColorScheme, View } from 'react-native';

interface SecurityOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled?: boolean;
  value?: string;
}

export default function SecurityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [dataBackup, setDataBackup] = useState(true);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const securityOptions: SecurityOption[] = [
    { id: 'password', title: 'Change Password', description: 'Last updated 2 weeks ago', icon: 'key', value: '••••••••' },
    { id: 'email', title: 'Email Verification', description: 'john@example.com', icon: 'mail', value: 'Verified' },
    { id: 'phone', title: 'Phone Number', description: '+1 234 567 8900', icon: 'phone-portrait', value: 'Verified' },
    { id: 'devices', title: 'Active Devices', description: '2 devices logged in', icon: 'phone' },
    { id: 'sessions', title: 'Login History', description: 'View recent activity', icon: 'time' },
  ];

  const privacyOptions = [
    { id: 'profile', title: 'Profile Visibility', description: 'Public', icon: 'eye' },
    { id: 'activity', title: 'Share Activity', description: 'Friends only', icon: 'share-social' },
    { id: 'data', title: 'Data Download', description: 'Request your data', icon: 'download' },
    { id: 'delete', title: 'Delete Account', description: 'Permanently remove account', icon: 'trash', value: '' },
  ];

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>Privacy & Security</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Security Status */}
          <View style={[styles.statusCard, { backgroundColor: Colors.brand.primary + '15' }]}>
            <View style={styles.statusIcon}>
              <Ionicons name="shield-checkmark" size={32} color={Colors.brand.primary} />
            </View>
            <View style={styles.statusText}>
              <Typography variant="h3" style={{...styles.statusTitle, color: Colors.brand.primary}}>
                Account Secure
              </Typography>
              <Typography variant="metaLabel" style={styles.statusDesc}>
                Your account is protected with 2FA and biometric login
              </Typography>
            </View>
          </View>

          {/* Security Toggles */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Security Features</Typography>
            <View style={styles.card}>
              <View style={styles.toggleItem}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIcon, { backgroundColor: Colors.brand.accent + '20' }]}>
                    <Ionicons name="lock-closed" size={22} color={Colors.brand.accent} />
                  </View>
                  <View style={styles.toggleText}>
                    <Typography variant="bodyText" style={styles.toggleTitle}>Two-Factor Auth</Typography>
                    <Typography variant="metaLabel" style={styles.toggleDesc}>Extra layer of security</Typography>
                  </View>
                </View>
                <Switch
                  value={twoFactor}
                  onValueChange={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTwoFactor(!twoFactor);
                  }}
                  trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                  thumbColor={Colors.neutral.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleItem}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIcon, { backgroundColor: Colors.activityColors.gym + '20' }]}>
                    <Ionicons name="finger-print" size={22} color={Colors.activityColors.gym} />
                  </View>
                  <View style={styles.toggleText}>
                    <Typography variant="bodyText" style={styles.toggleTitle}>Biometric Login</Typography>
                    <Typography variant="metaLabel" style={styles.toggleDesc}>Face ID / Touch ID</Typography>
                  </View>
                </View>
                <Switch
                  value={biometric}
                  onValueChange={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setBiometric(!biometric);
                  }}
                  trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                  thumbColor={Colors.neutral.white}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.toggleItem}>
                <View style={styles.toggleLeft}>
                  <View style={[styles.toggleIcon, { backgroundColor: Colors.activityColors.active + '20' }]}>
                    <Ionicons name="cloud-upload" size={22} color={Colors.activityColors.active} />
                  </View>
                  <View style={styles.toggleText}>
                    <Typography variant="bodyText" style={styles.toggleTitle}>Auto Backup</Typography>
                    <Typography variant="metaLabel" style={styles.toggleDesc}>Cloud sync enabled</Typography>
                  </View>
                </View>
                <Switch
                  value={dataBackup}
                  onValueChange={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDataBackup(!dataBackup);
                  }}
                  trackColor={{ false: isDark ? Colors.neutral[700] : Colors.neutral[300], true: Colors.brand.primary }}
                  thumbColor={Colors.neutral.white}
                />
              </View>
            </View>
          </View>

          {/* Account Security */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Account Security</Typography>
            <View style={styles.card}>
              {securityOptions.map((option, index) => (
                <View key={option.id}>
                  <Pressable
                    style={styles.optionItem}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionIcon, { backgroundColor: Colors.brand.primary + '15' }]}>
                        <Ionicons name={option.icon as any} size={20} color={Colors.brand.primary} />
                      </View>
                      <View style={styles.optionText}>
                        <Typography variant="bodyText" style={styles.optionTitle}>{option.title}</Typography>
                        <Typography variant="metaLabel" style={styles.optionDesc}>{option.description}</Typography>
                      </View>
                    </View>
                    <View style={styles.optionRight}>
                      {option.value && (
                        <Typography variant="metaLabel" style={styles.optionValue}>{option.value}</Typography>
                      )}
                      <Ionicons name="chevron-forward" size={20} color={isDark ? Colors.neutral[500] : Colors.neutral[400]} />
                    </View>
                  </Pressable>
                  {index < securityOptions.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Privacy Controls */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Privacy Controls</Typography>
            <View style={styles.card}>
              {privacyOptions.map((option, index) => (
                <View key={option.id}>
                  <Pressable
                    style={styles.optionItem}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionIcon, { backgroundColor: option.id === 'delete' ? Colors.brand.accent + '15' : Colors.activityColors.running + '15' }]}>
                        <Ionicons
                          name={option.icon as any}
                          size={20}
                          color={option.id === 'delete' ? Colors.brand.accent : Colors.activityColors.running}
                        />
                      </View>
                      <View style={styles.optionText}>
                        <Typography
                          variant="bodyText"
                          style={{...styles.optionTitle, ...(option.id === 'delete' && { color: Colors.brand.accent })} as any}
                        >
                          {option.title}
                        </Typography>
                        <Typography variant="metaLabel" style={styles.optionDesc}>{option.description}</Typography>
                      </View>
                    </View>
                    <View style={styles.optionRight}>
                      {option.value !== undefined && (
                        <Typography variant="metaLabel" style={styles.optionValue}>{option.value}</Typography>
                      )}
                      <Ionicons name="chevron-forward" size={20} color={isDark ? Colors.neutral[500] : Colors.neutral[400]} />
                    </View>
                  </Pressable>
                  {index < privacyOptions.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
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
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  statusText: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statusDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  card: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    ...Shadows.sm,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    marginLeft: 12,
    flex: 1,
  },
  toggleTitle: {
    fontWeight: '600',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 2,
  },
  toggleDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontWeight: '600',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 2,
  },
  optionDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionValue: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontWeight: '500',
  },
});
