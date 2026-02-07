import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';

export type LogoTheme = 'auto' | 'light' | 'dark' | 'emerald' | 'monochrome';

export interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
  showText?: boolean;
  /** Logo theme - auto follows system theme */
  theme?: LogoTheme;
  /** Use variant icon for tinted mode */
  tinted?: boolean;
}

const logoSources: Record<string, ImageSourcePropType> = {
  primaryEmerald: require('../../assets/images/Logos/Primary_Emerald.png'),
  monochromeDark: require('../../assets/images/Logos/Monochrome_Dark.png'),
  appIconVariant: require('../../assets/images/Logos/App_Icon_Variant.png'),
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'medium',
  style,
  showText = true,
  theme = 'auto',
  tinted = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getLogoSource = (): ImageSourcePropType => {
    if (tinted) {
      return logoSources.appIconVariant;
    }
    
    switch (theme) {
      case 'emerald':
        return logoSources.primaryEmerald;
      case 'monochrome':
      case 'dark':
        return logoSources.monochromeDark;
      case 'light':
        return logoSources.primaryEmerald;
      case 'auto':
      default:
        return isDark ? logoSources.monochromeDark : logoSources.primaryEmerald;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 28;
      case 'large':
        return 56;
      case 'xlarge':
        return 80;
      case 'medium':
      default:
        return 40;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 36;
      case 'xlarge':
        return 48;
      case 'medium':
      default:
        return 24;
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case 'emerald':
        return Colors.brand.primary;
      case 'monochrome':
      case 'dark':
        return Colors.neutral.white;
      case 'light':
        return Colors.neutral[900];
      case 'auto':
      default:
        return isDark ? Colors.neutral.white : Colors.neutral[900];
    }
  };

  const iconSize = getIconSize();
  const textSize = getTextSize();
  const textColor = getTextColor();

  if (variant === 'icon') {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={getLogoSource()}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (variant === 'text') {
    return (
      <View style={[styles.container, style]}>
        <Text style={[styles.logoText, { fontSize: textSize, color: textColor }]}>
          MacroMate
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.fullContainer, style]}>
      <Image
        source={getLogoSource()}
        style={{ width: iconSize, height: iconSize }}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[styles.logoText, { fontSize: textSize, color: textColor }]}>
          MacroMate
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    fontFamily: 'Inter_300Light',
    fontWeight: '300',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
});
