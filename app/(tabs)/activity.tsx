import { Card, Screen, ScreenContent, Typography } from '@/components/ui';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function ActivityScreen() {
  return (
    <Screen>
      <ScreenContent padding="md">
        <Typography variant="headlineDisplay" style={styles.title}>
          Activity
        </Typography>
        <Typography variant="bodyText" style={styles.subtitle}>
          Track your fitness progress and achievements
        </Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">Recent Workouts</Typography>
          <Typography variant="bodyText">Your latest activities will appear here</Typography>
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
