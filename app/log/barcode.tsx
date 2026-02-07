import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { useDailyLogStore } from '@/store/dailyLog';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Simple barcode food database (common products)
const barcodeDatabase: Record<string, { name: string; calories: number; protein: number; carbs: number; fat: number }> = {
  '737628064502': { name: 'Quest Protein Bar (Chocolate)', calories: 200, protein: 20, carbs: 22, fat: 8 },
  '040000527715': { name: 'Kind Bar (Almond & Coconut)', calories: 190, protein: 3, carbs: 17, fat: 15 },
  '037000186940': { name: 'Gatorade (20oz)', calories: 130, protein: 0, carbs: 34, fat: 0 },
  '04963406': { name: 'Coca-Cola (12oz)', calories: 140, protein: 0, carbs: 39, fat: 0 },
  '012345678901': { name: 'Banana (Medium)', calories: 105, protein: 1, carbs: 27, fat: 0 },
};

export default function BarcodeScanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [scannedFood, setScannedFood] = useState<{ name: string; calories: number; protein: number; carbs: number; fat: number } | null>(null);
  const scanLinePosition = useSharedValue(0);
  const addFood = useDailyLogStore((state) => state.addFood);

  useEffect(() => {
    scanLinePosition.value = withSpring(280, {
      damping: 10,
      stiffness: 50,
      mass: 1,
    });
  }, []);

  const handleBarcodeScanned = (data: string) => {
    setScanned(true);
    setBarcodeData(data);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Lookup food in database
    const food = barcodeDatabase[data];
    if (food) {
      setScannedFood(food);
    } else {
      // Unknown barcode - show manual entry option
      Alert.alert(
        'Unknown Product',
        `Barcode: ${data}\n\nThis product is not in our database. Would you like to add it manually?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setScanned(false) },
          { text: 'Add Manually', onPress: () => router.push('/log/food') },
        ]
      );
      setScanned(false);
    }
  };

  const handleAddFood = () => {
    if (!scannedFood) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    addFood({
      name: scannedFood.name,
      calories: scannedFood.calories,
      protein: scannedFood.protein,
      carbs: scannedFood.carbs,
      fats: scannedFood.fat,
    });
    
    Alert.alert(
      'Food Added!',
      `${scannedFood.name} (${scannedFood.calories} kcal) added to your log.`,
      [{ text: 'Great!', onPress: () => router.back() }]
    );
  };

  const handleScanAgain = () => {
    setScanned(false);
    setBarcodeData(null);
    setScannedFood(null);
  };

  const animatedScanLine = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <ScreenContent padding="md">
          <View style={styles.permissionContainer}>
            <Ionicons name="camera" size={64} color={Colors.brand.primary} />
            <Typography variant="h3" style={{ marginTop: 24, marginBottom: 12 }}>
              Camera Access Needed
            </Typography>
            <Typography variant="bodyText" style={{ textAlign: 'center', marginBottom: 24 }}>
              We need camera access to scan barcodes for food logging
            </Typography>
            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <Typography variant="bodyText" style={styles.permissionText}>Grant Permission</Typography>
            </Pressable>
          </View>
        </ScreenContent>
      </Screen>
    );
  }

  // Show result card if food found
  if (scanned && scannedFood) {
    return (
      <Screen>
        <ScreenContent padding="md">
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
            </Pressable>
            <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              Scan Result
            </Typography>
            <View style={{ width: 44 }} />
          </View>

          {/* Result Card */}
          <View style={[styles.resultCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }, Shadows.sm]}>
            <View style={[styles.barcodeIconContainer, { backgroundColor: Colors.brand.primary + '20' }]}>
              <Ionicons name="barcode" size={48} color={Colors.brand.primary} />
            </View>
            
            <Typography variant="h2" style={[styles.foodName, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
              {scannedFood.name}
            </Typography>
            
            <Typography variant="h3" style={[styles.calories, { color: Colors.brand.primary }]}>
              {scannedFood.calories} calories
            </Typography>
            
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                  {scannedFood.protein}g
                </Typography>
                <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                  Protein
                </Typography>
              </View>
              <View style={[styles.macroDivider, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} />
              <View style={styles.macroItem}>
                <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                  {scannedFood.carbs}g
                </Typography>
                <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                  Carbs
                </Typography>
              </View>
              <View style={[styles.macroDivider, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]} />
              <View style={styles.macroItem}>
                <Typography variant="bodyText" style={[styles.macroValue, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
                  {scannedFood.fat}g
                </Typography>
                <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
                  Fat
                </Typography>
              </View>
            </View>

            <Typography variant="caption" style={[styles.barcodeText, { color: isDark ? Colors.neutral[500] : Colors.neutral[400] }]}>
              Barcode: {barcodeData}
            </Typography>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.addButton, { backgroundColor: Colors.brand.primary }]}
              onPress={handleAddFood}
            >
              <Typography variant="bodyText" style={styles.addButtonText}>
                Add to Log
              </Typography>
            </Pressable>
            
            <Pressable 
              style={[styles.scanAgainButton, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]}
              onPress={handleScanAgain}
            >
              <Typography variant="bodyText" style={[styles.scanAgainText, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}>
                Scan Another
              </Typography>
            </Pressable>
          </View>
        </ScreenContent>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={scanned ? undefined : (result: any) => {
          handleBarcodeScanned(result.data);
        }}
      />
      
      {/* Header Overlay */}
      <View style={styles.headerOverlay}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.neutral.white} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitleOverlay}>Scan Barcode</Typography>
        <View style={{ width: 44 }} />
      </View>

      {/* Scan Frame Overlay */}
      <View style={styles.scanOverlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          
          <Animated.View style={[styles.scanLine, animatedScanLine]} />
        </View>
        
        <Typography variant="metaLabel" style={styles.scanText}>
          Align barcode within the frame
        </Typography>
      </View>

      {/* Bottom Controls Overlay */}
      <View style={styles.bottomControls}>
        <Pressable style={styles.flashButton}>
          <Ionicons name="flashlight" size={28} color={Colors.neutral.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  headerTitleOverlay: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  scanFrame: {
    width: 280,
    height: 200,
    borderRadius: 20,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.brand.primary,
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: Colors.brand.primary,
    borderRadius: 2,
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scanText: {
    color: Colors.neutral.white,
    marginTop: 24,
    fontSize: 14,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  flashButton: {
    padding: 16,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionButton: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
  // Result Screen Styles
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
    padding: 32,
    alignItems: 'center',
  },
  barcodeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  calories: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  barcodeText: {
    fontSize: 12,
    marginTop: 8,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.neutral.white,
    fontWeight: '700',
    fontSize: 16,
  },
  scanAgainButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  scanAgainText: {
    fontWeight: '600',
    fontSize: 15,
  },
});
