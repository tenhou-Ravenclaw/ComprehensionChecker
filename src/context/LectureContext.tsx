"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type LectureContextType = {
  teacherContext: string;
  setTeacherContext: (context: string) => void;
  chatLog: Message[];
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
};

const LectureContext = createContext<LectureContextType | undefined>(undefined);

export const LectureProvider = ({ children }: { children: ReactNode }) => {
  const [teacherContext, setTeacherContext] = useState('');
  const [chatLog, setChatLog] = useState<Message[]>([]);

  const addChatMessage = (role: 'user' | 'assistant', content: string) => {
    setChatLog((prev) => [...prev, { role, content }]);
  };

  const clearChat = () => {
    setChatLog([]);
  };

  return (
    <LectureContext.Provider
      value={{
        teacherContext,
        setTeacherContext,
        chatLog,
        addChatMessage,
        clearChat,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};

export const useLecture = () => {
  const context = useContext(LectureContext);
  if (context === undefined) {
    throw new Error('useLecture must be used within a LectureProvider');
  }
  return context;
};

