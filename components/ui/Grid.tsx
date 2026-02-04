import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Grid as GridConfig, Spacing } from '../../constants/theme';

export interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gutter?: number;
  style?: ViewStyle;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = GridConfig.columns,
  gutter = GridConfig.gutter,
  style,
}) => {
  const gridStyle = [
    styles.grid,
    {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      marginHorizontal: -gutter / 2,
    },
    style,
  ];

  return <View style={gridStyle}>{children}</View>;
};

export interface GridItemProps {
  children: React.ReactNode;
  span?: number;
  offset?: number;
  columns?: number;
  gutter?: number;
  style?: ViewStyle;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  span = 1,
  offset = 0,
  columns = GridConfig.columns,
  gutter = GridConfig.gutter,
  style,
}) => {
  const itemStyle = [
    styles.gridItem,
    {
      width: `${(span / columns) * 100}%`,
      marginLeft: offset ? `${(offset / columns) * 100}%` : 0,
      paddingHorizontal: gutter / 2,
      marginBottom: gutter,
    },
    style,
  ];

  return <View style={itemStyle}>{children}</View>;
};

// Convenience components for common layouts
export const Row: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={[styles.row, style]}>
    {children}
  </View>
);

export const Column: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={[styles.column, style]}>
    {children}
  </View>
);

export interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing | number;
  margin?: keyof typeof Spacing | number;
  paddingHorizontal?: keyof typeof Spacing | number;
  paddingVertical?: keyof typeof Spacing | number;
  marginHorizontal?: keyof typeof Spacing | number;
  marginVertical?: keyof typeof Spacing | number;
  paddingTop?: keyof typeof Spacing | number;
  paddingBottom?: keyof typeof Spacing | number;
  marginTop?: keyof typeof Spacing | number;
  marginBottom?: keyof typeof Spacing | number;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  padding,
  margin,
  paddingHorizontal,
  paddingVertical,
  marginHorizontal,
  marginVertical,
  paddingTop,
  paddingBottom,
  marginTop,
  marginBottom,
}) => {
  const getSpacingValue = (value: keyof typeof Spacing | number): number => {
    if (typeof value === 'number') return value;
    return Spacing[value] || 0;
  };

  const containerStyle: ViewStyle = {
    ...(padding !== undefined && {
      padding: getSpacingValue(padding),
    }),
    ...(margin !== undefined && {
      margin: getSpacingValue(margin),
    }),
    ...(paddingHorizontal !== undefined && {
      paddingHorizontal: getSpacingValue(paddingHorizontal),
    }),
    ...(paddingVertical !== undefined && {
      paddingVertical: getSpacingValue(paddingVertical),
    }),
    ...(marginHorizontal !== undefined && {
      marginHorizontal: getSpacingValue(marginHorizontal),
    }),
    ...(marginVertical !== undefined && {
      marginVertical: getSpacingValue(marginVertical),
    }),
    ...(paddingTop !== undefined && {
      paddingTop: getSpacingValue(paddingTop),
    }),
    ...(paddingBottom !== undefined && {
      paddingBottom: getSpacingValue(paddingBottom),
    }),
    ...(marginTop !== undefined && {
      marginTop: getSpacingValue(marginTop),
    }),
    ...(marginBottom !== undefined && {
      marginBottom: getSpacingValue(marginBottom),
    }),
  };

  return <View style={[containerStyle, style]}>{children}</View>;
};

// Spacing components
export interface SpacerProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  horizontal = false,
}) => {
  const getSpacingValue = (): number => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'xs': return Spacing.xs;
      case 'sm': return Spacing.sm;
      case 'md': return Spacing.md;
      case 'lg': return Spacing.lg;
      case 'xl': return Spacing.xl;
      case 'xxl': return Spacing.xxl;
      default: return Spacing.md;
    }
  };

  const spacing = getSpacingValue();
  const style = horizontal 
    ? { width: spacing } 
    : { height: spacing };

  return <View style={style} />;
};

// Layout helpers
export const Center: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => (
  <View style={[styles.center, style]}>
    {children}
  </View>
);

export const Flex: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  style?: ViewStyle;
}> = ({
  children,
  direction = 'row',
  justify = 'flex-start',
  align = 'flex-start',
  wrap = 'nowrap',
  style,
}) => (
  <View
    style={[
      styles.flex,
      {
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
      },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    // Base grid styles
  },
  gridItem: {
    // Base grid item styles
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  column: {
    flexDirection: 'column' as const,
  },
  center: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  flex: {
    display: 'flex',
  },
});
