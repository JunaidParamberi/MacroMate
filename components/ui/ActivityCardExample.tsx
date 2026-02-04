import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../constants/theme';
import { ActivityCard } from './ActivityCard';
import { ActivityCards } from './ActivityCards';
import { Screen } from './Screen';
import { Typography } from './Typography';

// Example of how to use individual ActivityCard components
export const ActivityCardExample: React.FC = () => {
  return (
    <Screen>
      <View style={styles.content}>
        <Typography variant="h2" style={styles.title}>
          Today's Activity
        </Typography>

        {/* Using the pre-configured ActivityCards component */}
        <ActivityCards />

        {/* Or using individual cards with custom data */}
        <Typography variant="h3" style={styles.subtitle}>
          Custom Cards
        </Typography>
        
        <View style={styles.customRow}>
          <ActivityCard
            title="Water Intake"
            value="2.1L"
            icon="water"
            iconBackgroundColor="#3498DB"
            progress={0.7}
            additionalInfo="+300ml"
          />
          
          <ActivityCard
            title="Sleep"
            value="7h 30m"
            icon="moon"
            iconBackgroundColor="#34495E"
            progress={0.94}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  customRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
