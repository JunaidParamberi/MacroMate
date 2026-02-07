import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CENTER_OFFSET = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2;

export default function DobScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { dateOfBirth, setDateOfBirth } = useUserProfileStore();
  
  const [day, setDay] = useState(dateOfBirth ? dateOfBirth.getDate() - 1 : 23);
  const [month, setMonth] = useState(dateOfBirth ? dateOfBirth.getMonth() : 8);
  const [year, setYear] = useState(dateOfBirth ? dateOfBirth.getFullYear() - 1940 : 59);

  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  // Scroll to correct position on mount based on stored date
  useEffect(() => {
    const dayOffsetY = day * ITEM_HEIGHT;
    const monthOffsetY = month * ITEM_HEIGHT;
    const yearOffsetY = year * ITEM_HEIGHT;
    
    dayScrollRef.current?.scrollTo({ y: dayOffsetY, animated: false });
    monthScrollRef.current?.scrollTo({ y: monthOffsetY, animated: false });
    yearScrollRef.current?.scrollTo({ y: yearOffsetY, animated: false });
  }, []);

  const handleContinue = () => {
    setDateOfBirth(new Date(1940 + year, month, day + 1));
    router.push('/onboarding/bodyfat');
  };

  const handleDayScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index !== day && index >= 0 && index <= 30) {
      setDay(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMonthScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index !== month && index >= 0 && index <= 11) {
      setMonth(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleYearScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index !== year && index >= 0 && index <= 60) {
      setYear(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const CENTER_OFFSET = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2;

  // Render functions for picker items
  const renderDayItems = () => {
    const items = [];
    for (let i = 1; i <= 31; i++) {
      const isSelected = (i - 1) === day;
      items.push(
        <View key={i} style={styles.itemContainer}>
          <Typography
            variant="bodyText"
            style={{
              color: isSelected
                ? isDark ? Colors.neutral[100] : Colors.neutral[900]
                : isDark ? Colors.neutral[500] : Colors.neutral[400],
              fontWeight: isSelected ? '700' : '500',
              fontSize: isSelected ? 24 : 20,
            }}
          >
            {i}
          </Typography>
        </View>
      );
    }
    return items;
  };

  const renderMonthItems = () => {
    const items = [];
    for (let i = 0; i < 12; i++) {
      const isSelected = i === month;
      items.push(
        <View key={i} style={styles.itemContainer}>
          <Typography
            variant="bodyText"
            numberOfLines={1}
            style={{
              color: isSelected
                ? isDark ? Colors.neutral[100] : Colors.neutral[900]
                : isDark ? Colors.neutral[500] : Colors.neutral[400],
              fontWeight: isSelected ? '700' : '500',
              fontSize: isSelected ? 22 : 18,
            }}
          >
            {months[i]}
          </Typography>
        </View>
      );
    }
    return items;
  };

  const renderYearItems = () => {
    const items = [];
    for (let i = 0; i <= 60; i++) {
      const yearValue = 1940 + i;
      const isSelected = i === year;
      items.push(
        <View key={i} style={styles.itemContainer}>
          <Typography
            variant="bodyText"
            style={{
              color: isSelected
                ? isDark ? Colors.neutral[100] : Colors.neutral[900]
                : isDark ? Colors.neutral[500] : Colors.neutral[400],
              fontWeight: isSelected ? '700' : '500',
              fontSize: isSelected ? 24 : 20,
            }}
          >
            {yearValue}
          </Typography>
        </View>
      );
    }
    return items;
  };

  return (
    <StepContainer
      title="When were you born?"
      subtitle="We use this to calibrate your metabolic rate."
      currentStep={5}
      totalSteps={10}
      onContinue={handleContinue}
      progressBar={<OnboardingProgressBar currentStep={5} totalSteps={10} />}
    >
      <View style={styles.container}>
        {/* Date Display */}
        <Typography 
          variant="h1" 
          style={{ 
            fontSize: 32, 
            fontWeight: '600', 
            color: isDark ? Colors.neutral[100] : Colors.neutral[900], 
            marginBottom: 40, 
            textAlign: 'center' 
          }}
        >
          {months[month]} {day + 1}, {1940 + year}
        </Typography>

        {/* Date Pickers */}
        <View style={styles.pickersContainer} pointerEvents="box-none">
          {/* Day Column */}
          <View style={styles.columnContainer}>
            <ScrollView
              ref={dayScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleDayScroll}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingTop: CENTER_OFFSET,
                paddingBottom: CENTER_OFFSET,
              }}
            >
              {renderDayItems()}
            </ScrollView>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Month Column */}
          <View style={styles.monthColumn}>
            <ScrollView
              ref={monthScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleMonthScroll}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingTop: CENTER_OFFSET,
                paddingBottom: CENTER_OFFSET,
              }}
            >
              {renderMonthItems()}
            </ScrollView>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Year Column */}
          <View style={styles.yearColumn}>
            <ScrollView
              ref={yearScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onScroll={handleYearScroll}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              contentContainerStyle={{
                paddingTop: CENTER_OFFSET,
                paddingBottom: CENTER_OFFSET,
              }}
            >
              {renderYearItems()}
            </ScrollView>
          </View>

          {/* Top Fade Overlay */}
          <LinearGradient
            colors={isDark ? [Colors.neutral[900], Colors.neutral[900] + '00'] : [Colors.neutral[50], Colors.neutral[50] + '00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.fadeOverlay, styles.fadeTop]}
          />
          
          {/* Bottom Fade Overlay */}
          <LinearGradient
            colors={isDark ? [Colors.neutral[900] + '00', Colors.neutral[900]] : [Colors.neutral[50] + '00', Colors.neutral[50]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.fadeOverlay, styles.fadeBottom]}
          />

          {/* Selection Indicator */}
          <View 
            style={[
              styles.selectionIndicator,
              { 
                borderTopColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
                borderBottomColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
              }
            ]} 
          />
        </View>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    flex: 1,
  },
  pickersContainer: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  columnContainer: {
    width: 90,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  monthColumn: {
    width: 130,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  yearColumn: {
    width: 110,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    opacity: 0.5,
  },
  fadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    zIndex: 10,
    pointerEvents: 'none',
  },
  fadeTop: {
    top: 0,
  },
  fadeBottom: {
    bottom: 0,
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CENTER_OFFSET,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 5,
    backgroundColor: isDark ? Colors.neutral[800] + '30' : Colors.neutral[100] + '30',
  },
});