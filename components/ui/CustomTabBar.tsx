import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/theme';
import { FitnessIcons, Icon } from './Icon';

export interface TabItem {
  name: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface CustomTabBarProps {
  tabs: TabItem[];
  onTabPress?: (tabName: string) => void;
  onFloatingButtonPress?: () => void;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  tabs,
  onTabPress,
  onFloatingButtonPress,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const handleTabPress = (tabName: string) => {
    if (onTabPress) {
      onTabPress(tabName);
    } else {
      if (tabName === 'index') {
        router.push('/(tabs)');
      } else {
        router.push(`/(tabs)/${tabName}` as any);
      }
    }
  };

  const handleFloatingButtonPress = () => {
    if (onFloatingButtonPress) {
      onFloatingButtonPress();
    } else {
      // Default action - navigate to create workout or similar
      router.push('/modal' as any);
    }
  };

  const isActiveTab = (tabName: string) => {
    return pathname === `/(tabs)/${tabName}` || 
           (tabName === 'index' && pathname === '/');
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { 
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.tabBarBorder,
        }
      ]}
      edges={['bottom']}
    >
      <View style={styles.content}>
        {/* Left side tabs */}
        <View style={styles.leftTabs}>
          {tabs.slice(0, 2).map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {isActiveTab(tab.name) ? (
                  tab.activeIcon || tab.icon
                ) : (
                  <View style={styles.inactiveIcon}>
                    {tab.icon}
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActiveTab(tab.name)
                      ? theme.tabIconSelected
                      : theme.tabIconDefault,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {
              backgroundColor: theme.floatingButton,
            },
          ]}
          onPress={handleFloatingButtonPress}
          activeOpacity={0.8}
        >
          <Icon
            name="add"
            library="ionicons"
            size={28}
            color={theme.floatingButtonIcon}
          />
        </TouchableOpacity>

        {/* Right side tabs */}
        <View style={styles.rightTabs}>
          {tabs.slice(2).map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {isActiveTab(tab.name) ? (
                  tab.activeIcon || tab.icon
                ) : (
                  <View style={styles.inactiveIcon}>
                    {tab.icon}
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActiveTab(tab.name)
                      ? Colors.light.tabIconSelected
                      : Colors.light.tabIconDefault,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Pre-configured tabs for the fitness app
export const useFitnessTabs = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  
  const fitnessTabs: TabItem[] = [
    {
      name: 'index',
      label: 'Home',
      icon: <FitnessIcons.Home size={24} color={theme.tabIconDefault} />,
      activeIcon: <FitnessIcons.Home size={24} color={theme.tabIconSelected} />,
    },
    {
      name: 'activity',
      label: 'Activity',
      icon: <FitnessIcons.Chart size={24} color={theme.tabIconDefault} />,
      activeIcon: <FitnessIcons.Chart size={24} color={theme.tabIconSelected} />,
    },
    {
      name: 'goals',
      label: 'Goals',
      icon: <FitnessIcons.Trophy size={24} color={theme.tabIconDefault} />,
      activeIcon: <FitnessIcons.Trophy size={24} color={theme.tabIconSelected} />,
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: <FitnessIcons.Profile size={24} color={theme.tabIconDefault} />,
      activeIcon: <FitnessIcons.Profile size={24} color={theme.tabIconSelected} />,
    },
  ];
  
  return fitnessTabs;
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 80,
  },
  leftTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rightTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    minWidth: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  inactiveIcon: {
    opacity: 0.6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: Spacing.md,
  },
});
