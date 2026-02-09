import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TrainerMessageRole = 'user' | 'assistant';

export interface TrainerMessage {
  id: string;
  role: TrainerMessageRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type TrainerFocusArea = 'Nutrition' | 'Training' | 'Recovery' | 'Mindset' | 'Progress';

export type TrainerAutomationType =
  | 'log_food'
  | 'log_exercise'
  | 'log_water'
  | 'open_page'
  | 'send_prompt'
  | 'open_map';

export interface SharedLocation {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
}

export interface TrainerAutomationSuggestion {
  id: string;
  type: TrainerAutomationType;
  label: string;
  description?: string;
  payload?: Record<string, any>;
  createdAt: string;
  completedAt?: string | null;
}

export interface TrainerConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  focusAreas: TrainerFocusArea[];
  messages: TrainerMessage[];
  automations: TrainerAutomationSuggestion[];
}

type LocationPermission = 'unknown' | 'granted' | 'denied';

interface TrainerChatState {
  conversations: Record<string, TrainerConversation>;
  activeConversationId: string;
  isHydrated: boolean;
  sharedLocation: SharedLocation | null;
  sharedLocationUpdatedAt: string | null;
  locationPermissionStatus: LocationPermission;
  initConversation: (conversationId?: string) => void;
  setActiveConversation: (conversationId: string) => void;
  appendMessage: (
    message: Omit<TrainerMessage, 'id' | 'timestamp'> & Partial<Pick<TrainerMessage, 'id' | 'timestamp'>>,
    conversationId?: string
  ) => TrainerMessage;
  setConversationSummary: (
    summary: string,
    focusAreas?: TrainerFocusArea[],
    conversationId?: string
  ) => void;
  addAutomationSuggestion: (
    suggestion: Omit<TrainerAutomationSuggestion, 'id' | 'createdAt' | 'completedAt'>,
    conversationId?: string
  ) => TrainerAutomationSuggestion;
  completeAutomationSuggestion: (automationId: string, conversationId?: string) => void;
  clearConversation: (conversationId?: string) => void;
  refreshInsights: (conversationId?: string) => void;
  setSharedLocation: (location: SharedLocation | null) => void;
  setLocationPermissionStatus: (status: LocationPermission) => void;
}

const MAX_MESSAGES = 80;

const defaultWelcomeMessage = `Hey there! I'm Coach Alex 👋\n\nI remember our past chats so I can coach you smarter over time. Tell me what you need help with—nutrition, training, habits, or accountability—and I'll keep track for you.`;

const createDefaultConversation = (id: string = 'default'): TrainerConversation => {
  const now = new Date().toISOString();
  return {
    id,
    title: 'Daily Coaching',
    createdAt: now,
    updatedAt: now,
    summary: '',
    focusAreas: [],
    messages: [
      {
        id: `welcome-${now}`,
        role: 'assistant',
        content: defaultWelcomeMessage,
        timestamp: now,
      },
    ],
    automations: [],
  };
};

const deriveFocusAreas = (messages: TrainerMessage[]): TrainerFocusArea[] => {
  const flags = new Set<TrainerFocusArea>();
  messages.forEach((message) => {
    if (message.role !== 'user') return;
    const text = message.content.toLowerCase();
    if (/meal|macro|protein|calorie|food|nutrition|diet/.test(text)) {
      flags.add('Nutrition');
    }
    if (/workout|training|exercise|gym|lift|run|cardio/.test(text)) {
      flags.add('Training');
    }
    if (/sleep|recovery|sore|rest|fatigue/.test(text)) {
      flags.add('Recovery');
    }
    if (/motivation|mindset|stress|focus|accountability/.test(text)) {
      flags.add('Mindset');
    }
    if (/progress|goal|plateau|trend|weigh|track/.test(text)) {
      flags.add('Progress');
    }
  });
  return Array.from(flags);
};

const buildSummary = (messages: TrainerMessage[]): string => {
  const recent = messages
    .filter((msg) => msg.role === 'user')
    .slice(-3)
    .map((msg) => `• ${msg.content.trim()}`);
  return recent.length ? `Recent asks:\n${recent.join('\n')}` : '';
};

