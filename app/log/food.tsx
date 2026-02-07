import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunny' },
  { id: 'lunch', label: 'Lunch', icon: 'sunny' },
  { id: 'dinner', label: 'Dinner', icon: 'moon' },
  { id: 'snack', label: 'Snack', icon: 'cafe' },
];

const recentFoods = [
  { name: 'Grilled Chicken Salad', calories: 350, protein: 45, carbs: 12, fat: 8 },
  { name: 'Oatmeal with Berries', calories: 280, protein: 8, carbs: 52, fat: 6 },
  { name: 'Greek Yogurt', calories: 120, protein: 15, carbs: 8, fat: 0 },
];

export default function LogFoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>Log Food</Typography>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Meal Type Selector */}
          <View style={styles.mealSelector}>
            {mealTypes.map((meal) => (
              <Pressable
                key={meal.id}
                style={[
                  styles.mealButton,
                  selectedMeal === meal.id && { backgroundColor: Colors.brand.primary },
                ]}
                onPress={() => setSelectedMeal(meal.id)}
              >
                <Ionicons
                  name={meal.icon as any}
                  size={20}
                  color={selectedMeal === meal.id ? Colors.neutral.white : (isDark ? Colors.neutral[400] : Colors.neutral[500])}
                />
                <Typography
                  variant="caption"
                  style={[
                    styles.mealLabel,
                    { color: selectedMeal === meal.id ? Colors.neutral.white : (isDark ? Colors.neutral[400] : Colors.neutral[500]) },
                  ]}
                >
                  {meal.label}
                </Typography>
              </Pressable>
            ))}
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}>
            <Ionicons name="search" size={20} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}
              placeholder="Search food or scan barcode..."
              placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Pressable style={styles.barcodeButton}>
              <Ionicons name="barcode" size={22} color={Colors.brand.primary} />
            </Pressable>
          </View>

          {/* Quick Add Section */}
          <View style={styles.section}>
            <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              Recent Foods
            </Typography>
            <View style={[styles.card, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              {recentFoods.map((food, index) => (
                <View key={index}>
                  <Pressable style={styles.foodItem}>
                    <View style={styles.foodInfo}>
                      <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                        {food.name}
                      </Typography>
                      <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                        {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </Typography>
                    </View>
                    <Pressable style={styles.addButton}>
                      <Ionicons name="add-circle" size={28} color={Colors.brand.primary} />
                    </Pressable>
                  </Pressable>
                  {index < recentFoods.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Manual Entry */}
          <View style={styles.section}>
            <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              Quick Add
            </Typography>
            <View style={[styles.card, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              <View style={styles.manualRow}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    Food Name
                  </Typography>
                  <TextInput
                    style={[styles.manualInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800], borderColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }]}
                    placeholder="Enter food name"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    Calories
                  </Typography>
                  <TextInput
                    style={[styles.manualInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800], borderColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <Pressable style={styles.saveButton}>
          <Typography variant="bodyText" style={styles.saveText}>Add to {mealTypes.find(m => m.id === selectedMeal)?.label}</Typography>
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
  mealSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: Colors.neutral[200],
  },
  mealLabel: {
    marginTop: 4,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  barcodeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    ...Shadows.sm,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  foodInfo: {
    flex: 1,
  },
  addButton: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  manualRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  inputGroup: {
    flex: 1,
  },
  manualInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
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
