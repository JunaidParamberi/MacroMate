import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

const weightHistory = [
  { date: 'Feb 1', weight: 70.5, change: -0.5 },
  { date: 'Jan 28', weight: 71.0, change: -0.3 },
  { date: 'Jan 25', weight: 71.3, change: 0.2 },
  { date: 'Jan 21', weight: 71.1, change: -0.4 },
];

export default function WeightLogScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [weight, setWeight] = useState('70.5');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  const convertWeight = (w: string, to: 'kg' | 'lbs') => {
    const val = parseFloat(w);
    if (isNaN(val)) return '';
    if (to === 'kg') return (val * 0.453592).toFixed(1);
    return (val * 2.20462).toFixed(1);
  };

  const toggleUnit = () => {
    const newUnit = unit === 'kg' ? 'lbs' : 'kg';
    setWeight(convertWeight(weight, newUnit));
    setUnit(newUnit);
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Log Weight
          </Typography>
          <Pressable onPress={toggleUnit}>
            <Typography variant="bodyText" style={{ color: Colors.brand.primary, fontWeight: '600' }}>
              {unit.toUpperCase()}
            </Typography>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Weight Input */}
          <View style={[styles.inputCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="metaLabel" style={{ marginBottom: 8, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              Current Weight
            </Typography>
            
            <View style={styles.weightInputContainer}>
              <TextInput
                style={[styles.weightInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
              />
              <Typography variant="h3" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                {unit}
              </Typography>
            </View>

            {/* Quick Adjust */}
            <View style={styles.adjustButtons}>
              {[-0.5, -0.1, +0.1, +0.5].map((adjust) => (
                <Pressable
                  key={adjust}
                  style={[styles.adjustButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }]}
                  onPress={() => {
                    const newVal = (parseFloat(weight) + adjust).toFixed(1);
                    setWeight(newVal);
                  }}
                >
                  <Typography variant="caption" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                    {adjust > 0 ? `+${adjust}` : adjust}
                  </Typography>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              <Ionicons name="trending-down" size={24} color={Colors.brand.primary} />
              <Typography variant="h3" style={{ marginTop: 8, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                -2.5
              </Typography>
              <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                kg this month
              </Typography>
            </View>
            <View style={[styles.statCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              <Ionicons name="calendar" size={24} color={Colors.activityColors.active} />
              <Typography variant="h3" style={{ marginTop: 8, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                24
              </Typography>
              <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                days logged
              </Typography>
            </View>
          </View>

          {/* History */}
          <View style={[styles.historyCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="h3" style={{ marginBottom: 16, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
              Weight History
            </Typography>
            {weightHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                    {entry.date}
                  </Typography>
                  <Typography variant="h3" style={{ marginTop: 4, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                    {entry.weight} {unit}
                  </Typography>
                </View>
                <View style={[styles.changeBadge, { 
                  backgroundColor: entry.change < 0 ? Colors.brand.primary + '20' : Colors.brand.accent + '20' 
                }]}>
                  <Typography variant="caption" style={{ 
                    color: entry.change < 0 ? Colors.brand.primary : Colors.brand.accent,
                    fontWeight: '600'
                  }}>
                    {entry.change > 0 ? '+' : ''}{entry.change} {unit}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          {/* Body Measurements */}
          <View style={[styles.measurementsCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="h3" style={{ marginBottom: 16, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
              Body Measurements (Optional)
            </Typography>
            {['Chest', 'Waist', 'Hips', 'Arms'].map((measure) => (
              <View key={measure} style={styles.measureRow}>
                <Typography variant="bodyText" style={{ flex: 1, color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                  {measure}
                </Typography>
                <TextInput
                  style={[styles.measureInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800], borderColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }]}
                  placeholder="--"
                  keyboardType="decimal-pad"
                  placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                />
                <Typography variant="metaLabel" style={{ marginLeft: 8, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                  cm
                </Typography>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Save Button */}
        <Pressable style={styles.saveButton}>
          <Typography variant="bodyText" style={styles.saveText}>Log Weight</Typography>
        </Pressable>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  inputCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    ...Shadows.sm,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  weightInput: {
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'right',
    minWidth: 150,
  },
  adjustButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  adjustButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    ...Shadows.sm,
  },
  historyCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Shadows.sm,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  historyLeft: {
    flex: 1,
  },
  changeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  measurementsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Shadows.sm,
  },
  measureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  measureInput: {
    width: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
});
