import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Provide haptic feedback on both iOS and Android
        triggerHaptic();
        props.onPressIn?.(ev);
      }}
    />
  );
}

function triggerHaptic() {
  try {
    if (Platform.OS === 'ios') {
      // iOS: Use impact feedback for a more responsive feel
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (Platform.OS === 'android') {
      // Android: Use selection feedback for tab navigation
      Haptics.selectionAsync();
    }
  } catch (error) {
    // Silently fail if haptics are not supported
    console.log('Haptic feedback not supported:', error);
  }
}
