import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';

interface CoachMemoryCardProps {
  summaryLines: string[];
  focusAreas: string[];
  isDark: boolean;
  onShareLocationPress?: () => void;
  sharedLocationLabel?: string;
}

export const CoachMemoryCard = ({
  summaryLines,
  focusAreas,
  isDark,
  onShareLocationPress,
  sharedLocationLabel,
}: CoachMemoryCardProps) => (
  <View style={[styles.card, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>    
    <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
      COACH MEMORY
    </Typography>
    {summaryLines.length ? (
      <View style={styles.summaryList}>
        {summaryLines.map((line, index) => (
          <Typography key={`summary-${index}`} variant="bodyText" style={styles.summaryLine}>
            {line}
          </Typography>
        ))}
      </View>
    ) : (
      <Typography variant="bodyText" style={styles.summaryPlaceholder}>
        I'm learning from your questions so I can coach you smarter. Ask me about meals, workouts, or goals.
      </Typography>
    )}

    {focusAreas.length > 0 && (
      <View style={styles.focusRow}>
        {focusAreas.map((area) => (
          <View key={area} style={[styles.focusChip, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}>            
            <Typography variant="caption" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
              {area}
            </Typography>
          </View>
        ))}
      </View>
    )}

    {sharedLocationLabel && (
      <Pressable
        style={[styles.locationButton, { borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]}
        onPress={onShareLocationPress}
      >
        <Typography variant="caption" style={{ color: isDark ? Colors.neutral[200] : Colors.neutral[700] }}>
          {sharedLocationLabel}
        </Typography>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.neutral[200],
  },
  summaryList: {
    marginTop: 8,
    gap: 6,
  },
  summaryLine: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  summaryPlaceholder: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.neutral[500],
    lineHeight: 20,
  },
  focusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  focusChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationButton: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
});
