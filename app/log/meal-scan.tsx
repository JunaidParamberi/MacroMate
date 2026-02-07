import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function MealScanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const scanProgress = useSharedValue(0);

  const handleScan = () => {
    setScanning(true);
    scanProgress.value = withSpring(100, { duration: 2000 });
    
    setTimeout(() => {
      setScanning(false);
      setResult({
        food: 'Caesar Salad with Grilled Chicken',
        calories: 420,
        confidence: 95,
        items: [
          { name: 'Romaine Lettuce', amount: '2 cups' },
          { name: 'Grilled Chicken', amount: '4 oz' },
          { name: 'Parmesan Cheese', amount: '2 tbsp' },
          { name: 'Caesar Dressing', amount: '2 tbsp' },
          { name: 'Croutons', amount: '1/4 cup' },
        ],
      });
    }, 2000);
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${scanProgress.value}%`,
  }));

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            AI Meal Scan
          </Typography>
          <Pressable style={styles.galleryButton}>
            <Ionicons name="images" size={24} color={Colors.brand.primary} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {!result ? (
            <>
              {/* Camera Preview Placeholder */}
              <View style={[styles.cameraPreview, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[200] }]}>
                <Ionicons name="scan-outline" size={80} color={isDark ? Colors.neutral[600] : Colors.neutral[400]} />
                <Typography variant="bodyText" style={{ marginTop: 16, color: isDark ? Colors.neutral[500] : Colors.neutral[500] }}>
                  Point camera at your meal
                </Typography>
                
                {/* Scan Frame */}
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.cornerTL, { borderColor: Colors.brand.primary }]} />
                  <View style={[styles.corner, styles.cornerTR, { borderColor: Colors.brand.primary }]} />
                  <View style={[styles.corner, styles.cornerBL, { borderColor: Colors.brand.primary }]} />
                  <View style={[styles.corner, styles.cornerBR, { borderColor: Colors.brand.primary }]} />
                </View>
              </View>

              {/* Scan Progress */}
              {scanning && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]}>
                    <Animated.View style={[styles.progressFill, { backgroundColor: Colors.brand.primary }, progressStyle]} />
                  </View>
                  <Typography variant="metaLabel" style={{ marginTop: 8, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    AI is analyzing your meal...
                  </Typography>
                </View>
              )}

              {/* Scan Button */}
              <Pressable style={styles.scanButton} onPress={handleScan}>
                <Ionicons name="scan" size={28} color={Colors.neutral.white} />
                <Typography variant="bodyText" style={styles.scanButtonText}>
                  {scanning ? 'Scanning...' : 'Scan Meal'}
                </Typography>
              </Pressable>

              {/* Gallery Option */}
              <Pressable style={[styles.galleryOption, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}>
                <Ionicons name="image" size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[500]} />
                <Typography variant="bodyText" style={{ marginLeft: 12, color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                  Choose from Gallery
                </Typography>
              </Pressable>
            </>
          ) : (
            <>
              {/* Result Card */}
              <View style={[styles.resultCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
                <View style={styles.resultHeader}>
                  <Typography variant="h2" style={{ color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                    {result.food}
                  </Typography>
                  <View style={[styles.confidenceBadge, { backgroundColor: Colors.brand.primary + '20' }]}>
                    <Typography variant="caption" style={{ color: Colors.brand.primary, fontWeight: '600' }}>
                      {result.confidence}% Match
                    </Typography>
                  </View>
                </View>

                <Typography variant="h3" style={{ marginTop: 16, marginBottom: 8, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                  {result.calories} calories
                </Typography>

                <Typography variant="metaLabel" style={{ marginBottom: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                  Detected Items:
                </Typography>

                {result.items.map((item: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={[styles.bullet, { backgroundColor: Colors.brand.primary }]} />
                    <Typography variant="bodyText" style={{ flex: 1, color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                      {item.name}
                    </Typography>
                    <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[500] : Colors.neutral[500] }}>
                      {item.amount}
                    </Typography>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable style={[styles.actionButton, { backgroundColor: Colors.brand.primary }]}>
                  <Typography variant="bodyText" style={{ color: Colors.neutral.white, fontWeight: '600' }}>
                    Log Meal
                  </Typography>
                </Pressable>
                <Pressable 
                  style={[styles.actionButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} 
                  onPress={() => setResult(null)}
                >
                  <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                    Scan Again
                  </Typography>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
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
  galleryButton: {
    padding: 8,
  },
  cameraPreview: {
    height: 300,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  scanFrame: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scanButton: {
    backgroundColor: Colors.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  scanButtonText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
  galleryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  resultCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Shadows.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});
