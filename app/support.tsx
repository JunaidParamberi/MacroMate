import { ActivityListItem, Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

const faqItems = [
  {
    question: "How do I log a workout?",
    answer: "Tap the + button in the center of the tab bar, select your activity type, and enter your workout details including duration, calories burned, and any notes."
  },
  {
    question: "Can I sync with other fitness apps?",
    answer: "Yes! Go to Profile > Privacy & Security > Connected Accounts to link Apple Health, Google Fit, Fitbit, and other supported apps."
  },
  {
    question: "How do I change my daily goals?",
    answer: "Navigate to Profile > Fitness Goals. Here you can customize your daily targets for calories, steps, water intake, and workout duration."
  },
  {
    question: "What is MacroMate Pro?",
    answer: "MacroMate Pro is our premium subscription that includes AI-powered meal plans, advanced analytics, unlimited history, and an ad-free experience."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "Go to Profile > MacroMate Pro > Manage Subscription. You can cancel anytime and will continue to have access until the end of your billing period."
  },
];

const supportOptions = [
  { icon: 'chatbubble-ellipses', title: 'Live Chat', subtitle: 'Chat with our support team', color: Colors.brand.primary, action: () => {} },
  { icon: 'mail', title: 'Email Support', subtitle: 'Get help via email', color: Colors.activityColors.active, action: () => Linking.openURL('mailto:support@macromate.app') },
  { icon: 'call', title: 'Phone Support', subtitle: '+1 (800) 123-4567', color: Colors.activityColors.running, action: () => Linking.openURL('tel:+18001234567') },
  { icon: 'logo-twitter', title: 'Twitter', subtitle: '@MacroMateApp', color: '#1DA1F2', action: () => Linking.openURL('https://twitter.com') },
];

export default function SupportScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

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
          <Typography variant="h2" style={styles.headerTitle}>Help & Support</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Support Hero */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="headset" size={40} color={Colors.neutral.white} />
            </View>
            <Typography variant="h2" style={styles.heroTitle}>How can we help?</Typography>
            <Typography variant="metaLabel" style={styles.heroSubtitle}>
              Our support team is available 24/7 to assist you
            </Typography>
          </View>

          {/* Quick Support Options */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Contact Us</Typography>
            <View style={styles.supportGrid}>
              {supportOptions.map((option, index) => (
                <Pressable
                  key={index}
                  style={[styles.supportCard, { backgroundColor: option.color + '15' }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    option.action();
                  }}
                >
                  <View style={[styles.supportIcon, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as any} size={24} color={Colors.neutral.white} />
                  </View>
                  <Typography variant="bodyText" style={{...styles.supportTitle, color: option.color} as any}>
                    {option.title}
                  </Typography>
                  <Typography variant="caption" style={styles.supportSubtitle}>{option.subtitle}</Typography>
                </Pressable>
              ))}
            </View>
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Frequently Asked Questions</Typography>
            <View style={styles.faqCard}>
              {faqItems.map((item, index) => (
                <View key={index}>
                  <Pressable
                    style={styles.faqItem}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <View style={styles.faqContent}>
                      <Typography variant="bodyText" style={styles.faqQuestion}>{item.question}</Typography>
                      <Typography variant="metaLabel" style={styles.faqAnswer} numberOfLines={2}>
                        {item.answer}
                      </Typography>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? Colors.neutral[500] : Colors.neutral[400]} />
                  </Pressable>
                  {index < faqItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Resources */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Resources</Typography>
            <View style={styles.resourcesCard}>
              <ActivityListItem
                title="Video Tutorials"
                subtitle="Learn how to use the app"
                icon="play-circle"
                iconLibrary="ionicons"
                iconColor={Colors.brand.primary}
                backgroundColor={isDark ? Colors.neutral[700] + '00' : Colors.neutral[100] + '00'}
                showArrow={true}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              />
              <ActivityListItem
                title="User Guide"
                subtitle="Complete documentation"
                icon="book"
                iconLibrary="ionicons"
                iconColor={Colors.activityColors.active}
                backgroundColor={isDark ? Colors.neutral[700] + '00' : Colors.neutral[100] + '00'}
                showArrow={true}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              />
              <ActivityListItem
                title="Community Forum"
                subtitle="Connect with other users"
                icon="people"
                iconLibrary="ionicons"
                iconColor={Colors.activityColors.running}
                backgroundColor={isDark ? Colors.neutral[700] + '00' : Colors.neutral[100] + '00'}
                showArrow={true}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              />
              <ActivityListItem
                title="Report a Bug"
                subtitle="Help us improve the app"
                icon="bug"
                iconLibrary="ionicons"
                iconColor={Colors.brand.accent}
                backgroundColor={isDark ? Colors.neutral[700] + '00' : Colors.neutral[100] + '00'}
                showArrow={true}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              />
            </View>
          </View>

          {/* App Version */}
          <View style={styles.versionCard}>
            <Ionicons name="information-circle" size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
            <Typography variant="metaLabel" style={styles.versionText}>
              MacroMate v1.0.0 (Build 12345)
            </Typography>
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
  heroCard: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...Shadows.md,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral.white + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: Colors.neutral.white,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: Colors.neutral.white + 'CC',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supportCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  supportSubtitle: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    textAlign: 'center',
  },
  faqCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    ...Shadows.sm,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqContent: {
    flex: 1,
    marginRight: 8,
  },
  faqQuestion: {
    fontWeight: '600',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 4,
  },
  faqAnswer: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginHorizontal: 16,
  },
  resourcesCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    paddingVertical: 8,
    ...Shadows.sm,
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  versionText: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
});
