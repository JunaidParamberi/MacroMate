import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';
import { Card } from './Card';
import { Icon, IconLibrary } from './Icon';
import { Typography } from './Typography';

export interface AITipCardProps {
  // Tip content
  title: string;
  tip: string;
  category?: string;
  
  // Icon customization
  icon?: string;
  iconLibrary?: IconLibrary;
  iconColor?: string;
  iconSize?: number;
  iconBackgroundColor?: string;
  
  // AI metadata
  aiConfidence?: number; // 0-1
  aiType?: 'nutrition' | 'exercise' | 'recovery' | 'motivation' | 'general';
  priority?: 'low' | 'medium' | 'high';
  
  // Action
  actionText?: string;
  onActionPress?: () => void;
  
  // Styling
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  
  // Interaction
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AITipCard: React.FC<AITipCardProps> = ({
  title,
  tip,
  category,
  icon,
  iconLibrary = 'ionicons',
  iconColor,
  iconSize = 24,
  iconBackgroundColor,
  aiConfidence = 0.8,
  aiType = 'general',
  priority = 'medium',
  actionText,
  onActionPress,
  backgroundColor,
  borderColor,
  borderRadius = 16,
  onPress,
  disabled = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;
  
  // Dynamic colors based on AI type and priority
  const getAIColors = () => {
    switch (aiType) {
      case 'nutrition':
        return { bg: isDark ? '#1B5E20' : '#E8F5E8', border: isDark ? '#4CAF50' : '#4CAF50', icon: isDark ? '#81C784' : '#4CAF50' };
      case 'exercise':
        return { bg: isDark ? '#0D47A1' : '#E3F2FD', border: isDark ? '#2196F3' : '#2196F3', icon: isDark ? '#64B5F6' : '#2196F3' };
      case 'recovery':
        return { bg: isDark ? '#4A148C' : '#F3E5F5', border: isDark ? '#9C27B0' : '#9C27B0', icon: isDark ? '#BA68C8' : '#9C27B0' };
      case 'motivation':
        return { bg: isDark ? '#E65100' : '#FFF3E0', border: isDark ? '#FF9800' : '#FF9800', icon: isDark ? '#FFB74D' : '#FF9800' };
      default:
        return { bg: isDark ? '#1A237E' : '#E8EAF6', border: isDark ? '#3F51B5' : '#3F51B5', icon: isDark ? '#7986CB' : '#3F51B5' };
    }
  };

  const getPriorityColors = () => {
    switch (priority) {
      case 'high':
        return { bg: isDark ? '#B71C1C' : '#FFEBEE', border: isDark ? '#F44336' : '#F44336', icon: isDark ? '#E57373' : '#F44336' };
      case 'low':
        return { bg: isDark ? '#33691E' : '#F1F8E9', border: isDark ? '#8BC34A' : '#8BC34A', icon: isDark ? '#AED581' : '#8BC34A' };
      default:
        return getAIColors();
    }
  };

  const aiColors = priority === 'medium' ? getAIColors() : getPriorityColors();
  
  // Dynamic colors
  const finalBackgroundColor = backgroundColor || themeColors.cardBackground;
  const finalBorderColor = borderColor || aiColors.border;
  const finalIconColor = iconColor || aiColors.icon;
  const finalIconBg = iconBackgroundColor || aiColors.bg;
  
  const Container = onPress && !disabled ? TouchableOpacity : View;
  const containerProps = onPress && !disabled ? { onPress, activeOpacity: 0.7 } : {};

  const cardStyles: ViewStyle[] = [
    styles.cardContainer,
  ];
  
  if (borderRadius) {
    cardStyles.push({ borderRadius });
  }
  
  if (disabled) {
    cardStyles.push(styles.disabled);
  }
  
  if (style) {
    cardStyles.push(style);
  }

  return (
    <Container {...containerProps}>
      <Card style={cardStyles}>
        {/* Header with icon and title */}
        <View style={styles.header}>
          {/* AI Icon */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: finalIconBg }
          ]}>
            {icon ? (
              <Icon
                name={icon}
                library={iconLibrary}
                size={iconSize}
                color={finalIconColor}
              />
            ) : (
              <Icon
                name="bulb"
                library="ionicons"
                size={iconSize}
                color={finalIconColor}
              />
            )}
          </View>
          
          {/* Title and category */}
          <View style={styles.titleContainer}>
            <Typography variant="bodyText" style={styles.title}>
              {title}
            </Typography>
            {category && (
              <Typography variant="metaLabel" style={{color: isDark ? Colors.neutral[400] : Colors.textSecondary}}>
                {category}
              </Typography>
            )}
          </View>
          
          {/* AI Badge */}
          <View style={styles.aiBadge}>
            <Typography variant="caption" style={styles.aiBadgeText}>
              AI
            </Typography>
          </View>
        </View>

        {/* Tip content */}
        <View style={styles.tipContainer}>
          <Typography variant="bodyText" style={{lineHeight: 20, color: isDark ? Colors.neutral[300] : Colors.text}}>
            {tip}
          </Typography>
        </View>

        {/* Confidence indicator */}
        <View style={styles.confidenceContainer}>
          <Typography variant="caption" style={{color: isDark ? Colors.neutral[400] : Colors.textSecondary, marginRight: Spacing.sm, minWidth: 80}}>
            AI Confidence
          </Typography>
          <View style={{flex: 1, height: 4, backgroundColor: isDark ? Colors.neutral[700] : Colors.borderGray, borderRadius: 2, overflow: 'hidden', marginRight: Spacing.sm}}>
            <View 
              style={[
                styles.confidenceFill,
                { 
                  width: `${aiConfidence * 100}%`,
                  backgroundColor: finalIconColor
                }
              ]} 
            />
          </View>
          <Typography variant="caption" style={{color: isDark ? Colors.neutral[400] : Colors.textSecondary, minWidth: 35, textAlign: 'right'}}>
            {Math.round(aiConfidence * 100)}%
          </Typography>
        </View>

        {/* Action button */}
        {actionText && onActionPress && (
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: finalIconColor }]}
            onPress={onActionPress}
          >
            <Typography variant="link" style={[styles.actionText, { color: finalIconColor }] as unknown as TextStyle}>
              {actionText}
            </Typography>
            <Icon
              name="arrow-forward"
              library="ionicons"
              size={16}
              color={finalIconColor}
            />
          </TouchableOpacity>
        )}
      </Card>
    </Container>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: Spacing.md,
    marginVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  category: {
    // color set dynamically inline
  },
  aiBadge: {
    backgroundColor: Colors.brand.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 10,
  },
  tipContainer: {
    marginBottom: Spacing.sm,
  },
  tipText: {
    lineHeight: 20,
    // color set dynamically inline
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confidenceLabel: {
    // color set dynamically inline
    marginRight: Spacing.sm,
    minWidth: 80,
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    // backgroundColor set dynamically inline
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceValue: {
    // color set dynamically inline
    minWidth: 35,
    textAlign: 'right',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: Spacing.xs,
  },
  actionText: {
    marginRight: Spacing.xs,
    fontWeight: '500',
  },
});
