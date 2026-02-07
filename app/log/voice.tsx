import { Screen, ScreenContent, Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from 'react-native-reanimated';

export default function VoiceLogScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSpring(1.3, { damping: 10 }),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withTiming(0, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseScale.value = 1;
      pulseOpacity.value = 0.5;
    }
  }, [isRecording]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate transcription
      setTimeout(() => {
        setTranscript('I had a grilled chicken salad with avocado and a bottle of water for lunch');
        setIsRecording(false);
      }, 3000);
    }
  };

  return (
    <Screen>
      <ScreenContent padding="md">
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
          </Pressable>
          <Typography variant="h2" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Voice Log
          </Typography>
          <View style={{ width: 44 }} />
        </View>

        {/* Recording Section */}
        <View style={styles.recordingContainer}>
          <View style={styles.micContainer}>
            <Animated.View 
              style={[
                styles.pulseRing,
                { backgroundColor: Colors.brand.primary },
                pulseStyle,
              ]} 
            />
            <Pressable 
              style={[styles.micButton, { backgroundColor: isRecording ? Colors.brand.accent : Colors.brand.primary }]}
              onPress={handleRecord}
            >
              <Ionicons name={isRecording ? 'stop' : 'mic'} size={40} color={Colors.neutral.white} />
            </Pressable>
          </View>
          
          <Typography 
            variant="h3" 
            style={[styles.recordingText, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}
          >
            {isRecording ? 'Listening...' : 'Tap to start speaking'}
          </Typography>
          
          {!isRecording && (
            <Typography variant="metaLabel" style={{ color: isDark ? Colors.neutral[500] : Colors.neutral[500], textAlign: 'center' }}>
              Describe what you ate and AI will log it for you
            </Typography>
          )}
        </View>

        {/* Transcript Preview */}
        {transcript && (
          <View style={[styles.transcriptCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white }]}>
            <Typography variant="h3" style={{ marginBottom: 12, color: isDark ? Colors.neutral[50] : Colors.neutral[800] }}>
              Detected Items
            </Typography>
            <Typography variant="bodyText" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600], marginBottom: 16 }}>
              "{transcript}"
            </Typography>
            
            <View style={styles.detectedItems}>
              <View style={[styles.foodTag, { backgroundColor: Colors.brand.primary + '20' }]}>
                <Typography variant="caption" style={{ color: Colors.brand.primary }}>
                  Grilled Chicken Salad
                </Typography>
              </View>
              <View style={[styles.foodTag, { backgroundColor: Colors.brand.primary + '20' }]}>
                <Typography variant="caption" style={{ color: Colors.brand.primary }}>
                  Avocado
                </Typography>
              </View>
              <View style={[styles.foodTag, { backgroundColor: Colors.activityColors.active + '20' }]}>
                <Typography variant="caption" style={{ color: Colors.activityColors.active }}>
                  Water
                </Typography>
              </View>
            </View>
          </View>
        )}

        {/* Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Typography variant="metaLabel" style={{ marginBottom: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
            Try saying:
          </Typography>
          {['I had oatmeal with banana for breakfast', 'Chicken rice bowl with vegetables', 'Protein shake and an apple'].map((suggestion, index) => (
            <Pressable 
              key={index} 
              style={[styles.suggestionChip, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}
            >
              <Typography variant="caption" style={{ color: isDark ? Colors.neutral[300] : Colors.neutral[600] }}>
                "{suggestion}"
              </Typography>
            </Pressable>
          ))}
        </View>

        {/* Save Button */}
        {transcript && (
          <Pressable style={styles.saveButton}>
            <Typography variant="bodyText" style={styles.saveText}>Log Items</Typography>
          </Pressable>
        )}
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  micContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  recordingText: {
    fontWeight: '600',
    marginBottom: 8,
  },
  transcriptCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Shadows.sm,
  },
  detectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  foodTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionChip: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.neutral.white,
    fontWeight: '600',
  },
});
