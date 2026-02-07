import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using MacroMate, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service."
  },
  {
    title: "2. Description of Service",
    content: "MacroMate is a fitness tracking application that allows users to log workouts, track nutrition, monitor progress, and access AI-powered health insights. The app integrates with various health platforms and wearable devices."
  },
  {
    title: "3. User Accounts",
    content: "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for any activities under your account."
  },
  {
    title: "4. Privacy and Data",
    content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using MacroMate, you consent to our data practices."
  },
  {
    title: "5. Health Disclaimer",
    content: "MacroMate is not a medical device and should not be used for medical diagnosis or treatment. Always consult with healthcare professionals before starting any exercise program or dietary changes."
  },
  {
    title: "6. Subscription and Payments",
    content: "Some features require a paid subscription. Payments are processed through Apple App Store or Google Play. Subscriptions auto-renew unless cancelled 24 hours before renewal."
  },
  {
    title: "7. User Content",
    content: "You retain ownership of content you post. By posting, you grant MacroMate a license to use, modify, and display your content. You are responsible for content accuracy and legality."
  },
  {
    title: "8. Prohibited Activities",
    content: "Users may not: misuse the service, attempt unauthorized access, interfere with other users, transmit malware, or violate any applicable laws while using the service."
  },
  {
    title: "9. Termination",
    content: "We may terminate or suspend your account immediately for any violation of these terms. You may delete your account at any time through the app settings."
  },
  {
    title: "10. Limitation of Liability",
    content: "MacroMate and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service."
  },
  {
    title: "11. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. We will notify users of significant changes. Continued use after changes constitutes acceptance of new terms."
  },
  {
    title: "12. Contact Information",
    content: "For questions about these Terms, please contact us at legal@macromate.app or through the Help & Support section in the app."
  },
];

export default function TermsScreen() {
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
          <Typography variant="h2" style={styles.headerTitle}>Terms of Service</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Last Updated */}
          <View style={styles.lastUpdated}>
            <Ionicons name="time" size={16} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
            <Typography variant="metaLabel" style={styles.lastUpdatedText}>Last updated: February 2025</Typography>
          </View>

          {/* Terms Sections */}
          <View style={styles.termsCard}>
            {sections.map((section, index) => (
              <View key={index} style={styles.section}>
                <Typography variant="h3" style={styles.sectionTitle}>{section.title}</Typography>
                <Typography variant="bodyText" style={styles.sectionContent}>{section.content}</Typography>
                {index < sections.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* Agreement Button */}
          <Pressable
            style={styles.agreeButton}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.back();
            }}
          >
            <Typography variant="bodyText" style={styles.agreeText}>I Agree to Terms</Typography>
          </Pressable>

          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Typography variant="caption" style={styles.legalLink}>Privacy Policy</Typography>
            </Pressable>
            <Typography variant="caption" style={styles.dot}>•</Typography>
            <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Typography variant="caption" style={styles.legalLink}>Cookie Policy</Typography>
            </Pressable>
            <Typography variant="caption" style={styles.dot}>•</Typography>
            <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Typography variant="caption" style={styles.legalLink}>GDPR</Typography>
            </Pressable>
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
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  lastUpdatedText: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  termsCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.sm,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 8,
  },
  sectionContent: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginTop: 20,
  },
  agreeButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  agreeText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  legalLink: {
    color: Colors.brand.primary,
  },
  dot: {
    color: isDark ? Colors.neutral[500] : Colors.neutral[400],
  },
});
