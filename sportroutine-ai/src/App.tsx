import React, { useState, useEffect, useRef } from 'react';
import { Message, SavedRoutine } from './types';
import { Header } from './components/Header';
import { MessageItem } from './components/MessageItem';
import { EmptyState } from './components/EmptyState';
import { ChatInput } from './components/ChatInput';
import { RoutineBuilderModal } from './components/RoutineBuilderModal';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { SavedRoutinesModal } from './components/SavedRoutinesModal';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('sportroutine_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [savedRoutines, setSavedRoutines] = useState<SavedRoutine[]>(() => {
    try {
      const saved = localStorage.getItem('sportroutine_saved_routines');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<SavedRoutine | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sportroutine_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  }, [messages]);

  // Sync saved routines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sportroutine_saved_routines', JSON.stringify(savedRoutines));
    } catch (e) {
      console.error('Error saving routines:', e);
    }
  }, [savedRoutines]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInput('');

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Falha ao obter resposta do assistente.');
      }

      const promptTokens = data.usageMetadata?.promptTokenCount || 0;
      const outputTokens = data.usageMetadata?.candidatesTokenCount || 0;
      const totalTokens = data.usageMetadata?.totalTokenCount || (promptTokens + outputTokens);
      // Cost calculation formula: (tokens_input / 1_000_000) * 0.10 + (tokens_output / 1_000_000) * 0.40
      const costEstimate = (promptTokens / 1_000_000) * 0.10 + (outputTokens / 1_000_000) * 0.40;

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'Rotina processada com sucesso.',
        timestamp: Date.now(),
        usage: {
          promptTokens,
          outputTokens,
          totalTokens,
          model: data.model || 'gemini-2.5-flash',
          costEstimate,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error in chat interaction:', err);
      setErrorMsg(
        err?.message ||
          'Não foi possível conectar ao SportRoutine AI. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoutine = (routine: SavedRoutine) => {
    setSavedRoutines((prev) => {
      // Check if already exists
      const existing = prev.find((r) => r.id === routine.id || r.title === routine.title);
      if (existing) return prev;
      return [routine, ...prev];
    });
  };

  const handleDeleteRoutine = (id: string) => {
    setSavedRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem('sportroutine_chat_history');
    setErrorMsg(null);
    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0D0F] text-[#F2F3F4] font-['Inter',sans-serif]">
      {/* Top Header */}
      <Header
        onNewChat={handleNewChat}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        savedCount={savedRoutines.length}
        isGenerating={isLoading}
      />

      {/* Main Chat Scroll Container */}
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <EmptyState
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onOpenWizard={() => setIsWizardOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  onSaveRoutine={handleSaveRoutine}
                  onStartWorkout={(routine) => setActiveWorkoutRoutine(routine)}
                  isSaved={savedRoutines.some((r) => r.title === msg.content.slice(0, 30))}
                />
              ))}

              {/* Typing animation bubble */}
              {isLoading && (
                <div className="flex gap-3 items-start my-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C6FF3D] text-[#0B0D0F] flex items-center justify-center font-['Space_Grotesk'] font-bold text-xs shadow-sm">
                    SR
                  </div>
                  <div className="bg-[#14171B] border border-[#262B31] rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#8A9099] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#8A9099] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#8A9099] animate-bounce" />
                  </div>
                </div>
              )}

              {/* Error banner */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Input bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* Modals & Dialogs */}
      <RoutineBuilderModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={(prompt) => handleSendMessage(prompt)}
      />

      <SavedRoutinesModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedRoutines={savedRoutines}
        onDeleteRoutine={handleDeleteRoutine}
        onStartWorkout={(routine) => setActiveWorkoutRoutine(routine)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      <ActiveWorkoutModal
        isOpen={!!activeWorkoutRoutine}
        routine={activeWorkoutRoutine}
        onClose={() => setActiveWorkoutRoutine(null)}
      />
    </div>
  );
}
