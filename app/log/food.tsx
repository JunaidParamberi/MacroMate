import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { geminiService } from '@/services/gemini';
import { useDailyLogStore } from '@/store/dailyLog';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunny' },
  { id: 'lunch', label: 'Lunch', icon: 'sunny' },
  { id: 'dinner', label: 'Dinner', icon: 'moon' },
  { id: 'snack', label: 'Snack', icon: 'cafe' },
];

// Comprehensive food database with 100+ common foods
const foodDatabase = [
  // Proteins
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Beef Steak (100g)', calories: 250, protein: 26, carbs: 0, fat: 17 },
  { name: 'Egg (Large)', calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Egg Whites (100g)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { name: 'Turkey Breast (100g)', calories: 135, protein: 30, carbs: 0, fat: 1 },
  { name: 'Tuna (100g)', calories: 132, protein: 28, carbs: 0, fat: 1 },
  { name: 'Shrimp (100g)', calories: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { name: 'Pork Loin (100g)', calories: 143, protein: 26, carbs: 0, fat: 3.5 },
  { name: 'Tofu (100g)', calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  { name: 'Greek Yogurt (1 cup)', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { name: 'Cottage Cheese (1 cup)', calories: 163, protein: 28, carbs: 6, fat: 2.3 },
  { name: 'Whey Protein (1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 1 },
  { name: 'Protein Bar (Generic)', calories: 200, protein: 20, carbs: 22, fat: 8 },
  { name: 'Lentils (1 cup cooked)', calories: 230, protein: 18, carbs: 40, fat: 0.8 },
  { name: 'Black Beans (1 cup)', calories: 227, protein: 15, carbs: 41, fat: 0.9 },
  { name: 'Chickpeas (1 cup)', calories: 269, protein: 15, carbs: 45, fat: 4.2 },
  { name: 'Tempeh (100g)', calories: 193, protein: 19, carbs: 9, fat: 11 },
  { name: 'Edamame (1 cup)', calories: 188, protein: 18.5, carbs: 13.8, fat: 8 },
  { name: 'Almonds (1 oz)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 7, carbs: 8, fat: 16 },
  
  // Grains & Carbs
  { name: 'Rice - White (1 cup cooked)', calories: 242, protein: 4.4, carbs: 53, fat: 0.4 },
  { name: 'Rice - Brown (1 cup cooked)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: 'Quinoa (1 cup cooked)', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
  { name: 'Oats - Rolled (1 cup cooked)', calories: 166, protein: 6, carbs: 32, fat: 3.6 },
  { name: 'Oatmeal with Milk', calories: 150, protein: 6, carbs: 27, fat: 2.5 },
  { name: 'Whole Wheat Bread (1 slice)', calories: 80, protein: 4, carbs: 13, fat: 1 },
  { name: 'White Bread (1 slice)', calories: 75, protein: 2.5, carbs: 14, fat: 0.9 },
  { name: 'Pasta - Cooked (1 cup)', calories: 221, protein: 8, carbs: 43, fat: 1.3 },
  { name: 'Sweet Potato (Medium)', calories: 112, protein: 2, carbs: 26, fat: 0.1 },
  { name: 'Potato - White (Medium)', calories: 163, protein: 4, carbs: 37, fat: 0.2 },
  { name: 'Bagel', calories: 289, protein: 11, carbs: 56, fat: 2 },
  { name: 'English Muffin', calories: 129, protein: 5, carbs: 25, fat: 1 },
  { name: 'Tortilla - Flour (Large)', calories: 218, protein: 6, carbs: 36, fat: 5 },
  { name: 'Couscous (1 cup cooked)', calories: 176, protein: 6, carbs: 36, fat: 0.3 },
  { name: 'Barley (1 cup cooked)', calories: 193, protein: 3.5, carbs: 44, fat: 0.7 },
  { name: 'Cereal - Cornflakes (1 cup)', calories: 100, protein: 2, carbs: 24, fat: 0 },
  { name: 'Granola (1 cup)', calories: 400, protein: 11, carbs: 73, fat: 12 },
  { name: 'Popcorn - Air Popped (3 cups)', calories: 93, protein: 3, carbs: 19, fat: 1.1 },
  { name: 'Crackers - Whole Wheat (10)', calories: 120, protein: 3, carbs: 20, fat: 4 },
  
  // Fruits
  { name: 'Apple (Medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana (Medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: 'Orange (Medium)', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { name: 'Blueberries (1 cup)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5 },
  { name: 'Strawberries (1 cup)', calories: 49, protein: 1, carbs: 12, fat: 0.5 },
  { name: 'Raspberries (1 cup)', calories: 64, protein: 1.5, carbs: 15, fat: 0.8 },
  { name: 'Grapes (1 cup)', calories: 104, protein: 1.1, carbs: 27, fat: 0.2 },
  { name: 'Mango (1 cup)', calories: 99, protein: 1.4, carbs: 25, fat: 0.6 },
  { name: 'Pineapple (1 cup)', calories: 82, protein: 0.9, carbs: 22, fat: 0.2 },
  { name: 'Watermelon (1 cup)', calories: 46, protein: 0.9, carbs: 12, fat: 0.2 },
  { name: 'Peach (Medium)', calories: 59, protein: 1.4, carbs: 14, fat: 0.4 },
  { name: 'Pear (Medium)', calories: 101, protein: 0.6, carbs: 27, fat: 0.2 },
  { name: 'Kiwi (1 fruit)', calories: 42, protein: 0.8, carbs: 10, fat: 0.4 },
  { name: 'Avocado (Half)', calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: 'Lemon Juice (1 tbsp)', calories: 4, protein: 0.1, carbs: 1.3, fat: 0 },
  
  // Vegetables
  { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: 'Spinach (1 cup)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
  { name: 'Kale (1 cup)', calories: 33, protein: 2.9, carbs: 6, fat: 0.6 },
  { name: 'Carrots (1 cup)', calories: 52, protein: 1.2, carbs: 12, fat: 0.3 },
  { name: 'Bell Pepper (1 cup)', calories: 31, protein: 1, carbs: 7, fat: 0.3 },
  { name: 'Cucumber (1 cup)', calories: 16, protein: 0.7, carbs: 4, fat: 0.1 },
  { name: 'Tomato (1 cup)', calories: 32, protein: 1.6, carbs: 7, fat: 0.4 },
  { name: 'Lettuce (1 cup)', calories: 5, protein: 0.5, carbs: 1, fat: 0.1 },
  { name: 'Onion (1 cup)', calories: 64, protein: 1.8, carbs: 15, fat: 0.2 },
  { name: 'Garlic (1 clove)', calories: 4, protein: 0.2, carbs: 1, fat: 0 },
  { name: 'Mushrooms (1 cup)', calories: 21, protein: 2, carbs: 3.3, fat: 0.3 },
  { name: 'Asparagus (1 cup)', calories: 27, protein: 3, carbs: 5, fat: 0.2 },
  { name: 'Green Beans (1 cup)', calories: 31, protein: 1.8, carbs: 7, fat: 0.1 },
  { name: 'Brussels Sprouts (1 cup)', calories: 56, protein: 4, carbs: 12, fat: 0.4 },
  { name: 'Cauliflower (1 cup)', calories: 27, protein: 2, carbs: 5, fat: 0.3 },
  { name: 'Zucchini (1 cup)', calories: 19, protein: 1.4, carbs: 3.5, fat: 0.2 },
  { name: 'Celery (1 cup)', calories: 14, protein: 0.7, carbs: 3, fat: 0.2 },
  { name: 'Peas (1 cup)', calories: 118, protein: 8, carbs: 21, fat: 0.6 },
  { name: 'Corn (1 cup)', calories: 132, protein: 5, carbs: 31, fat: 1.8 },
  
  // Prepared Foods & Meals
  { name: 'Grilled Chicken Salad', calories: 350, protein: 45, carbs: 12, fat: 8 },
  { name: 'Chicken Caesar Salad', calories: 470, protein: 40, carbs: 12, fat: 28 },
  { name: 'Caesar Salad (no chicken)', calories: 300, protein: 8, carbs: 12, fat: 26 },
  { name: 'Chicken Wrap', calories: 450, protein: 30, carbs: 45, fat: 15 },
  { name: 'Turkey Sandwich', calories: 380, protein: 25, carbs: 40, fat: 12 },
  { name: 'Tuna Salad Sandwich', calories: 400, protein: 24, carbs: 38, fat: 18 },
  { name: 'PB&J Sandwich', calories: 380, protein: 12, carbs: 50, fat: 16 },
  { name: 'Grilled Cheese', calories: 350, protein: 12, carbs: 30, fat: 20 },
  { name: 'Chicken Stir Fry', calories: 300, protein: 25, carbs: 25, fat: 10 },
  { name: 'Beef Stir Fry', calories: 350, protein: 26, carbs: 20, fat: 18 },
  { name: 'Spaghetti with Meat Sauce', calories: 450, protein: 20, carbs: 60, fat: 15 },
  { name: 'Pizza - Cheese (1 slice)', calories: 272, protein: 12, carbs: 34, fat: 10 },
  { name: 'Pizza - Pepperoni (1 slice)', calories: 300, protein: 14, carbs: 34, fat: 14 },
  { name: 'Burger (Standard)', calories: 540, protein: 28, carbs: 40, fat: 30 },
  { name: 'Chicken Nuggets (6 pc)', calories: 280, protein: 13, carbs: 18, fat: 17 },
  { name: 'French Fries - Medium', calories: 365, protein: 4, carbs: 48, fat: 17 },
  { name: 'Sweet Potato Fries', calories: 320, protein: 4, carbs: 50, fat: 12 },
  { name: 'Onion Rings (6)', calories: 250, protein: 3, carbs: 30, fat: 14 },
  { name: 'Fish and Chips', calories: 850, protein: 32, carbs: 80, fat: 48 },
  { name: 'Tacos (2)', calories: 400, protein: 20, carbs: 35, fat: 20 },
  { name: 'Burrito (Standard)', calories: 550, protein: 20, carbs: 70, fat: 20 },
  { name: 'Burrito Bowl', calories: 650, protein: 30, carbs: 75, fat: 22 },
  { name: 'Sushi - California Roll (8)', calories: 255, protein: 9, carbs: 38, fat: 7 },
  { name: 'Sushi - Salmon Roll (8)', calories: 320, protein: 15, carbs: 48, fat: 8 },
  { name: 'Pad Thai', calories: 600, protein: 20, carbs: 90, fat: 18 },
  { name: 'Chicken Tikka Masala', calories: 450, protein: 35, carbs: 20, fat: 25 },
  { name: 'Butter Chicken', calories: 520, protein: 38, carbs: 15, fat: 32 },
  { name: 'Rice and Beans', calories: 300, protein: 12, carbs: 55, fat: 4 },
  
  // Breakfast Items
  { name: 'Scrambled Eggs (2)', calories: 140, protein: 12, carbs: 2, fat: 10 },
  { name: 'Fried Eggs (2)', calories: 180, protein: 12, carbs: 1, fat: 14 },
  { name: 'Bacon (3 slices)', calories: 130, protein: 9, carbs: 0.5, fat: 10 },
  { name: 'Turkey Bacon (3 slices)', calories: 90, protein: 12, carbs: 1, fat: 4 },
  { name: 'Sausage Links (2)', calories: 180, protein: 10, carbs: 1, fat: 16 },
  { name: 'Pancakes (3)', calories: 330, protein: 9, carbs: 60, fat: 7 },
  { name: 'Waffles (2)', calories: 310, protein: 8, carbs: 50, fat: 10 },
  { name: 'French Toast (2 slices)', calories: 300, protein: 10, carbs: 40, fat: 12 },
  { name: 'Omelette (2 eggs)', calories: 200, protein: 14, carbs: 4, fat: 14 },
  { name: 'Breakfast Burrito', calories: 450, protein: 20, carbs: 45, fat: 20 },
  { name: 'Cereal with Milk', calories: 200, protein: 8, carbs: 35, fat: 3 },
  { name: 'Granola with Yogurt', calories: 280, protein: 12, carbs: 40, fat: 10 },
  { name: 'Smoothie - Green', calories: 250, protein: 5, carbs: 45, fat: 6 },
  { name: 'Smoothie - Protein', calories: 300, protein: 25, carbs: 35, fat: 8 },
  { name: 'Bagel with Cream Cheese', calories: 350, protein: 10, carbs: 56, fat: 9 },
  { name: 'Avocado Toast', calories: 320, protein: 8, carbs: 30, fat: 20 },
  { name: 'Eggs Benedict', calories: 450, protein: 20, carbs: 25, fat: 30 },
  
  // Soups & Sauces
  { name: 'Chicken Noodle Soup (1 cup)', calories: 75, protein: 6, carbs: 10, fat: 2 },
  { name: 'Tomato Soup (1 cup)', calories: 100, protein: 2, carbs: 20, fat: 2 },
  { name: 'Vegetable Soup (1 cup)', calories: 80, protein: 3, carbs: 15, fat: 2 },
  { name: 'Minestrone (1 cup)', calories: 120, protein: 5, carbs: 20, fat: 3 },
  { name: 'Cream of Mushroom (1 cup)', calories: 200, protein: 4, carbs: 15, fat: 15 },
  { name: 'Chili (1 cup)', calories: 250, protein: 20, carbs: 25, fat: 10 },
  { name: 'Marinara Sauce (1/2 cup)', calories: 70, protein: 2, carbs: 11, fat: 2 },
  { name: 'Alfredo Sauce (1/2 cup)', calories: 200, protein: 4, carbs: 4, fat: 18 },
  { name: 'Soy Sauce (1 tbsp)', calories: 10, protein: 1, carbs: 1, fat: 0 },
  { name: 'BBQ Sauce (2 tbsp)', calories: 60, protein: 0, carbs: 15, fat: 0 },
  { name: 'Ketchup (1 tbsp)', calories: 20, protein: 0, carbs: 5, fat: 0 },
  { name: 'Mayonnaise (1 tbsp)', calories: 90, protein: 0, carbs: 0, fat: 10 },
  { name: 'Mustard (1 tbsp)', calories: 10, protein: 0.5, carbs: 1, fat: 0 },
  { name: 'Hummus (2 tbsp)', calories: 70, protein: 2, carbs: 6, fat: 5 },
  { name: 'Guacamole (2 tbsp)', calories: 45, protein: 0.5, carbs: 2, fat: 4 },
  { name: 'Salsa (2 tbsp)', calories: 10, protein: 0.5, carbs: 2, fat: 0 },
  
  // Dairy & Milk
  { name: 'Milk - Whole (1 cup)', calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: 'Milk - 2% (1 cup)', calories: 122, protein: 8, carbs: 12, fat: 5 },
  { name: 'Milk - Skim (1 cup)', calories: 83, protein: 8, carbs: 12, fat: 0.2 },
  { name: 'Almond Milk (1 cup)', calories: 40, protein: 1, carbs: 2, fat: 3 },
  { name: 'Oat Milk (1 cup)', calories: 130, protein: 4, carbs: 24, fat: 2.5 },
  { name: 'Cheese - Cheddar (1 oz)', calories: 115, protein: 7, carbs: 0.4, fat: 9 },
  { name: 'Cheese - Mozzarella (1 oz)', calories: 85, protein: 6, carbs: 1, fat: 6 },
  { name: 'Cheese - Parmesan (1 oz)', calories: 110, protein: 10, carbs: 1, fat: 7 },
  { name: 'Cream Cheese (1 oz)', calories: 100, protein: 2, carbs: 1, fat: 10 },
  { name: 'Butter (1 tbsp)', calories: 102, protein: 0, carbs: 0, fat: 12 },
  { name: 'Olive Oil (1 tbsp)', calories: 120, protein: 0, carbs: 0, fat: 14 },
  { name: 'Coconut Oil (1 tbsp)', calories: 120, protein: 0, carbs: 0, fat: 14 },
  
  // Beverages
  { name: 'Coffee - Black', calories: 2, protein: 0.3, carbs: 0, fat: 0 },
  { name: 'Coffee with Milk', calories: 30, protein: 1, carbs: 3, fat: 1 },
  { name: 'Latte (12 oz)', calories: 150, protein: 9, carbs: 12, fat: 6 },
  { name: 'Cappuccino (12 oz)', calories: 100, protein: 6, carbs: 8, fat: 4 },
  { name: 'Americano', calories: 15, protein: 1, carbs: 2, fat: 0 },
  { name: 'Tea - Green', calories: 2, protein: 0, carbs: 0.5, fat: 0 },
  { name: 'Tea - Black', calories: 2, protein: 0, carbs: 0.5, fat: 0 },
  { name: 'Orange Juice (1 cup)', calories: 112, protein: 2, carbs: 26, fat: 0.5 },
  { name: 'Apple Juice (1 cup)', calories: 114, protein: 0.5, carbs: 28, fat: 0.3 },
  { name: 'Coca-Cola (12 oz)', calories: 140, protein: 0, carbs: 39, fat: 0 },
  { name: 'Sprite (12 oz)', calories: 140, protein: 0, carbs: 38, fat: 0 },
  { name: 'Gatorade (20 oz)', calories: 130, protein: 0, carbs: 34, fat: 0 },
  { name: 'Beer (12 oz)', calories: 150, protein: 1, carbs: 13, fat: 0 },
  { name: 'Wine - Red (5 oz)', calories: 125, protein: 0.1, carbs: 3.8, fat: 0 },
  { name: 'Wine - White (5 oz)', calories: 121, protein: 0.1, carbs: 3.8, fat: 0 },
  { name: 'Vodka (1.5 oz)', calories: 97, protein: 0, carbs: 0, fat: 0 },
  { name: 'Whiskey (1.5 oz)', calories: 97, protein: 0, carbs: 0, fat: 0 },
  { name: 'Margarita', calories: 200, protein: 0, carbs: 15, fat: 0 },
  { name: 'Mojito', calories: 160, protein: 0, carbs: 12, fat: 0 },
  { name: 'Water', calories: 0, protein: 0, carbs: 0, fat: 0 },
  { name: 'Sparkling Water', calories: 0, protein: 0, carbs: 0, fat: 0 },
  { name: 'Coconut Water (1 cup)', calories: 46, protein: 2, carbs: 9, fat: 0.5 },
  
  // Desserts & Sweets
  { name: 'Chocolate Bar (1.5 oz)', calories: 220, protein: 3, carbs: 24, fat: 13 },
  { name: 'Dark Chocolate (1 oz)', calories: 170, protein: 2, carbs: 13, fat: 12 },
  { name: 'Ice Cream - Vanilla (1/2 cup)', calories: 137, protein: 2, carbs: 16, fat: 7 },
  { name: 'Ice Cream - Chocolate (1/2 cup)', calories: 143, protein: 2.5, carbs: 17, fat: 7.5 },
  { name: 'Cookies - Chocolate Chip (2)', calories: 150, protein: 2, carbs: 20, fat: 8 },
  { name: 'Brownie (1 piece)', calories: 240, protein: 3, carbs: 35, fat: 10 },
  { name: 'Cheesecake (1 slice)', calories: 400, protein: 7, carbs: 32, fat: 28 },
  { name: 'Apple Pie (1 slice)', calories: 300, protein: 3, carbs: 43, fat: 13 },
  { name: 'Donut (1)', calories: 250, protein: 3, carbs: 32, fat: 12 },
  { name: 'Croissant (1)', calories: 272, protein: 5, carbs: 31, fat: 14 },
  { name: 'Muffin - Blueberry (1)', calories: 275, protein: 5, carbs: 38, fat: 11 },
  { name: 'Cake - Birthday (1 slice)', calories: 350, protein: 3, carbs: 52, fat: 14 },
  { name: 'Cupcake (1)', calories: 200, protein: 2, carbs: 30, fat: 8 },
  { name: 'Pudding (1/2 cup)', calories: 150, protein: 2, carbs: 25, fat: 5 },
  { name: 'Jello (1/2 cup)', calories: 80, protein: 2, carbs: 19, fat: 0 },
  { name: 'Fruit Salad (1 cup)', calories: 90, protein: 1, carbs: 22, fat: 0.3 },
  { name: 'Honey (1 tbsp)', calories: 64, protein: 0, carbs: 17, fat: 0 },
  { name: 'Maple Syrup (1 tbsp)', calories: 52, protein: 0, carbs: 13, fat: 0 },
  { name: 'Sugar (1 tbsp)', calories: 48, protein: 0, carbs: 12, fat: 0 },
  
  // Snacks
  { name: 'Chips - Potato (1 oz)', calories: 160, protein: 2, carbs: 15, fat: 10 },
  { name: 'Chips - Tortilla (1 oz)', calories: 140, protein: 2, carbs: 19, fat: 7 },
  { name: 'Pretzels (1 oz)', calories: 110, protein: 3, carbs: 23, fat: 1 },
  { name: 'Popcorn - Microwave (3 cups)', calories: 120, protein: 3, carbs: 20, fat: 4 },
  { name: 'Trail Mix (1/4 cup)', calories: 170, protein: 5, carbs: 16, fat: 10 },
  { name: 'Energy Bar', calories: 220, protein: 10, carbs: 30, fat: 8 },
  { name: 'Beef Jerky (1 oz)', calories: 80, protein: 9, carbs: 3, fat: 1 },
  { name: 'Rice Cakes (2)', calories: 70, protein: 1, carbs: 14, fat: 0.5 },
  { name: 'Pita Chips (1 oz)', calories: 130, protein: 3, carbs: 18, fat: 5 },
  { name: 'Veggie Sticks (1 cup)', calories: 50, protein: 1, carbs: 10, fat: 0 },
  { name: 'Hummus with Veggies', calories: 150, protein: 5, carbs: 15, fat: 8 },
  { name: 'Cheese and Crackers', calories: 200, protein: 8, carbs: 15, fat: 12 },
  { name: 'Apple with Peanut Butter', calories: 280, protein: 8, carbs: 30, fat: 16 },
  { name: 'Yogurt Parfait', calories: 250, protein: 12, carbs: 38, fat: 4 },
  { name: 'Fruit Smoothie (16 oz)', calories: 300, protein: 5, carbs: 65, fat: 3 },
  { name: 'Protein Shake', calories: 160, protein: 25, carbs: 9, fat: 3 },
];

// Recent foods (limited to last 3)
const recentFoods = foodDatabase.slice(0, 3);

export default function LogFoodScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const addFood = useDailyLogStore((state) => state.addFood);
  
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ name: string; calories: number; protein: number; carbs: number; fat: number } | null>(null);

  // Filter foods based on search query
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return foodDatabase.filter(food => 
      food.name.toLowerCase().includes(query)
    ).slice(0, 10); // Limit to 10 results
  }, [searchQuery]);

  // Check if search has no results
  const noResults = searchQuery.trim().length > 0 && filteredFoods.length === 0 && !aiAnalyzing && !aiSuggestion;

  const handleAddRecentFood = (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    addFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fat,
    });
    
    Alert.alert(
      'Food Added!',
      `${food.name} (${food.calories} kcal) added to your ${mealTypes.find(m => m.id === selectedMeal)?.label}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleAiLookup = async () => {
    if (!searchQuery.trim()) return;
    
    setAiAnalyzing(true);
    setAiSuggestion(null);
    
    try {
      const result = await geminiService.analyzeMealFromText(searchQuery);
      
      setAiSuggestion({
        name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fats,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('AI lookup failed:', error);
      Alert.alert('AI Lookup Failed', 'Could not analyze this food. Please try entering details manually.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleAddAiSuggestion = () => {
    if (!aiSuggestion) return;
    handleAddRecentFood(aiSuggestion);
  };

  const handleManualAdd = () => {
    if (!foodName.trim() || !calories.trim()) {
      Alert.alert('Missing Info', 'Please enter food name and calories');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    addFood({
      name: foodName.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fat) || 0,
    });
    
    Alert.alert(
      'Food Added!',
      `${foodName} (${calories} kcal) added to your ${mealTypes.find(m => m.id === selectedMeal)?.label}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

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

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Meal Type Selector */}
          <View style={styles.mealSelector}>
            {mealTypes.map((meal) => (
              <Pressable
                key={meal.id}
                style={[
                  styles.mealButton,
                  selectedMeal === meal.id && styles.mealButtonActive,
                ]}
                onPress={() => setSelectedMeal(meal.id)}
              >
                <Ionicons
                  name={meal.icon as any}
                  size={22}
                  color={selectedMeal === meal.id ? Colors.neutral.white : (isDark ? Colors.neutral[400] : Colors.neutral[500])}
                />
                <Typography
                  variant="caption"
                  style={[
                    styles.mealLabel,
                    selectedMeal === meal.id && styles.mealLabelActive,
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
            <Pressable style={styles.barcodeButton} onPress={() => router.push('/log/barcode')}>
              <Ionicons name="barcode" size={22} color={Colors.brand.primary} />
            </Pressable>
          </View>

          {/* Search Results - Show when user types */}
          {filteredFoods.length > 0 && (
            <View style={styles.section}>
              <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                Search Results
              </Typography>
              <View style={[styles.foodsCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
                {filteredFoods.map((food, index) => (
                  <Pressable 
                    key={index} 
                    style={[
                      styles.foodRow,
                      index < filteredFoods.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }
                    ]} 
                    onPress={() => handleAddRecentFood(food)}
                  >
                    <View style={styles.foodInfo}>
                      <Typography variant="bodyText" style={[styles.foodName, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                        {food.name}
                      </Typography>
                      <View style={styles.macroRow}>
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          {food.calories} cal
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          P: {food.protein}g
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          C: {food.carbs}g
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          F: {food.fat}g
                        </Typography>
                      </View>
                    </View>
                    <Pressable style={styles.addButton} onPress={() => handleAddRecentFood(food)}>
                      <View style={[styles.addButtonBg, { backgroundColor: Colors.brand.primary + '20' }]}>
                        <Ionicons name="add" size={20} color={Colors.brand.primary} />
                      </View>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* No Results - AI Lookup Option */}
          {noResults && (
            <View style={styles.section}>
              <View style={[styles.aiLookupCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
                <View style={styles.aiLookupHeader}>
                  <Ionicons name="search-outline" size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                  <Typography variant="bodyText" style={{ marginLeft: 12, color: isDark ? Colors.neutral[300] : Colors.neutral[600], flex: 1 }}>
                    No exact match for "{searchQuery}"
                  </Typography>
                </View>
                
                {!aiAnalyzing && !aiSuggestion && (
                  <Pressable 
                    style={[styles.aiLookupButton, { backgroundColor: Colors.brand.primary }]} 
                    onPress={handleAiLookup}
                  >
                    <Ionicons name="sparkles" size={20} color={Colors.neutral.white} />
                    <Typography variant="bodyText" style={{ marginLeft: 8, color: Colors.neutral.white, fontWeight: '600' }}>
                      Ask AI to Find Macros
                    </Typography>
                  </Pressable>
                )}
                
                {aiAnalyzing && (
                  <View style={styles.aiLoadingContainer}>
                    <ActivityIndicator size="small" color={Colors.brand.primary} />
                    <Typography variant="caption" style={{ marginLeft: 8, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                      AI is analyzing...
                    </Typography>
                  </View>
                )}
                
                {aiSuggestion && (
                  <View style={[styles.aiSuggestionCard, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50] }]}>
                    <View style={styles.aiSuggestionHeader}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.brand.primary} />
                      <Typography variant="bodyText" style={{ marginLeft: 8, color: Colors.brand.primary, fontWeight: '600' }}>
                        AI Found: {aiSuggestion.name}
                      </Typography>
                    </View>
                    <View style={styles.aiSuggestionMacros}>
                      <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                        {aiSuggestion.calories} cal • P: {aiSuggestion.protein}g • C: {aiSuggestion.carbs}g • F: {aiSuggestion.fat}g
                      </Typography>
                    </View>
                    <Pressable 
                      style={[styles.addAiButton, { backgroundColor: Colors.brand.primary }]} 
                      onPress={handleAddAiSuggestion}
                    >
                      <Typography variant="bodyText" style={{ color: Colors.neutral.white, fontWeight: '600' }}>
                        Add This Food
                      </Typography>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Recent Foods - Only show when not searching */}
          {!searchQuery.trim() && (
            <View style={styles.section}>
              <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                Recent Foods
              </Typography>
              <View style={[styles.foodsCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
                {recentFoods.map((food, index) => (
                  <Pressable 
                    key={index} 
                    style={[
                      styles.foodRow,
                      index < recentFoods.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }
                    ]} 
                    onPress={() => handleAddRecentFood(food)}
                  >
                    <View style={styles.foodInfo}>
                      <Typography variant="bodyText" style={[styles.foodName, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                        {food.name}
                      </Typography>
                      <View style={styles.macroRow}>
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          {food.calories} cal
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          P: {food.protein}g
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          C: {food.carbs}g
                        </Typography>
                        <View style={styles.dot} />
                        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                          F: {food.fat}g
                        </Typography>
                      </View>
                    </View>
                    <Pressable style={styles.addButton} onPress={() => handleAddRecentFood(food)}>
                      <View style={[styles.addButtonBg, { backgroundColor: Colors.brand.primary + '20' }]}>
                        <Ionicons name="add" size={20} color={Colors.brand.primary} />
                      </View>
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* AI Scan Card */}
          <Pressable 
            style={[styles.aiCard, { backgroundColor: isDark ? Colors.brand.primary + '20' : Colors.brand.primary + '10' }]}
            onPress={() => router.push('/log/meal-scan')}
          >
            <View style={[styles.aiIconContainer, { backgroundColor: Colors.brand.primary }]}>
              <Ionicons name="scan" size={24} color={Colors.neutral.white} />
            </View>
            <View style={styles.aiTextContainer}>
              <Typography variant="bodyText" style={[styles.aiTitle, { color: Colors.brand.primary }]}>
                AI Meal Scan
              </Typography>
              <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                Take a photo or describe your meal
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.brand.primary} />
          </Pressable>

          {/* Quick Add Form */}
          <View style={styles.section}>
            <Typography variant="h3" style={[styles.sectionTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              Quick Add
            </Typography>
            <View style={[styles.formCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
              {/* Food Name Input */}
              <View style={styles.inputWrapper}>
                <Typography variant="metaLabel" style={[styles.inputLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
                  Food Name
                </Typography>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50],
                      color: isDark ? Colors.neutral[50] : Colors.neutral[800],
                    }
                  ]}
                  placeholder="Enter food name"
                  placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                  value={foodName}
                  onChangeText={setFoodName}
                />
              </View>

              {/* Calories Row */}
              <View style={styles.caloriesRow}>
                <View style={styles.calorieInputWrapper}>
                  <Typography variant="metaLabel" style={[styles.inputLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
                    Calories
                  </Typography>
                  <TextInput
                    style={[
                      styles.numberInput,
                      { 
                        backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50],
                        color: isDark ? Colors.neutral[50] : Colors.neutral[800],
                      }
                    ]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                    value={calories}
                    onChangeText={setCalories}
                  />
                </View>
              </View>

              {/* Macros Row */}
              <View style={styles.macrosRow}>
                <View style={styles.macroInputWrapper}>
                  <Typography variant="metaLabel" style={[styles.inputLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
                    Protein (g)
                  </Typography>
                  <TextInput
                    style={[
                      styles.numberInput,
                      { 
                        backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50],
                        color: isDark ? Colors.neutral[50] : Colors.neutral[800],
                      }
                    ]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                    value={protein}
                    onChangeText={setProtein}
                  />
                </View>
                <View style={styles.macroInputWrapper}>
                  <Typography variant="metaLabel" style={[styles.inputLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
                    Carbs (g)
                  </Typography>
                  <TextInput
                    style={[
                      styles.numberInput,
                      { 
                        backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50],
                        color: isDark ? Colors.neutral[50] : Colors.neutral[800],
                      }
                    ]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                    value={carbs}
                    onChangeText={setCarbs}
                  />
                </View>
                <View style={styles.macroInputWrapper}>
                  <Typography variant="metaLabel" style={[styles.inputLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>
                    Fat (g)
                  </Typography>
                  <TextInput
                    style={[
                      styles.numberInput,
                      { 
                        backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[50],
                        color: isDark ? Colors.neutral[50] : Colors.neutral[800],
                      }
                    ]}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                    value={fat}
                    onChangeText={setFat}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <Pressable 
          style={[styles.saveButton, { backgroundColor: Colors.brand.primary }]} 
          onPress={handleManualAdd}
        >
          <Typography variant="bodyText" style={styles.saveText}>
            Add to {mealTypes.find(m => m.id === selectedMeal)?.label}
          </Typography>
        </Pressable>
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    gap: 8,
    marginBottom: 20,
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 6,
  },
  mealButtonActive: {
    backgroundColor: Colors.brand.primary,
  },
  mealLabel: {
    fontWeight: '600',
    fontSize: 11,
    color: Colors.neutral[500],
  },
  mealLabelActive: {
    color: Colors.neutral.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  barcodeButton: {
    padding: 4,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 14,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 10,
  },
  foodsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.neutral[400],
  },
  addButton: {
    marginLeft: 12,
  },
  addButtonBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 16,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputLabel: {
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 13,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  caloriesRow: {
    marginBottom: 14,
  },
  calorieInputWrapper: {
    width: 120,
  },
  numberInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  macroInputWrapper: {
    flex: 1,
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: {
    color: Colors.neutral.white,
    fontWeight: '700',
    fontSize: 16,
  },
  // AI Lookup Styles
  aiLookupCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  aiLookupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiLookupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  aiLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  aiSuggestionCard: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  aiSuggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionMacros: {
    paddingLeft: 28,
  },
  addAiButton: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
});