export const useTrainerChatStore = create<TrainerChatState>()(
  persist(
    (set, get) => ({
      conversations: {
        default: createDefaultConversation(),
      },
      activeConversationId: 'default',
      isHydrated: false,
      sharedLocation: null,
      sharedLocationUpdatedAt: null,
      locationPermissionStatus: 'unknown',
      initConversation: (conversationId = 'default') => {
        set((state) => {
          if (state.conversations[conversationId]) {
            return state;
          }
          return {
            conversations: {
              ...state.conversations,
              [conversationId]: createDefaultConversation(conversationId),
            },
          };
        });
      },
      setActiveConversation: (conversationId) => {
        const state = get();
        if (!state.conversations[conversationId]) {
          state.initConversation(conversationId);
        }
        set({ activeConversationId: conversationId });
      },
      appendMessage: (message, conversationId) => {
        const targetId = conversationId || get().activeConversationId || 'default';
        const preparedMessage: TrainerMessage = {
          id: message.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: message.role,
          content: message.content.trim(),
          timestamp: message.timestamp || new Date().toISOString(),
          metadata: message.metadata,
        };

        set((state) => {
          const existing = state.conversations[targetId] || createDefaultConversation(targetId);
          const messages = [...existing.messages, preparedMessage];
          const trimmed = messages.slice(-MAX_MESSAGES);

          return {
            conversations: {
              ...state.conversations,
              [targetId]: {
                ...existing,
                id: targetId,
                messages: trimmed,
                updatedAt: preparedMessage.timestamp,
              },
            },
            activeConversationId: targetId,
          };
        });

        // Refresh insights after the store updates
        get().refreshInsights(targetId);

        return preparedMessage;
      },
      setConversationSummary: (summary, focusAreas = [], conversationId) => {
        const targetId = conversationId || get().activeConversationId;
        if (!targetId) return;
        set((state) => {
          const existing = state.conversations[targetId];
          if (!existing) {
            return state;
          }
          return {
            conversations: {
              ...state.conversations,
              [targetId]: {
                ...existing,
                summary,
                focusAreas,
              },
            },
          };
        });
      },
      addAutomationSuggestion: (suggestion, conversationId) => {
        const targetId = conversationId || get().activeConversationId;
        if (!targetId) {
          throw new Error('No active conversation');
        }

        const prepared: TrainerAutomationSuggestion = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
          completedAt: null,
          ...suggestion,
        };

        set((state) => {
          const existing = state.conversations[targetId] || createDefaultConversation(targetId);
          return {
            conversations: {
              ...state.conversations,
              [targetId]: {
                ...existing,
                automations: [...existing.automations, prepared],
              },
            },
          };
        });

        return prepared;
      },
      completeAutomationSuggestion: (automationId, conversationId) => {
        const targetId = conversationId || get().activeConversationId;
        if (!targetId) return;
        set((state) => {
          const existing = state.conversations[targetId];
          if (!existing) {
            return state;
          }
          return {
            conversations: {
              ...state.conversations,
              [targetId]: {
                ...existing,
                automations: existing.automations.map((automation) =>
                  automation.id === automationId
                    ? { ...automation, completedAt: new Date().toISOString() }
                    : automation
                ),
              },
            },
          };
        });
      },
      clearConversation: (conversationId) => {
        const targetId = conversationId || get().activeConversationId || 'default';
        set((state) => ({
          conversations: {
            ...state.conversations,
            [targetId]: createDefaultConversation(targetId),
          },
        }));
      },
      refreshInsights: (conversationId) => {
        const targetId = conversationId || get().activeConversationId;
        if (!targetId) return;
        const state = get();
        const conversation = state.conversations[targetId];
        if (!conversation) return;
        const summary = buildSummary(conversation.messages);
        const focusAreas = deriveFocusAreas(conversation.messages);
        set((current) => ({
          conversations: {
            ...current.conversations,
            [targetId]: {
              ...conversation,
              summary,
              focusAreas,
            },
          },
        }));
      },
      setSharedLocation: (location) => {
        set({
          sharedLocation: location,
          sharedLocationUpdatedAt: location ? new Date().toISOString() : null,
        });
      },
      setLocationPermissionStatus: (status) => {
        set({ locationPermissionStatus: status });
      },
    }),
    {
      name: 'macromate-trainer-chat',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
