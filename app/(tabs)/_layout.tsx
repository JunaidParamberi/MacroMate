import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  const triggerHaptic = () => {
    try {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (Platform.OS === 'android') {
        Haptics.selectionAsync();
      }
    } catch (error) {
      // Silently fail if haptics are not supported
      console.log('Haptic feedback not supported:', error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={
                focused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          ),
          tabBarButton: HapticTab,
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ focused }) => (
            <Feather
              name="activity"
              size={24}
              color={
                focused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          ),
          tabBarButton: HapticTab,
        }}
      />

      {/* ⭐ CENTER FLOATING TAB BUTTON */}
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarButton: (props) => {
            const scale = useSharedValue(1);

            const animatedStyle = useAnimatedStyle(() => ({
              transform: [{ scale: scale.value }],
            }));

            // Filter out null values from props to fix TypeScript compatibility
            const filteredProps = Object.fromEntries(
              Object.entries(props).filter(([_, value]) => value !== null)
            );

            return (
              <Animated.View style={animatedStyle}>
                <TouchableOpacity
                  {...filteredProps}
                  style={[
                    styles.floatingButton,
                    { backgroundColor: Colors[colorScheme].tint },
                  ]}
                  onPressIn={() => {
                    triggerHaptic();
                    scale.value = withSpring(0.9);
                  }}
                  onPressOut={() => {
                    scale.value = withSpring(1);
                  }}
                >
                  <Feather name="plus" size={24} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            );
          },
        }}
      />

      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="trophy"
              size={24}
              color={
                focused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          ),
          tabBarButton: HapticTab,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={24}
              color={
                focused
                  ? Colors[colorScheme].tint
                  : Colors[colorScheme].tabIconDefault
              }
            />
          ),
          tabBarButton: HapticTab,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: -25,
    left: "50%",
    marginLeft: -32,
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
});
