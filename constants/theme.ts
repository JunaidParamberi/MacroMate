/**
 * Fitness App Design System Theme
 * Based on the Master Design System for Fitness App Guide
 */

import { Platform } from 'react-native';

// Modern Color Palette
export const brand = {
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  secondary: '#6366F1',
  accent: '#F59E0B',
};

export const neutral = {
  white: '#FFFFFF',
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
};

export const activityColors = {
  running: '#F97316',
  cycling: '#3B82F6',
  walking: '#10B981',
  gym: '#8B5CF6',
  swimming: '#06B6D4',
  yoga: '#EC4899',
  calories: '#F97316',
  steps: '#3B82F6',
  active: '#8B5CF6',
  default: '#64748B',
};

// Legacy Colors
export const pureWhite = neutral.white;
export const borderGray = neutral[200];
export const charcoal = neutral[800];
export const emeraldGreen = brand.primary;
export const primary = brand.primary;
export const secondary = brand.secondary;
export const background = neutral.white;
export const text = neutral[800];
export const textSecondary = neutral[500];
export const border = neutral[200];

// Light Theme Colors
const LightThemeColors = {
  text: neutral[800],
  background: neutral[50],
  tint: brand.primary,
  icon: neutral[500],
  tabIconDefault: neutral[500],
  tabIconSelected: brand.primary,
  border: neutral[200],
  cardBackground: neutral.white,
  tabBarBackground: neutral.white,
  tabBarBorder: neutral[200],
  floatingButton: brand.primary,
  floatingButtonIcon: neutral.white,
};

// Dark Theme Colors
const DarkThemeColors = {
  text: neutral[50],
  background: neutral[900],
  tint: brand.primaryLight,
  icon: neutral[400],
  tabIconDefault: neutral[400],
  tabIconSelected: brand.primaryLight,
  border: neutral[700],
  cardBackground: neutral[800],
  tabBarBackground: neutral[800],
  tabBarBorder: neutral[700],
  floatingButton: brand.primary,
  floatingButtonIcon: neutral.white,
};

// Export Colors with proper light/dark themes
export const Colors = {
  pureWhite: neutral.white,
  borderGray: neutral[200],
  charcoal: neutral[800],
  emeraldGreen: brand.primary,
  primary: brand.primary,
  secondary: brand.secondary,
  background: neutral.white,
  text: neutral[800],
  textSecondary: neutral[500],
  border: neutral[200],
  light: LightThemeColors,
  dark: DarkThemeColors,
  brand,
  neutral,
  activityColors,
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
