import { ActivityListContainer, ActivityListItem, AITipCard, Container, Screen, ScreenContent, Typography } from '@/components/ui';
import { ActivityCard } from '@/components/ui/ActivityCard';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
         <ScreenContent padding="md">
      <Typography variant="h2" style={styles.welcomeText}>
        Welcome Back!
      </Typography>
      <Typography variant="bodyText" style={styles.subtitle}>
        Ready to crush your fitness goals today?
      </Typography>
      

      
  <ActivityCard
  theme="calories"
  value="1,840"
  goal="/ 2,200 kcal"
  additionalInfo="+120"
  progress={0.84}
  variant="large"
  icon="flame"
  iconBackgroundColor="#FF6B35"
  progressColor="#FF6B35"
  additionalInfoColor="#FF6B35"

/>


<View style={styles.activityCards}>
  <View style={styles.cardWrapper}>
    <ActivityCard
      theme="custom"
      title="Water Intake"
      value="2.1L"
      icon="water"
      iconBackgroundColor="#3498DB"
      progress={0.7}
      variant="compact"
      showProgressBar={true}
      showAdditionalInfo={true}
      additionalInfo="+300ml"
      style={{ height: '100%' }}
    />
  </View>
  <View style={styles.cardWrapper}>
    <ActivityCard
      theme="heart"
      value="72 bpm"
      subtitle="Resting"
      variant="compact"
      iconSize={20}
      showGoal={false}
      showProgressBar={false}
      style={{ height: '100%' }}
    />
  </View>
</View>


<View style={styles.todaysLogs}>
  <View style={styles.todaysLogsTitle}>

  <Typography variant="h2" >
   Todays Log's
  </Typography>

  <Typography variant="link" >
   View All
  </Typography>
  </View>
  <ActivityListContainer style={styles.listContainer} >
  <ActivityListItem
    title="Morning Run"
    subtitle="5.2 km • 28 min"
    icon="walk"
    iconLibrary="ionicons"
    onPress={() => console.log('Pressed')}
    iconBackgroundColor="#00ff0d7f"
  />
  <ActivityListItem
    title="Cycling"
    subtitle="12.8 km • 45 min"
    icon="bicycle"
    iconLibrary="ionicons"
      iconBackgroundColor="#00d9ff7f"

  />
</ActivityListContainer>
</View>

<Container paddingTop='md'>

<AITipCard
  title="Prioritize Sleep"
  tip="Aim for 7-9 hours of quality sleep to optimize recovery and performance."
  category="Recovery"
  aiType="recovery"
  aiConfidence={0.78}
  priority="medium"
/>
  </Container>


</ScreenContent>

    </Screen>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  activityCards: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    height: 140, // Fixed height to accommodate larger card
  },
  todaysLogs: {
    marginTop: 24,
  
  },
  todaysLogsTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
      marginBottom: 16,
  },
  listContainer: {
   display: 'flex',
   flexDirection: 'column',
   gap: 12,

  },
  });
