import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TextStyle } from 'react-native';
import { Colors, Typography as TypographyStyles } from '../../constants/theme';

export type TypographyVariant = 
  | 'headlineDisplay'
  | 'bodyText'
  | 'metaLabel'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'caption'
  | 'link';

export interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  numberOfLines?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyText',
  children,
  style,
  color,
  numberOfLines,
  textAlign = 'auto',
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  
  const getTextStyle = (): TextStyle => {
    const baseStyle = TypographyStyles[variant];
    const dynamicColors = Colors[colorScheme];
    
    // Use dynamic colors based on the variant
    let dynamicColor = color;
    if (!color) {
      switch (variant) {
        case 'metaLabel':
        case 'caption':
        case 'link':
          dynamicColor = Colors.textSecondary;
          break;
        default:
          dynamicColor = dynamicColors?.text || Colors.text;
          break;
      }
    }
    
    return {
      ...baseStyle,
      color: dynamicColor,
      textAlign,
      fontWeight: baseStyle.fontWeight as TextStyle['fontWeight'],
    };
  };

  return (
    <Text style={[getTextStyle(), style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

// Convenience components for common variants
export const HeadlineDisplay: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineDisplay" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyText" {...props} />
);

export const MetaLabel: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="metaLabel" {...props} />
);

export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Link: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="link" {...props} />
);
