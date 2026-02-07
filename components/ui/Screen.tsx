import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { SafeArea } from './SafeArea';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
  safeAreaEdges?: ('top' | 'bottom' | 'left' | 'right')[];
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  backgroundColor,
  safeAreaEdges = ['top', 'bottom', 'left', 'right'],
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  const dynamicBackgroundColor = backgroundColor || themeColors.background;
  const contentStyle = [
    styles.content,
    { paddingBottom: 70 }, // Less padding to account for tab bar
    contentContainerStyle,
  ];

  if (scrollable) {
    return (
      <SafeArea 
        style={[styles.container, { backgroundColor: dynamicBackgroundColor }, style] as any}
        edges={safeAreaEdges}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      </SafeArea>
    );
  }

  return (
    <SafeArea 
      style={[styles.container, { backgroundColor: dynamicBackgroundColor }, style] as any}
      edges={safeAreaEdges}
    >
      <View style={contentStyle}>
        {children}
      </View>
    </SafeArea>
  );
};

// Convenience components for common screen patterns
export interface HeaderProps {
  title?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  showBorder?: boolean;
}

export const ScreenHeader: React.FC<HeaderProps> = ({
  title,
  leftComponent,
  rightComponent,
  style,
  backgroundColor,
  showBorder = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  const headerBg = backgroundColor || themeColors.background;
  const borderColor = showBorder ? themeColors.border : 'transparent';

  return (
    <View style={[
      styles.header,
      { backgroundColor: headerBg, borderBottomColor: borderColor },
      style
    ]}>
      {leftComponent && <View style={styles.headerLeft}>{leftComponent}</View>}
      {title && <View style={styles.headerCenter}><Typography variant="h3">{title}</Typography></View>}
      {rightComponent && <View style={styles.headerRight}>{rightComponent}</View>}
    </View>
  );
};

export interface ContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const ScreenContent: React.FC<ContentProps> = ({
  children,
  style,
  padding = 'md',
}) => {
  const getPaddingValue = (): number => {
    if (typeof padding === 'number') return padding;
    
    switch (padding) {
      case 'xs': return Spacing.xs;
      case 'sm': return Spacing.sm;
      case 'md': return Spacing.md;
      case 'lg': return Spacing.lg;
      case 'xl': return Spacing.xl;
      default: return Spacing.md;
    }
  };

  return (
    <View style={[
      styles.screenContent,
      { paddingHorizontal: getPaddingValue() },
      style
    ]}>
      {children}
    </View>
  );
};

export interface FooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  showBorder?: boolean;
}

export const ScreenFooter: React.FC<FooterProps> = ({
  children,
  style,
  backgroundColor,
  showBorder = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  const footerBg = backgroundColor || themeColors.background;
  const borderColor = showBorder ? themeColors.border : 'transparent';

  return (
    <View style={[
      styles.footer,
      { backgroundColor: footerBg, borderTopColor: borderColor },
      style
    ]}>
      {children}
    </View>
  );
};

// Import Typography for ScreenHeader
import { Typography } from './Typography';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  screenContent: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
});
