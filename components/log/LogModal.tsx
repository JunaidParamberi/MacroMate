import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ICON_SIZE = (width - 80) / 4;

interface LogModalProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

const logOptions = [
  { id: 'food', icon: 'restaurant', label: 'Food', color: Colors.brand.primary, route: '/log/food' },
  { id: 'barcode', icon: 'barcode', label: 'Barcode', color: Colors.activityColors.active, route: '/log/barcode' },
  { id: 'voice', icon: 'mic', label: 'Voice', color: Colors.activityColors.running, route: '/log/voice' },
  { id: 'meal-scan', icon: 'scan', label: 'AI Scan', color: Colors.brand.accent, route: '/log/meal-scan' },
  { id: 'water', icon: 'water', label: 'Water', color: Colors.activityColors.active, route: '/log/water' },
  { id: 'weight', icon: 'scale', label: 'Weight', color: Colors.activityColors.gym, route: '/log/weight' },
  { id: 'exercise', icon: 'fitness', label: 'Workout', color: Colors.activityColors.running, route: '/log/exercise' },
];

export default function LogModal({ visible, onClose, isDark }: LogModalProps) {
  const router = useRouter();
  const translateY = useSharedValue(300);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 200 });
    } else {
      translateY.value = withTiming(300, { duration: 200 });
    }
  }, [visible]);

  const handleOptionPress = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 150);
  };

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => {
    translateY.value = withTiming(300, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const topRow = logOptions.slice(0, 4);
  const bottomRow = logOptions.slice(4);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View style={[styles.modal, modalStyle, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral.white }]}>
          <View style={styles.handle} />
          <View style={styles.grid}>
            <View style={styles.row}>
              {topRow.map((option) => (
                <OptionButton key={option.id} option={option} isDark={isDark} onPress={() => handleOptionPress(option.route)} />
              ))}
            </View>
            <View style={styles.row}>
              {bottomRow.map((option) => (
                <OptionButton key={option.id} option={option} isDark={isDark} onPress={() => handleOptionPress(option.route)} />
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function OptionButton({ option, isDark, onPress }: { option: any; isDark: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.optionButton} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
        <Ionicons name={option.icon} size={24} color={Colors.neutral.white} />
      </View>
      <Text style={[styles.optionLabel, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}>
        {option.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    bottom: 250,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[400],
    alignSelf: 'center',
    marginBottom: 24,
  },
  grid: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
