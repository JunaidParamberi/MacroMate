import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../../constants/theme';
import { Icon, IconLibrary } from './Icon';
import { Typography } from './Typography';

export interface ActivityListItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconLibrary?: IconLibrary;
  iconColor?: string;
  iconSize?: number;
  iconBackgroundColor?: string;
  backgroundColor?: string;
  iconComponent?: React.ReactNode;
  showArrow?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const ActivityListItem: React.FC<ActivityListItemProps> = ({
  title,
  subtitle,
  icon,
  iconLibrary = 'ionicons',
  iconColor,
  iconSize = 24,
  iconBackgroundColor,
  backgroundColor,
  iconComponent,
  showArrow = true,
  onPress,
  style,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  
  // Use dynamic color if no custom color is provided
  const finalIconColor = iconColor || (isDark ? Colors.neutral[400] : Colors.neutral[500]);
  
  // Use dynamic background if no custom background is provided
  const finalBackgroundColor = backgroundColor || themeColors.cardBackground;
  
  const Container = onPress && !disabled ? TouchableOpacity : View;
  const containerProps = onPress && !disabled ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Container
      style={[
        styles.container, 
        disabled && styles.disabled, 
        { backgroundColor: finalBackgroundColor },
        { borderColor: themeColors.border },
        style
      ]}
      {...containerProps}
    >
      {/* Icon */}
      {(icon || iconComponent) && (
        <View style={[
          styles.iconContainer,
          iconBackgroundColor && { 
            backgroundColor: iconBackgroundColor,
            borderRadius: iconSize / 2
          }
        ]}>
          {iconComponent ? (
            iconComponent
          ) : (
            <Icon
              name={icon!}
              library={iconLibrary}
              size={iconSize}
              color={finalIconColor}
            />
          )}
        </View>
      )}

      {/* Text Content */}
      <View style={styles.content}>
        <Typography variant="bodyText" style={{...styles.title, color: isDark ? Colors.neutral[50] : Colors.neutral[800]} as any}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="metaLabel" style={{...styles.subtitle, color: isDark ? Colors.neutral[400] : Colors.neutral[500]} as any}>
            {subtitle}
          </Typography>
        )}
      </View>

      {/* Arrow */}
      {showArrow && (
        <View style={{...styles.arrowContainer, backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100]}}>
          <Icon
            name="chevron-right"
            library="feather"
            size={20}
            color={isDark ? Colors.neutral[400] : Colors.neutral[500]}
          />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 14,
    ...Shadows.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
