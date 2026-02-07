import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { geminiService, MealAnalysis } from '@/services/gemini';
import { useDailyLogStore } from '@/store/dailyLog';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export default function MealScanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const cameraRef = useRef<CameraView>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [foodDescription, setFoodDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  
  const scanProgress = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const addFood = useDailyLogStore((state) => state.addFood);

  // Request permission on mount
  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Pulse animation for scan frame
  React.useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
        // If we have base64, analyze immediately
        if (photo.base64) {
          analyzeImage(photo.base64);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'Failed to capture photo. Please try again.');
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    
    try {
      const analysis = await geminiService.analyzeMealFromImage(base64Image, 'image/jpeg');
      setResult(analysis);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Image analysis failed:', error);
      Alert.alert('Analysis Failed', 'Could not analyze the image. Please try describing the meal instead.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!foodDescription.trim()) {
      Alert.alert('Enter food description', 'Please describe what you ate');
      return;
    }
    
    setAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const analysis = await geminiService.analyzeMealFromText(foodDescription);
      setResult(analysis);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Analysis Failed', 'Could not analyze your meal. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogMeal = () => {
    if (!result) return;
    
    addFood({
      name: result.foodName,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fats: result.fats,
      aiAnalyzed: true,
    });
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Meal Logged!',
      `${result.foodName} (${result.calories} kcal) added to your daily log.`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  const handleScanAgain = () => {
    setResult(null);
    setCapturedImage(null);
    setFoodDescription('');
    setShowTextInput(false);
    scanProgress.value = 0;
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  // Rotation animation for spinner
  const spinAnim = useSharedValue(0);
  React.useEffect(() => {
    if (analyzing) {
      spinAnim.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      spinAnim.value = 0;
    }
  }, [analyzing]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinAnim.value}deg` }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${scanProgress.value}%`,
  }));

  // Show permission request if not granted
  if (!permission?.granted) {
    return (
      <Screen>
        <ScreenContent padding="md">
          <View style={[styles.permissionContainer, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }]}>
            <Ionicons name="camera" size={80} color={Colors.brand.primary} />
            <Typography variant="h2" style={{ marginTop: 24, marginBottom: 12, textAlign: 'center', color: isDark ? Colors.neutral[50] : Colors.neutral[900] }}>
              Camera Access Needed
            </Typography>
            <Typography variant="bodyText" style={{ textAlign: 'center', marginBottom: 24, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              We need camera access to scan your meals and analyze them with AI.
            </Typography>
            <Pressable 
              style={[styles.permissionButton, { backgroundColor: Colors.brand.primary }]} 
              onPress={requestPermission}
            >
              <Typography variant="bodyText" style={{ color: Colors.neutral.white, fontWeight: '600' }}>
                Grant Permission
              </Typography>
            </Pressable>
          </View>
        </ScreenContent>
      </Screen>
    );
  }

  // Show result screen
  if (result) {
    return (
      <Screen>
        <ScreenContent padding="md">
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
            </Pressable>
            <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              AI Analysis
            </Typography>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Result Card */}
            <View style={[styles.resultCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
              <View style={styles.resultHeader}>
                <Typography variant="h2" style={{ color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
                  {result.foodName}
                </Typography>
                <View style={[styles.confidenceBadge, { backgroundColor: Colors.brand.primary + '20' }]}>
                  <Typography variant="caption" style={{ color: Colors.brand.primary, fontWeight: '600' }}>
                    {result.confidence} confidence
                  </Typography>
                </View>
              </View>

              <Typography variant="h1" style={{ marginTop: 16, marginBottom: 8, color: Colors.brand.primary }}>
                {result.calories} calories
              </Typography>

              <View style={styles.macrosContainer}>
                <View style={styles.macroItem}>
                  <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                    {result.protein}g
                  </Typography>
                  <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    Protein
                  </Typography>
                </View>
                <View style={[styles.macroDivider, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} />
                <View style={styles.macroItem}>
                  <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                    {result.carbs}g
                  </Typography>
                  <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    Carbs
                  </Typography>
                </View>
                <View style={[styles.macroDivider, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} />
                <View style={styles.macroItem}>
                  <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                    {result.fats}g
                  </Typography>
                  <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                    Fat
                  </Typography>
                </View>
              </View>

              <View style={styles.explanationRow}>
                <Ionicons name="sparkles" size={16} color={Colors.brand.primary} />
                <Typography variant="caption" style={{ marginLeft: 8, color: isDark ? Colors.neutral[400] : Colors.neutral[500], flex: 1 }}>
                  {result.explanation}
                </Typography>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable 
                style={[styles.actionButton, { backgroundColor: Colors.brand.primary }]} 
                onPress={handleLogMeal}
              >
                <Typography variant="bodyText" style={{ color: Colors.neutral.white, fontWeight: '700', fontSize: 16 }}>
                  Log Meal
                </Typography>
              </Pressable>
              <Pressable 
                style={[styles.actionButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} 
                onPress={handleScanAgain}
              >
                <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600], fontWeight: '600' }}>
                  Scan Again
                </Typography>
              </Pressable>
            </View>
          </ScrollView>
        </ScreenContent>
      </Screen>
    );
  }

  // Full Screen Camera View
  return (
    <View style={styles.fullScreenContainer}>
      {/* Camera */}
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={styles.fullScreenCamera} />
      ) : (
        <CameraView 
          ref={cameraRef} 
          style={styles.fullScreenCamera} 
          facing="back"
          mode="picture"
        />
      )}

      {/* Dark Overlay */}
      <View style={styles.darkOverlay}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={Colors.neutral.white} />
          </Pressable>
          <Typography variant="h3" style={styles.topBarTitle}>AI Meal Scan</Typography>
          <Pressable style={styles.iconButton} onPress={() => setShowTextInput(!showTextInput)}>
            <Ionicons name={showTextInput ? "camera" : "create-outline"} size={24} color={Colors.neutral.white} />
          </Pressable>
        </View>

        {/* Scan Frame - Only show when camera is active */}
        {!capturedImage && !analyzing && !showTextInput && (
          <View style={styles.scanFrameContainer}>
            <Animated.View style={[styles.scanFrameLarge, pulseStyle]}>
              <View style={[styles.corner, styles.cornerTL, { borderColor: Colors.brand.primary }]} />
              <View style={[styles.corner, styles.cornerTR, { borderColor: Colors.brand.primary }]} />
              <View style={[styles.corner, styles.cornerBL, { borderColor: Colors.brand.primary }]} />
              <View style={[styles.corner, styles.cornerBR, { borderColor: Colors.brand.primary }]} />
            </Animated.View>
            <Typography variant="bodyText" style={styles.scanFrameText}>
              Point camera at your meal
            </Typography>
          </View>
        )}

        {/* Text Input Overlay */}
        {showTextInput && !capturedImage && (
          <View style={styles.textInputOverlayFull}>
            <View style={[styles.textInputContainerFull, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              <TextInput
                style={[styles.fullScreenTextInput, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}
                placeholder="Describe your meal..."
                placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
                multiline
                value={foodDescription}
                onChangeText={setFoodDescription}
                autoFocus
              />
              <Pressable 
                style={[styles.analyzeTextButton, { backgroundColor: Colors.brand.primary }]} 
                onPress={handleTextAnalysis}
                disabled={analyzing || !foodDescription.trim()}
              >
                <Typography variant="bodyText" style={{ color: Colors.neutral.white, fontWeight: '700' }}>
                  {analyzing ? 'Analyzing...' : 'Analyze'}
                </Typography>
              </Pressable>
            </View>
          </View>
        )}

        {/* Analyzing Indicator */}
        {analyzing && (
          <View style={styles.analyzingOverlay}>
            <View style={[styles.analyzingContainer, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
              <Animated.View style={spinStyle}>
                <Ionicons name="sync" size={40} color={Colors.brand.primary} />
              </Animated.View>
              <Typography variant="h3" style={{ color: isDark ? Colors.neutral[50] : Colors.neutral[800], marginTop: 16 }}>
                Analyzing...
              </Typography>
              <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500], marginTop: 8 }}>
                AI is identifying your meal
              </Typography>
            </View>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomBar}>
          {!capturedImage && !showTextInput ? (
            /* Capture Button */
            <Pressable style={styles.captureButtonLarge} onPress={takePicture}>
              <View style={styles.captureButtonRing}>
                <View style={styles.captureButtonInnerLarge} />
              </View>
            </Pressable>
          ) : capturedImage && !analyzing ? (
            /* Retake Button */
            <View style={styles.reviewButtons}>
              <Pressable style={styles.retakeButtonLarge} onPress={() => setCapturedImage(null)}>
                <Ionicons name="refresh" size={28} color={Colors.neutral.white} />
              </Pressable>
              <Typography variant="caption" style={{ color: Colors.neutral.white, marginTop: 8 }}>
                Retake
              </Typography>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Permission Screen
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 500,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },

  // Result Screen
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
  resultCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  macroDivider: {
    width: 1,
    height: 40,
  },
  explanationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  // Full Screen Camera
  fullScreenContainer: {
    flex: 1,
    backgroundColor: Colors.neutral[900],
  },
  fullScreenCamera: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBarTitle: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  scanFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameLarge: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 20 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 20 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 20 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 20 },
  scanFrameText: {
    color: Colors.neutral.white,
    marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  textInputOverlayFull: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 20,
  },
  textInputContainerFull: {
    borderRadius: 16,
    padding: 16,
  },
  fullScreenTextInput: {
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  analyzeTextButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  analyzingContainer: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  captureButtonLarge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInnerLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.neutral.white,
  },
  reviewButtons: {
    alignItems: 'center',
  },
  retakeButtonLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
