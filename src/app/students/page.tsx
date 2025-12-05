"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLecture } from '@/context/LectureContext';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import Link from 'next/link';
import { Mic, Square, User, Bot, Loader2 } from 'lucide-react';

export default function StudentPage() {
  const { teacherContext, chatLog, addChatMessage } = useLecture();
  const { isRecording, startRecording, stopRecording, audioBlob, setAudioBlob } = useAudioRecorder();
  
  const [status, setStatus] = useState<'idle' | 'processing_stt' | 'processing_chat' | 'processing_tts' | 'playing'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle audio blob changes (after recording stops)
  useEffect(() => {
    if (audioBlob) {
      processAudio(audioBlob);
    }
  }, [audioBlob]);

  const processAudio = async (blob: Blob) => {
    try {
      setStatus('processing_stt');
      setError(null);

      // 1. Speech to Text
      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');

      const sttRes = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!sttRes.ok) throw new Error('Failed to transcribe audio');
      const sttData = await sttRes.json();
      const userText = sttData.text;

      if (!userText) {
         setStatus('idle');
         return; 
      }

      addChatMessage('user', userText);

      // 2. Chat Completion
      setStatus('processing_chat');
      
      const messagesForApi = chatLog.map(msg => ({ role: msg.role, content: msg.content }));
      messagesForApi.push({ role: 'user', content: userText });

      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesForApi,
          context: teacherContext,
        }),
      });

      if (!chatRes.ok) throw new Error('Failed to get chat response');
      const chatData = await chatRes.json();
      const aiText = chatData.reply;

      addChatMessage('assistant', aiText);

      // 3. Text to Speech
      setStatus('processing_tts');

      const ttsRes = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText }),
      });

      if (!ttsRes.ok) throw new Error('Failed to generate speech');
      const ttsBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(ttsBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setStatus('playing');
        audioRef.current.onended = () => setStatus('idle');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      setStatus('idle');
    } finally {
      setAudioBlob(null); // Reset blob to allow new recordings
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
           <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
             &larr; Exit
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Student Mode</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          {chatLog.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p>マイクボタンを押して質問してください。</p>
            </div>
          )}
          
          {chatLog.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white shadow border border-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                <div className="flex items-center mb-1 opacity-70 text-xs">
                  {msg.role === 'user' ? <User size={12} className="mr-1"/> : <Bot size={12} className="mr-1"/>}
                  {msg.role === 'user' ? 'You' : 'AI Teacher'}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Status Indicator */}
          {status !== 'idle' && status !== 'playing' && (
             <div className="flex justify-start">
               <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 flex items-center animate-pulse">
                 <Loader2 size={16} className="animate-spin mr-2" />
                 {status === 'processing_stt' && '音声認識中...'}
                 {status === 'processing_chat' && '考え中...'}
                 {status === 'processing_tts' && '音声生成中...'}
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t p-6 fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto flex flex-col items-center">
           {error && (
             <div className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-1 rounded">
               {error}
             </div>
           )}

           <button
             onClick={isRecording ? stopRecording : startRecording}
             disabled={status !== 'idle' && status !== 'playing'}
             className={`
               w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
               ${isRecording 
                 ? 'bg-red-500 hover:bg-red-600 scale-110' 
                 : 'bg-blue-600 hover:bg-blue-700'
               }
               ${(status !== 'idle' && status !== 'playing') ? 'opacity-50 cursor-not-allowed' : ''}
             `}
           >
             {isRecording ? (
               <Square size={32} className="text-white" />
             ) : (
               <Mic size={32} className="text-white" />
             )}
           </button>
           
           <p className="mt-4 text-gray-500 text-sm font-medium">
             {isRecording ? '聞いています...' : status === 'playing' ? '話しています...' : 'マイクを押して話す'}
           </p>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

