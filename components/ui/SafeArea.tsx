import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';

export interface SafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = Colors.background,
}) => {
  return (
    <RNSafeAreaView 
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </RNSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
