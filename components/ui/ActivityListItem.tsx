import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
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
  const colorScheme = useColorScheme() ?? 'light';
  const dynamicColors = Colors[colorScheme];
  
  // Use dynamic color if no custom color is provided
  const finalIconColor = iconColor || Colors.textSecondary;
  
  // Use dynamic background if no custom background is provided
  const finalBackgroundColor = backgroundColor || dynamicColors?.cardBackground || 'transparent';
  
  const Container = onPress && !disabled ? TouchableOpacity : View;
  const containerProps = onPress && !disabled ? { onPress, activeOpacity: 0.7 } : {};

  return (
    <Container
      style={[
        styles.container, 
        disabled && styles.disabled, 
        { backgroundColor: finalBackgroundColor },
        { borderColor: dynamicColors?.border || Colors.border },
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
        <Typography variant="bodyText" style={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="metaLabel" style={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </View>

      {/* Arrow */}
      {showArrow && (
        <View style={styles.arrowContainer}>
          <Icon
            name="chevron-right"
            library="feather"
            size={20}
            color={Colors.textSecondary}
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
