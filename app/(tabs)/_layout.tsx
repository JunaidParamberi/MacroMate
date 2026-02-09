import { Colors } from "@/constants/theme";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import LogModal from "@/components/log/LogModal";

// Center Log Button Component
function CenterLogButton({ logModalVisible, setLogModalVisible }: { logModalVisible: boolean; setLogModalVisible: (v: boolean) => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.centerButtonContainer}
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withTiming(0.9, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 200 });
      }}
      onPress={() => setLogModalVisible(!logModalVisible)}
    >
      <Animated.View style={[styles.floatingButton, animatedStyle]}>
        <View style={styles.gradientButton}>
          <Ionicons name="add" size={32} color={Colors.neutral.white} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

function TabIcon({ focused, icon }: { focused: boolean; icon: React.ReactNode }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.iconWrapper, animatedStyle]}>
      {icon}
    </Animated.View>
  );
}

// AI Trainer Icon Component (Combo Icon)
function AITrainerIcon({ color }: { color: string }) {
  return (
    <View style={styles.aiIconContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={22} color={color} />
      <MaterialCommunityIcons 
        name="robot" 
        size={11} 
        color={color}
        style={styles.robotBadge} 
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShow = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
          tabBarStyle: {
            backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral.white,
            borderTopWidth: 0,
            elevation: 0,
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
            position: 'absolute',
            bottom: 0,
            left: 20,
            right: 20,
            borderRadius: 30,
            marginHorizontal: 0,
            shadowColor: Colors.brand.primary,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 20,
            display: isKeyboardVisible ? 'none' : 'flex', // Hide when keyboard is open
          },
          tabBarItemStyle: {
            height: 50,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                icon={<Entypo name="home" size={22} color={color} />}
              />
            ),
            tabBarActiveTintColor: Colors.brand.primary,
            tabBarInactiveTintColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
            tabBarButton: (props) => {
              const { ref, ...safeProps } = props;
              return (
                <Pressable
                  {...safeProps}
                  onPress={(e) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    props.onPress?.(e);
                  }}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="trainer"
          options={{
            title: "Trainer",
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                icon={<AITrainerIcon color={color} />}
              />
            ),
            tabBarActiveTintColor: Colors.brand.accent,
            tabBarInactiveTintColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
            tabBarButton: (props) => {
              const { ref, ...safeProps } = props;
              return (
                <Pressable
                  {...safeProps}
                  onPress={(e) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    props.onPress?.(e);
                  }}
                />
              );
            },
          }}
        />

        {/* CENTER FLOATING TAB BUTTON */}
        <Tabs.Screen
          name="log"
          options={{
            title: "",
            tabBarButton: () => (
              <CenterLogButton 
                logModalVisible={logModalVisible} 
                setLogModalVisible={setLogModalVisible} 
              />
            ),
          }}
        />

        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                icon={<Ionicons name="trophy" size={22} color={color} />}
              />
            ),
            tabBarActiveTintColor: Colors.activityColors.running,
            tabBarInactiveTintColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
            tabBarButton: (props) => {
              const { ref, ...safeProps } = props;
              return (
                <Pressable
                  {...safeProps}
                  onPress={(e) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    props.onPress?.(e);
                  }}
                />
              );
            },
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                focused={focused}
                icon={<Ionicons name="person" size={22} color={color} />}
              />
            ),
            tabBarActiveTintColor: Colors.brand.accent,
            tabBarInactiveTintColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
            tabBarButton: (props) => {
              const { ref, ...safeProps } = props;
              return (
                <Pressable
                  {...safeProps}
                  onPress={(e) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    props.onPress?.(e);
                  }}
                />
              );
            },
          }}
        />
      </Tabs>

      <LogModal visible={logModalVisible} onClose={() => setLogModalVisible(false)} isDark={isDark} />
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    zIndex: 100,
  },
  floatingButtonWrapper: {
    position: 'absolute',
    zIndex: 100,
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 20,
  },
  floatingButton: {
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 28,
  },
  gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brand.primary,
    borderWidth: 3,
    borderColor: Colors.neutral.white,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  aiIconContainer: {
    position: 'relative',
    width: 22,
    height: 22,
  },
  robotBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
  },
});