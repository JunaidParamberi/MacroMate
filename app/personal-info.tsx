import { ActivityListItem, Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const [form, setForm] = useState({
    fullName: 'John Doe',
    username: '@johndoe_fitness',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    birthDate: '1995-05-15',
    gender: 'Male',
    height: '175',
    weight: '70',
    goal: 'Build Muscle',
  });

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Save logic here
    router.back();
  };

  const renderInput = (label: string, value: string, key: string, placeholder?: string, keyboardType: any = 'default') => (
    <View style={styles.inputGroup}>
      <Typography variant="metaLabel" style={styles.inputLabel}>{label}</Typography>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        placeholder={placeholder}
        placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
        keyboardType={keyboardType}
        autoCapitalize={key === 'email' ? 'none' : 'words'}
      />
    </View>
  );

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>Personal Info</Typography>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Typography variant="bodyText" style={styles.saveText}>Save</Typography>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              <Ionicons name="person" size={60} color={Colors.brand.primary} />
            </View>
            <Pressable style={styles.changePhotoButton} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
              <Typography variant="link" style={styles.changePhotoText}>Change Photo</Typography>
            </Pressable>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
            <Typography variant="h3" style={styles.sectionTitle}>Basic Information</Typography>
            {renderInput('Full Name', form.fullName, 'fullName', 'Enter your full name')}
            {renderInput('Username', form.username, 'username', '@username')}
            {renderInput('Email', form.email, 'email', 'your@email.com', 'email-address')}
            {renderInput('Phone', form.phone, 'phone', '+1 234 567 8900', 'phone-pad')}
            
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Typography variant="metaLabel" style={styles.inputLabel}>Birth Date</Typography>
                <Pressable style={styles.dateInput}>
                  <Typography variant="bodyText">{form.birthDate}</Typography>
                  <Ionicons name="calendar" size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                </Pressable>
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Typography variant="metaLabel" style={styles.inputLabel}>Gender</Typography>
                <Pressable style={styles.selectInput}>
                  <Typography variant="bodyText">{form.gender}</Typography>
                  <Ionicons name="chevron-down" size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Body Stats Section */}
          <View style={styles.formCard}>
            <Typography variant="h3" style={styles.sectionTitle}>Body Statistics</Typography>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Typography variant="metaLabel" style={styles.inputLabel}>Height (cm)</Typography>
                <TextInput
                  style={styles.input}
                  value={form.height}
                  onChangeText={(text) => setForm({ ...form, height: text })}
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Typography variant="metaLabel" style={styles.inputLabel}>Weight (kg)</Typography>
                <TextInput
                  style={styles.input}
                  value={form.weight}
                  onChangeText={(text) => setForm({ ...form, weight: text })}
                  keyboardType="numeric"
                  placeholder="70"
                  placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="metaLabel" style={styles.inputLabel}>Fitness Goal</Typography>
              <Pressable style={styles.selectInput}>
                <Typography variant="bodyText">{form.goal}</Typography>
                <Ionicons name="chevron-down" size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
              </Pressable>
            </View>
          </View>

          {/* Connected Accounts */}
          <View style={styles.formCard}>
            <Typography variant="h3" style={styles.sectionTitle}>Connected Accounts</Typography>
            <ActivityListItem
              title="Apple Health"
              subtitle="Sync your health data"
              icon="logo-apple"
              iconLibrary="ionicons"
              iconColor="#000"
              backgroundColor={isDark ? Colors.neutral[700] : Colors.neutral[100]}
              showArrow={true}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
            <ActivityListItem
              title="Google Fit"
              subtitle="Connect to Google Fit"
              icon="logo-google"
              iconLibrary="ionicons"
              iconColor={Colors.activityColors.calories}
              backgroundColor={isDark ? Colors.neutral[700] : Colors.neutral[100]}
              showArrow={true}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
            <ActivityListItem
              title="Fitbit"
              subtitle="Link your Fitbit account"
              icon="watch"
              iconLibrary="ionicons"
              iconColor={Colors.activityColors.active}
              backgroundColor={isDark ? Colors.neutral[700] : Colors.neutral[100]}
              showArrow={true}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            />
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
  saveButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 14,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: isDark ? Colors.neutral[600] : Colors.neutral[300],
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    fontSize: 16,
  },
  formCard: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
  },
  input: {
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: isDark ? Colors.neutral[50] : Colors.neutral[800],
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[600] : Colors.neutral[200],
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[600] : Colors.neutral[200],
  },
  selectInput: {
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[600] : Colors.neutral[200],
  },
});
