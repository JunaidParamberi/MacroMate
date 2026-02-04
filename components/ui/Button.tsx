import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Components, Spacing } from '../../constants/theme';
import { Icon, IconProps } from './Icon';
import { InlineLoader } from './Loader';

export type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'iconOnly';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  loaderType?: 'spinner' | 'pulse' | 'dots';
  loaderSize?: number;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  iconProps?: IconProps;
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  loading = false,
  loaderType = 'spinner',
  loaderSize = 16,
  icon,
  iconPosition = 'left',
  iconProps,
  size = 'medium',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = Components.button[variant === 'icon' || variant === 'iconOnly' ? 'primary' : variant];
    const sizeStyle = getSizeStyles();
    
    return {
      ...baseStyle,
      opacity: disabled || loading ? 0.7 : 1,
      ...sizeStyle,
      ...(variant === 'iconOnly' && {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        minWidth: 'auto',
      }),
      ...(disabled && { backgroundColor: Colors.borderGray }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = variant === 'primary' 
      ? { color: Colors.pureWhite, fontWeight: '600' as const }
      : { color: Colors.charcoal, fontWeight: '600' as const };
    
    const sizeStyle = getTextSizeStyles();
    
    return {
      fontSize: 16,
      fontFamily: 'system-ui',
      textAlign: 'center',
      ...baseStyle,
      ...sizeStyle,
    };
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: Spacing.buttonPadding,
          paddingHorizontal: Spacing.lg,
          minHeight: 48,
        };
    }
  };

  const getTextSizeStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <InlineLoader
          visible={true}
          size={loaderSize}
          color={variant === 'primary' ? Colors.pureWhite : Colors.charcoal}
          type={loaderType}
        />
      );
    }

    if (variant === 'iconOnly' && icon) {
      return icon;
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>
            {icon}
          </View>
        )}
        
        {title && (
          <Text style={[getTextStyle(), textStyle]}>
            {title}
          </Text>
        )}
        
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>
            {icon}
          </View>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Convenience components for specific button types
export const IconButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="icon" {...props} />
);

export const IconOnlyButton: React.FC<Omit<ButtonProps, 'variant' | 'title'>> = (props) => (
  <Button variant="iconOnly" {...props} />
);

// Pre-styled icon buttons
export const BackButton: React.FC<{ onPress: () => void; color?: string }> = ({ 
  onPress, 
  color = Colors.charcoal 
}) => (
  <IconOnlyButton
    onPress={onPress}
    icon={<Icon name="chevron-back" library="ionicons" size={24} color={color} />}
  />
);

export const CloseButton: React.FC<{ onPress: () => void; color?: string }> = ({ 
  onPress, 
  color = Colors.charcoal 
}) => (
  <IconOnlyButton
    onPress={onPress}
    icon={<Icon name="close" library="ionicons" size={24} color={color} />}
  />
);

export const AddButton: React.FC<{ onPress: () => void; color?: string }> = ({ 
  onPress, 
  color = Colors.emeraldGreen 
}) => (
  <IconOnlyButton
    onPress={onPress}
    icon={<Icon name="add" library="ionicons" size={24} color={color} />}
  />
);

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});
