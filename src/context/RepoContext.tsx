import React, { createContext, useContext, useState, useCallback } from 'react';
import { Repo, ChatMessage, FeedEvent, MOCK_CHAT_HISTORY, MOCK_FEED_EVENTS } from '@/data/mockData';

interface RepoContextType {
  activeRepo: Repo | null;
  setActiveRepo: (repo: Repo | null) => void;
  recentRepos: Repo[];
  addRecentRepo: (repo: Repo) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  feedEvents: FeedEvent[];
  addFeedEvent: (event: FeedEvent) => void;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRepo, setActiveRepoState] = useState<Repo | null>(null);
  const [recentRepos, setRecentRepos] = useState<Repo[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>(MOCK_FEED_EVENTS);

  const setActiveRepo = useCallback((repo: Repo | null) => {
    setActiveRepoState(repo);
    if (repo) {
      setChatHistory(MOCK_CHAT_HISTORY);
      setFeedEvents(MOCK_FEED_EVENTS);
    }
  }, []);

  const addRecentRepo = useCallback((repo: Repo) => {
    setRecentRepos(prev => {
      const filtered = prev.filter(r => r.id !== repo.id);
      return [repo, ...filtered].slice(0, 5);
    });
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatHistory(prev => [...prev, msg]);
  }, []);

  const addFeedEvent = useCallback((event: FeedEvent) => {
    setFeedEvents(prev => [event, ...prev]);
  }, []);

  return (
    <RepoContext.Provider value={{
      activeRepo, setActiveRepo, recentRepos, addRecentRepo,
      chatHistory, addChatMessage, feedEvents, addFeedEvent,
    }}>
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error('useRepo must be used within RepoProvider');
  return ctx;
};
