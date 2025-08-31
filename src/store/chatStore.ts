import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: string;
  lastUpdated: string;
}

interface ChatStore {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  hydrateFromStorage: () => void;
}

const STORAGE_KEY = 'haseen-chat-sessions';

// Helper function to load sessions from localStorage
const loadSessionsFromStorage = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper function to save sessions to localStorage
const saveSessionsToStorage = (sessions: ChatSession[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

// Initial state (avoid reading localStorage during SSR/module eval)
const initialState = {
  currentSession: null as ChatSession | null,
  sessions: [] as ChatSession[],
  isLoading: false,
  error: null as string | null,
  hasHydrated: false,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  hydrateFromStorage: () => {
    // Only run on client
    const sessionsFromStorage = loadSessionsFromStorage();
    set({
      sessions: sessionsFromStorage,
      currentSession: sessionsFromStorage.length > 0 ? sessionsFromStorage[0] : null,
      hasHydrated: true,
    });
  },

  sendMessage: async (content: string) => {
    try {
      set({ isLoading: true, error: null });
      
      let { currentSession } = get();
      if (!currentSession) {
        get().createNewSession();
        currentSession = get().currentSession;
      }

      if (!currentSession) throw new Error('Failed to create session');

      // Add user message
      const userMessage: Message = {
        id: nanoid(),
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      };

      // Update session with user message immediately
      const sessionWithUserMessage: ChatSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        lastUpdated: new Date().toISOString()
      };

      // Update store with user message immediately
      set(state => ({
        currentSession: sessionWithUserMessage,
        sessions: state.sessions.map(s => 
          s.id === sessionWithUserMessage.id ? sessionWithUserMessage : s
        )
      }));

      // Save to localStorage
      saveSessionsToStorage(get().sessions);

      // Prepare messages for API call
      const apiMessages = sessionWithUserMessage.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      // Add assistant message
      const assistantMessage: Message = {
        id: nanoid(),
        content: data.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };

      // Update session with assistant message
      const updatedSession: ChatSession = {
        ...sessionWithUserMessage,
        messages: [...sessionWithUserMessage.messages, assistantMessage],
        lastUpdated: new Date().toISOString()
      };

      // Update store and localStorage
      const updatedSessions = get().sessions.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      );
      
      set({ 
        currentSession: updatedSession,
        sessions: updatedSessions,
        isLoading: false 
      });
      
      saveSessionsToStorage(updatedSessions);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to send message', isLoading: false });
    }
  },

  createNewSession: () => {
    const newSession: ChatSession = {
      id: nanoid(),
      messages: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const updatedSessions = [newSession, ...get().sessions];
    set({ 
      currentSession: newSession,
      sessions: updatedSessions
    });
    saveSessionsToStorage(updatedSessions);
  },

}));