/**
 * Fitness App Design System Theme
 * Based on the Master Design System for Fitness App Guide
 */

import { Platform } from 'react-native';

// Color Palette from Design System
export const Colors = {
  // Primary Colors
  pureWhite: '#FFFFFF',
  borderGray: '#E6E7EB',
  charcoal: '#0D1B12',
  emeraldGreen: '#0dbf49ff',
  
  // Semantic Colors
  primary: '#0dbf49ff',
  secondary: '#E6E7EB',
  background: '#FFFFFF',
  text: '#0D1B12',
  textSecondary: '#687076',
  border: '#E6E7EB',
  
  // Light/Dark mode compatibility
  light: {
    text: '#0D1B12',
    background: '#F8F9FA',
    tint: '#0dbf49ff',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0dbf49ff',
    border: '#E6E7EB',
    cardBackground: '#FFFFFF',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E6E7EB',
    floatingButton: '#0dbf49ff',
    floatingButtonIcon: '#0D1B12',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0D1B12',
    tint: '#0dbf49ff',
    icon: '#E6E7EB',
    tabIconDefault: '#E6E7EB',
    tabIconSelected: '#0dbf49ff',
    border: '#1A2E1F',
    cardBackground: '#1A2E1F',
    tabBarBackground: '#0D1B12',
    tabBarBorder: '#1A2E1F',
    floatingButton: '#0dbf49ff',
    floatingButtonIcon: '#FFFFFF',
  },
};

// Typography
export const Typography = {
  // Font Families
  fonts: Platform.select({
    ios: {
      sans: 'Inter-Regular',
      serif: 'Inter-Regular',
      rounded: 'Inter-Regular',
      mono: 'Inter-Regular',
    },
    default: {
      sans: 'Inter-Regular',
      serif: 'Inter-Regular',
      rounded: 'Inter-Regular',
      mono: 'Inter-Regular',
    },
    web: {
      sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "'Inter', Georgia, 'Times New Roman', serif",
      rounded: "'Inter', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "'Inter', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
  
  // Text Styles
  headlineDisplay: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      default: 'Inter-Bold',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.charcoal,
    lineHeight: 40,
  },
  
  bodyText: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.charcoal,
    lineHeight: 24,
  },
  
  metaLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  
  // Additional text sizes
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      default: 'Inter-Bold',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.charcoal,
    lineHeight: 36,
  },
  
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Inter-Bold',
      default: 'Inter-Bold',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.charcoal,
    lineHeight: 32,
  },
  
  h3: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      default: 'Inter-SemiBold',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.charcoal,
    lineHeight: 28,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: Platform.select({
      ios: 'Inter-Regular',
      default: 'Inter-Regular',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.textSecondary,
    lineHeight: 16,
  },

  link: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter-Medium',
      default: 'Inter-Medium',
      web: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    }),
    color: Colors.textSecondary,
    lineHeight: 20,
  },
};

// Spacing System
export const Spacing = {
  atomic: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Specific spacing from design
  standardPadding: 16,
  largeGutters: 24,
  cardPadding: 16,
  buttonPadding: 16,
  listItemPadding: 16,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
  
  // Component specific
  card: 12,
  button: 8,
  input: 8,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Component Styles
export const Components = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: Colors.emeraldGreen,
      paddingVertical: Spacing.buttonPadding,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.button,
      ...Typography.bodyText,
      fontWeight: '600',
      color: Colors.pureWhite,
      textAlign: 'center',
      ...Shadows.sm,
    },
    
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.borderGray,
      paddingVertical: Spacing.buttonPadding,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.button,
      ...Typography.bodyText,
      fontWeight: '600',
      color: Colors.charcoal,
      textAlign: 'center',
    },
  },
  
  // Card Styles
  card: {
    master: {
      backgroundColor: Colors.pureWhite,
      padding: Spacing.cardPadding,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: Colors.borderGray,
      ...Shadows.sm,
    },
    
    metric: {
      backgroundColor: Colors.pureWhite,
      padding: Spacing.cardPadding,
      borderRadius: BorderRadius.card,
      borderWidth: 1,
      borderColor: Colors.borderGray,
      ...Shadows.sm,
    },
  },
  
  // List Item Styles
  listItem: {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: 'transparent',
    },
    
    icon: {
      width: 24,
      height: 24,
      marginRight: Spacing.md,
    },
    
    content: {
      flex: 1,
    },
    
    title: {
      ...Typography.bodyText,
      fontWeight: '500',
    },
    
    subtitle: {
      ...Typography.metaLabel,
      marginTop: 2,
    },
  },
};

// Grid System
export const Grid = {
  columns: 4,
  gutter: Spacing.md,
  container: {
    paddingHorizontal: Spacing.md,
  },
};

// Export legacy Fonts for compatibility
export const Fonts = Typography.fonts;
