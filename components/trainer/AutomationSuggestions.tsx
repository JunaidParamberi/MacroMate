import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { TrainerAutomationSuggestion } from '@/store/trainerChat';

interface AutomationSuggestionsProps {
  automations: TrainerAutomationSuggestion[];
  isDark: boolean;
  onSelect: (automation: TrainerAutomationSuggestion) => void;
}

export const AutomationSuggestions = ({ automations, isDark, onSelect }: AutomationSuggestionsProps) => {
  if (!automations.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Typography variant="metaLabel" style={[styles.title, { color: isDark ? Colors.neutral[500] : Colors.neutral[400] }]}
      >
        SMART SUGGESTIONS
      </Typography>
      {automations.map((automation) => (
        <Pressable
          key={automation.id}
          style={[styles.card, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}
          onPress={() => onSelect(automation)}
          accessibilityRole="button"
          accessibilityLabel={automation.label}
          accessibilityHint={automation.description}
        >
          <View>
            <Typography variant="bodyText" style={styles.label}>
              {automation.label}
            </Typography>
            {automation.description ? (
              <Typography variant="caption" style={styles.description}>
                {automation.description}
              </Typography>
            ) : null}
          </View>
          <Ionicons name="arrow-forward" size={20} color={isDark ? Colors.neutral[200] : Colors.neutral[600]} />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.neutral[200],
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  description: {
    marginTop: 4,
    color: Colors.neutral[500],
  },
});
