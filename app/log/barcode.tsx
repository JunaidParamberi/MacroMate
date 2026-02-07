import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function BarcodeScanScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLinePosition = useSharedValue(0);

  useEffect(() => {
    scanLinePosition.value = withSpring(280, {
      damping: 10,
      stiffness: 50,
      mass: 1,
    });
  }, []);

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

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={scanned ? undefined : (result: any) => {
          setScanned(true);
          console.log('Barcode scanned:', result.data);
        }}
      />
      
      {/* Header Overlay */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.neutral.white} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>Scan Barcode</Typography>
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
        
        {scanned && (
          <Pressable style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Typography variant="bodyText" style={styles.rescanText}>Tap to Scan Again</Typography>
          </Pressable>
        )}
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
  header: {
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
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
  rescanButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.brand.primary,
    borderRadius: 12,
  },
  rescanText: {
    color: Colors.neutral.white,
    fontWeight: '600',
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
});
