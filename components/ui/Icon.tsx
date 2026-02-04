import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialIcons,
    SimpleLineIcons
} from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

export type IconLibrary = 
  | 'ionicons'
  | 'material'
  | 'fontAwesome'
  | 'fontAwesome5'
  | 'antDesign'
  | 'feather'
  | 'simpleLine'
  | 'entypo';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  library?: IconLibrary;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.charcoal,
  library = 'ionicons',
  style,
}) => {
  const renderIcon = () => {
    const iconProps = {
      name: name as any,
      size,
      color,
      style: [styles.icon, style],
    };

    switch (library) {
      case 'ionicons':
        return <Ionicons {...iconProps} />;
      case 'material':
        return <MaterialIcons {...iconProps} />;
      case 'fontAwesome':
        return <FontAwesome {...iconProps} />;
      case 'fontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'antDesign':
        return <AntDesign {...iconProps} />;
      case 'feather':
        return <Feather {...iconProps} />;
      case 'simpleLine':
        return <SimpleLineIcons {...iconProps} />;
      case 'entypo':
        return <Entypo {...iconProps} />;
      default:
        return <Ionicons {...iconProps} />;
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
};

// Fitness-specific icon components
export const FitnessIcons = {
  // Activity icons
  Running: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="run" library="ionicons" {...props} />
  ),
  Cycling: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="bicycle" library="ionicons" {...props} />
  ),
  Swimming: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="water" library="ionicons" {...props} />
  ),
  Gym: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="fitness" library="material" {...props} />
  ),
  Yoga: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="self-improvement" library="material" {...props} />
  ),
  
  // UI icons
  Home: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="home" library="ionicons" {...props} />
  ),
  Profile: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="person" library="ionicons" {...props} />
  ),
  Settings: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="settings" library="ionicons" {...props} />
  ),
  Chart: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="bar-chart" library="ionicons" {...props} />
  ),
  Trophy: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="trophy" library="ionicons" {...props} />
  ),
  Heart: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="heart" library="ionicons" {...props} />
  ),
  Fire: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="flame" library="ionicons" {...props} />
  ),
  Time: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="time" library="ionicons" {...props} />
  ),
  Calendar: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="calendar" library="ionicons" {...props} />
  ),
  Plus: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="add" library="ionicons" {...props} />
  ),
  Minus: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="remove" library="ionicons" {...props} />
  ),
  Check: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="checkmark" library="ionicons" {...props} />
  ),
  Close: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="close" library="ionicons" {...props} />
  ),
  ArrowRight: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="chevron-forward" library="ionicons" {...props} />
  ),
  ArrowLeft: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="chevron-back" library="ionicons" {...props} />
  ),
  ArrowUp: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="chevron-up" library="ionicons" {...props} />
  ),
  ArrowDown: (props: Omit<IconProps, 'name' | 'library'>) => (
    <Icon name="chevron-down" library="ionicons" {...props} />
  ),
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // Icon styles if needed
  },
});
