import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';

export type TrainerQuickAction = {
  id: string;
  label: string;
  prompt: string;
  icon?: React.ReactNode;
};

interface QuickActionsProps {
  actions: TrainerQuickAction[];
  isDark: boolean;
  onSelect: (prompt: string) => void;
}

export const QuickActions = ({ actions, isDark, onSelect }: QuickActionsProps) => {
  if (!actions.length) {
    return null;
  }

  return (
    <View>
      <Typography
        variant="metaLabel"
        style={[styles.title, { color: isDark ? Colors.neutral[500] : Colors.neutral[400] }]}
      >
        QUICK START
      </Typography>
      <View style={styles.row}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={[styles.chip, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}
            onPress={() => onSelect(action.prompt)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            accessibilityHint={`Get ${action.label.toLowerCase()} from Coach Alex`}
          >
            <Typography
              variant="caption"
              style={[styles.chipText, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}
            >
              {action.label}
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
