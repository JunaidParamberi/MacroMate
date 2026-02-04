import { Card, Screen, ScreenContent, Typography } from '@/components/ui';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function LogScreen() {
  return (
    <Screen>
      <ScreenContent padding="md">
        <Typography variant="headlineDisplay" style={styles.title}>
          log
        </Typography>
        <Typography variant="bodyText" style={styles.subtitle}>
         log
        </Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">Current Goals</Typography>
          <Typography variant="bodyText">Your active goals will appear here</Typography>
        </Card>
      </ScreenContent>

    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
});
