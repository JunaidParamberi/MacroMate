import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const [selected, setSelected] = useState('en');

  const handleSelect = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(code);
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
          <Typography variant="h2" style={styles.headerTitle}>Language</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Language */}
          <View style={styles.currentCard}>
            <Typography variant="metaLabel" style={styles.currentLabel}>Current Language</Typography>
            <View style={styles.currentLanguage}>
              <Typography variant="h1" style={styles.flag}>{languages.find(l => l.code === selected)?.flag}</Typography>
              <View style={styles.currentText}>
                <Typography variant="h3" style={styles.currentName}>
                  {languages.find(l => l.code === selected)?.name}
                </Typography>
                <Typography variant="metaLabel" style={styles.currentNative}>
                  {languages.find(l => l.code === selected)?.nativeName}
                </Typography>
              </View>
            </View>
          </View>

          {/* Language List */}
          <View style={styles.section}>
            <Typography variant="h3" style={styles.sectionTitle}>Select Language</Typography>
            <View style={styles.languageCard}>
              {languages.map((lang, index) => (
                <View key={lang.code}>
                  <Pressable
                    style={[styles.languageItem, selected === lang.code && styles.selectedItem]}
                    onPress={() => handleSelect(lang.code)}
                  >
                    <View style={styles.languageLeft}>
                      <Typography variant="h3" style={styles.flagSmall}>{lang.flag}</Typography>
                      <View style={styles.languageText}>
                        <Typography
                          variant="bodyText"
                          style={{...styles.languageName, ...(selected === lang.code && { color: Colors.brand.primary })} as any}
                        >
                          {lang.name}
                        </Typography>
                        <Typography variant="metaLabel" style={styles.languageNative}>{lang.nativeName}</Typography>
                      </View>
                    </View>
                    {selected === lang.code && (
                      <View style={styles.checkmark}>
                        <Ionicons name="checkmark-circle" size={24} color={Colors.brand.primary} />
                      </View>
                    )}
                  </Pressable>
                  {index < languages.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Auto Detect */}
          <View style={styles.section}>
            <View style={styles.autoCard}>
              <View style={styles.autoLeft}>
                <View style={styles.autoIcon}>
                  <Ionicons name="globe" size={24} color={Colors.neutral.white} />
                </View>
                <View style={styles.autoText}>
                  <Typography variant="bodyText" style={styles.autoTitle}>Auto-Detect Language</Typography>
                  <Typography variant="metaLabel" style={styles.autoDesc}>Use device language settings</Typography>
                </View>
              </View>
              <Pressable style={styles.autoButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Typography variant="caption" style={styles.autoButtonText}>Enable</Typography>
              </Pressable>
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
    marginBottom: 28,
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
  currentCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  currentLabel: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginBottom: 14,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 56,
    marginRight: 18,
  },
  currentText: {
    flex: 1,
  },
  currentName: {
    fontWeight: '800',
    fontSize: 22,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  currentNative: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 15,
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 14,
    fontSize: 18,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  languageCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 24,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  selectedItem: {
    backgroundColor: Colors.brand.primary + '10',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagSmall: {
    fontSize: 32,
    marginRight: 14,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontWeight: '600',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 3,
  },
  selectedText: {
    color: Colors.brand.primary,
  },
  languageNative: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 14,
  },
  checkmark: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginHorizontal: 18,
  },
  autoCard: {
    backgroundColor: Colors.brand.primary + '15',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.brand.primary + '30',
  },
  autoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  autoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoText: {
    marginLeft: 18,
    flex: 1,
  },
  autoTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    marginBottom: 4,
  },
  autoDesc: {
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    fontSize: 14,
  },
  autoButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  autoButtonText: {
    color: Colors.neutral.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
