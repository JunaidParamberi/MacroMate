import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../constants/theme';
import { ActivityCard } from './ActivityCard';

export const ActivityCards: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Daily Calories Card - Large */}
      <ActivityCard
        theme="calories"
        value="1,840"
        goal="/ 2,200 kcal"
        additionalInfo="+120"
        progress={0.84}
        variant="large"
      />

      {/* Second Row - Steps and Active Cards - Small */}
      <View style={styles.row}>
        <ActivityCard
          theme="steps"
          value="8,432"
          progress={0.84}
          variant="small"
        />

        <ActivityCard
          theme="active"
          value="45m"
          progress={0.75}
          variant="small"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
