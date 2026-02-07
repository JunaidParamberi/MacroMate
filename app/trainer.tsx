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
    Keyboard,
    Platform,
    Pressable,
    Animated as RNAnimated,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
  const flatListRef = useRef<FlatList>(null);
  const keyboardAnimation = useRef(new RNAnimated.Value(0)).current;

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
      RNAnimated.timing(keyboardAnimation, {
        toValue: e.endCoordinates.height,
        duration: 250,
        useNativeDriver: false,
      }).start();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    const keyboardWillHide = Keyboard.addListener(hideEvent, () => {
      RNAnimated.timing(keyboardAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardAnimation]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

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
    scrollToEnd();

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToEnd();
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
              <Typography variant="caption" style={[styles.quickActionText, { color: isDark ? Colors.neutral[300] : Colors.neutral[600] }]}>
                {action.label}
              </Typography>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50] }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50], borderBottomColor: isDark ? Colors.neutral[800] : Colors.neutral[200] }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={isDark ? Colors.neutral[300] : Colors.neutral[600]} />
        </Pressable>
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

      {/* Chat Messages - Single FlatList, no nested ScrollViews */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={scrollToEnd}
        removeClippedSubviews={false}
      />

      {/* Input Area with animated keyboard padding */}
      <RNAnimated.View style={{ paddingBottom: keyboardAnimation }}>
        <View style={[styles.inputWrapper, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}>
          <View style={[styles.inputContainer, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral.white }]}>
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
    </SafeAreaView>
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
    paddingTop: 8,
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
    paddingBottom: 16,
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
  inputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
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
});
