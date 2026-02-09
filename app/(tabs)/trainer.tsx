import { Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { geminiService } from '@/services/gemini';
import { useDailyLogStore } from '@/store/dailyLog';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  InteractionManager,
  Keyboard,
  Platform,
  Pressable,
  Animated as RNAnimated,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  View
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const TypingIndicator = ({ isDark }: { isDark: boolean }) => {
  const dotValues = useRef([0, 1, 2].map(() => new RNAnimated.Value(0.3))).current;

  useEffect(() => {
    const animations = dotValues.map((value, index) =>
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.delay(index * 150),
          RNAnimated.timing(value, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          RNAnimated.timing(value, {
            toValue: 0.3,
            duration: 280,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop && anim.stop());
  }, [dotValues]);

  return (
    <View style={[styles.messageRow, styles.assistantRow]}>
      <View style={[styles.avatar, { backgroundColor: Colors.brand.primary }]}>
        <Ionicons name="fitness" size={16} color={Colors.neutral.white} />
      </View>
      <View
        style={[
          styles.messageBubble,
          styles.assistantBubble,
          { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] },
        ]}
      >
        <View style={styles.typingDotsRow}>
          {dotValues.map((value, index) => (
            <RNAnimated.View
              key={`dot-${index}`}
              style={[
                styles.typingDot,
                {
                  backgroundColor: isDark ? Colors.neutral[400] : Colors.neutral[500],
                  opacity: value,
                  transform: [
                    {
                      scale: value.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const TAB_BAR_HEIGHT = 85;
const INPUT_AREA_HEIGHT = 60;
const STREAM_INTERVAL_MS = 10;

const quickActions = [
  { id: 'meal', label: '💡 Meal Ideas', prompt: 'Suggest some healthy meal ideas for today based on my macros' },
  { id: 'workout', label: '💪 Workout Plan', prompt: 'Create a workout plan for me today' },
  { id: 'progress', label: '📊 My Progress', prompt: 'How am I doing with my fitness goals? Analyze my progress.' },
  { id: 'tips', label: '🔥 Quick Tips', prompt: 'Give me 3 quick fitness tips for today' },
];

export default function TrainerScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const inputSurfaceColor = isDark ? Colors.neutral[900] : Colors.neutral.white;
  const flatListRef = useRef<FlatList>(null);
  const inputBottomPosition = useRef(new RNAnimated.Value(0)).current;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey there! I'm Coach Alex 👋\n\nI'm your personal AI fitness trainer. I can help you with:\n• 🍽️ Meal planning & nutrition advice\n• 💪 Workout recommendations\n• 📊 Progress tracking & analysis\n• 🎯 Goal setting & motivation\n\nWhat would you like help with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback((delay: number = 0) => {
    const clampedDelay = Math.max(0, delay);
    const executeScroll = () => {
      if (!flatListRef.current || messages.length === 0) return;

      const scrollAction = () => {
        const lastIndex = Math.max(messages.length - 1, 0);
        try {
          flatListRef.current?.scrollToIndex({ index: lastIndex, animated: true });
        } catch {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      };

      InteractionManager.runAfterInteractions(scrollAction);
    };

    if (clampedDelay > 0) {
      setTimeout(executeScroll, clampedDelay);
    } else {
      requestAnimationFrame(executeScroll);
    }
  }, [messages.length]);

  const streamAssistantResponse = useCallback(
    (response: string) =>
      new Promise<void>((resolve) => {
        const messageId = `${Date.now()}-assistant`;
        const createdAt = new Date();
        const characters = Array.from(response);

        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            role: 'assistant',
            content: '',
            timestamp: createdAt,
          },
        ]);

        let index = 0;
        const interval = setInterval(() => {
          index += 1;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    content: characters.slice(0, index).join(''),
                  }
                : message
            )
          );
          scrollToBottom(0);

          if (index >= characters.length) {
            clearInterval(interval);
            resolve();
          }
        }, STREAM_INTERVAL_MS);
      }),
    [scrollToBottom]
  );

  const { 
    primaryGoal, 
    currentWeight, 
    targetWeight, 
    dailyCalorieTarget,
    proteinTarget,
    projectedMilestone,
  } = useUserProfileStore();
  
  const { getTodaysTotals } = useDailyLogStore();
  const todaysStats = getTodaysTotals();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardWillShow = Keyboard.addListener(showEvent, (e: any) => {
      const height = e?.endCoordinates?.height || 0;
      setKeyboardVisible(true);
      setKeyboardHeight(height);
      RNAnimated.timing(inputBottomPosition, {
        toValue: height,
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false,
      }).start();
      scrollToBottom(250);
    });

    const keyboardWillHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      RNAnimated.timing(inputBottomPosition, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(120);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(0);
  }, [scrollToBottom]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollToBottom(80);

    try {
      const context = `
User Profile:
- Goal: ${primaryGoal || 'maintain weight'}
- Current weight: ${currentWeight}kg
- Target weight: ${targetWeight}kg
- Daily calorie target: ${dailyCalorieTarget} kcal
- Protein target: ${proteinTarget}g
- Projected milestone: ${projectedMilestone || 'Not set'}

Today's Progress:
- Calories consumed: ${todaysStats.calories} / ${dailyCalorieTarget} kcal
- Protein: ${todaysStats.protein}g / ${proteinTarget}g
- Carbs: ${todaysStats.carbs}g
- Fat: ${todaysStats.fats}g
- Exercise: ${todaysStats.exercise} kcal burned

Coach Alex is friendly, encouraging, and provides actionable fitness advice. He uses emojis occasionally and keeps responses concise (2-4 sentences max unless giving a detailed plan).`;

      const response = await geminiService.chatWithTrainer(text.trim(), context);

      await streamAssistantResponse(response);
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.role === 'user';
    
    return (
      <Animated.View 
        entering={index === messages.length - 1 ? FadeInUp.duration(250) : undefined}
        style={[
          styles.messageRow,
          isUser ? styles.userRow : styles.assistantRow,
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: Colors.brand.primary }]}>
            <Ionicons name="fitness" size={16} color={Colors.neutral.white} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: Colors.brand.primary }]
              : [styles.assistantBubble, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }],
          ]}
        >
          <Typography
            variant="bodyText"
            style={{
              color: isUser ? Colors.neutral.white : isDark ? Colors.neutral[50] : Colors.neutral[800],
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            {item.content}
          </Typography>
        </View>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View entering={FadeIn.delay(200)} style={styles.quickActionsSection}>
      <Typography variant="metaLabel" style={[styles.quickActionsTitle, { color: isDark ? Colors.neutral[500] : Colors.neutral[400] }]}>
        QUICK START
      </Typography>
      <View style={styles.quickActionsRow}>
        {quickActions.map((action, index) => (
          <Animated.View key={action.id} entering={FadeIn.delay(250 + index * 50)}>
            <Pressable
              style={[styles.quickActionChip, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}
              onPress={() => handleQuickAction(action.prompt)}
            >
              <Typography
                variant="caption"
                style={[styles.quickActionText, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}
              >
                {action.label}
              </Typography>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const bottomPadding = isKeyboardVisible 
    ? keyboardHeight + INPUT_AREA_HEIGHT + 20
    : TAB_BAR_HEIGHT + 80;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50], borderBottomColor: isDark ? Colors.neutral[800] : Colors.neutral[200] }]}>        
        <View style={styles.backButton} />
        <View style={styles.headerCenter}>
          <View style={[styles.trainerAvatar, { backgroundColor: Colors.brand.primary }]}>
            <Ionicons name="fitness" size={24} color={Colors.neutral.white} />
          </View>
          <Typography variant="h3" style={[styles.headerTitle, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}>
            Coach Alex
          </Typography>
          <View style={styles.statusRow}>
            <View style={[styles.onlineDot, { backgroundColor: Colors.brand.primary }]} />
            <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              Online
            </Typography>
          </View>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.messagesList, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={isLoading ? <TypingIndicator isDark={isDark} /> : null}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollToBottom(20)}
        removeClippedSubviews={false}
        onLayout={() => scrollToBottom(0)}
        onScrollToIndexFailed={({ averageItemLength, index }) => {
          if (!averageItemLength || index < 0) return;
          flatListRef.current?.scrollToOffset({
            offset: averageItemLength * index,
            animated: true,
          });
        }}
      />

      {/* Input Area */}
      <RNAnimated.View
        style={[
          styles.inputSection,
          { 
            backgroundColor: inputSurfaceColor,
            bottom: inputBottomPosition,
            paddingBottom: isKeyboardVisible ? 0 : TAB_BAR_HEIGHT,
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}> 
            <TextInput
              style={[styles.input, { color: isDark ? Colors.neutral[50] : Colors.neutral[800] }]}
              placeholder="Message Coach Alex..."
              placeholderTextColor={isDark ? Colors.neutral[500] : Colors.neutral[400]}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              textAlignVertical="center"
            />
            <Pressable
              style={[styles.sendButton, { 
                backgroundColor: inputText.trim() ? Colors.brand.primary : Colors.neutral[400],
                opacity: inputText.trim() ? 1 : 0.4 
              }]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingDots}>
                  <View style={[styles.dot, { backgroundColor: Colors.neutral.white }]} />
                  <View style={[styles.dot, { backgroundColor: Colors.neutral.white, marginLeft: 3 }]} />
                  <View style={[styles.dot, { backgroundColor: Colors.neutral.white, marginLeft: 3 }]} />
                </View>
              ) : (
                <Ionicons name="arrow-up" size={22} color={Colors.neutral.white} />
              )}
            </Pressable>
          </View>
        </View>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  trainerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  quickActionsSection: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  quickActionsTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  messagesList: {
    paddingTop: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '80%',
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    borderBottomLeftRadius: 6,
  },
  inputSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 4,
    ...Shadows.sm,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  typingDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});