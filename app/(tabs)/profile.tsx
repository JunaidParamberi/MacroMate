import { Card, Screen, ScreenContent, Typography } from '@/components/ui';
import React from 'react';
import { StyleSheet } from 'react-native';


export default function ProfileScreen() {
  return (
    <Screen>
      <ScreenContent padding="md">
        <Typography variant="headlineDisplay" style={styles.title}>
          Profile
        </Typography>
        <Typography variant="bodyText" style={styles.subtitle}>
          Manage your account and preferences
        </Typography>
        
        <Card style={styles.card}>
          <Typography variant="h3">User Information</Typography>
          <Typography variant="bodyText">Your profile details will appear here</Typography>
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
