import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Sparkles,
  Send,
  Heart,
  Wind,
  BookOpen,
  LifeBuoy,
  RefreshCw,
  ShieldCheck,
  Smile,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

export const EchoChatView: React.FC = () => {
  const {
    user,
    chatMessages,
    isEchoTyping,
    sendMessageToEcho,
    setIsBreathingOpen,
    setActiveTab,
    moodStats,
  } = useApp();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'College deadline stress', prompt: "I'm feeling really stressed about upcoming project deadlines and exam submissions." },
    { label: 'Guide me to breathe', prompt: 'Can you guide me through a calming breathing exercise to reset my racing mind?' },
    { label: 'Journal prompt for tonight', prompt: 'Could you give me a gentle journaling prompt to help me reflect on my day?' },
    { label: 'Help me reframe a negative thought', prompt: 'I feel like I am falling behind everyone else in my class. How can I reframe this?' },
    { label: 'Late night overthinking', prompt: "I can't sleep because thoughts about the future keep spinning in my head." },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isEchoTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isEchoTyping) return;
    const msg = input.trim();
    setInput('');
    await sendMessageToEcho(msg);
  };

  const handlePromptClick = async (promptText: string) => {
    if (isEchoTyping) return;
    await sendMessageToEcho(promptText);
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'breathe') {
      setIsBreathingOpen(true);
    } else if (action.actionType === 'journal') {
      setActiveTab('journal');
    } else if (action.actionType === 'quiz') {
      setActiveTab('quizzes');
    } else if (action.actionType === 'support') {
      setActiveTab('support');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-pink-100/80 via-rose-50/80 to-purple-100/70 dark:from-stone-900 dark:via-stone-900 dark:to-stone-850 border border-pink-200/70 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-800 shadow-xs flex items-center justify-center text-2xl border border-pink-100 dark:border-stone-700 animate-breath">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
                Echo Companion
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Always Listening
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Empathetic, reflective AI support grounded in your recent mood history ({moodStats.latestMood ? `${moodStats.latestMood.mood} tone` : 'Calm'}).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBreathingOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 border border-stone-200 dark:border-stone-700 text-xs font-semibold shadow-xs"
        >
          <Wind className="w-3.5 h-3.5 text-pink-500" />
          <span>Start 4-4-4-4 Breathing</span>
        </button>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col h-[600px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isUser
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      : 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300'
                  }`}
                >
                  {isUser ? user?.avatar || '👤' : '🌸'}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1.5">
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-xs shadow-xs'
                        : 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 rounded-tl-xs border border-stone-200/60 dark:border-stone-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Optional Action Recommendation */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900 text-[11px] font-semibold transition-all shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-pink-500" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  )}

                  <span className={`text-[10px] text-stone-400 block px-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isEchoTyping && (
            <div className="flex gap-3 max-w-sm mr-auto items-center animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/60 flex items-center justify-center text-xs">
                🌸
              </div>
              <div className="px-4 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Echo is gently thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850/50 overflow-x-auto flex gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(qp.prompt)}
              disabled={isEchoTyping}
              className="px-3 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 hover:border-pink-300 hover:text-pink-700 dark:hover:text-pink-300 whitespace-nowrap transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
          <input
            type="text"
            placeholder="Share your thoughts, worries, or feelings with Echo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isEchoTyping}
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="submit"
            disabled={!input.trim() || isEchoTyping}
            className="p-3 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-sm transition-all active:scale-95 disabled:opacity-40"
            aria-label="Send message to Echo"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Safety & Non-clinical Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Echo is an empathetic conversational companion for emotional wellness, not a therapist or doctor.</span>
        </div>
        <button
          onClick={() => setActiveTab('support')}
          className="text-pink-600 dark:text-pink-400 font-semibold hover:underline shrink-0 ml-2"
        >
          View Crisis Helplines
        </button>
      </div>
    </div>
  );
};
