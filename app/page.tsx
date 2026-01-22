'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Onboarding from '@/components/Onboarding';
import DailyBox from '@/components/DailyBox';
import AdviceDisplay from '@/components/AdviceDisplay';
import AmbientBackground from '@/components/AmbientBackground';
import { storage, AIAdvice } from '@/lib/storage';

enum AppState {
  Onboarding = 'onboarding',
  DailyInteraction = 'daily',
  Results = 'results',
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>(AppState.Onboarding);
  const [todayInteraction, setTodayInteraction] = useState<any>(null);
  const [todayAdvice, setTodayAdvice] = useState<AIAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    const preferences = storage.getUserPreferences();

    if (!preferences) {
      setAppState(AppState.Onboarding);
      return;
    }

    const todayRecord = storage.getTodayRecord();
    if (todayRecord) {
      setAppState(AppState.Results);
      setTodayInteraction(todayRecord.data);
      setTodayAdvice({
        physical: localStorage.getItem('last_physical') || '',
        sensory: localStorage.getItem('last_sensory') || '',
        awareness: localStorage.getItem('last_awareness') || '',
        timestamp: new Date().toISOString()
      });
    } else {
      setAppState(AppState.DailyInteraction);
    }
  };

  const handleOnboardingComplete = () => {
    setAppState(AppState.DailyInteraction);
  };

  const handleDailyInteractionComplete = async (data: any) => {
    setIsLoading(true);
    setTodayInteraction(data);

    // 保存今日交互数据
    storage.saveDailyRecord({
      date: new Date().toISOString().split('T')[0],
      interactionType: data.type,
      data: data,
      timestamp: new Date().toISOString()
    });

    // 获取AI建议
    try {
      const preferences = storage.getUserPreferences();
      const timeOfDay = getTimeOfDay();

      // 生成不同的seed以获得多样化输出
      const seed = Math.floor(Math.random() * 1000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userItems: preferences?.items || [],
          dailyInteraction: data,
          timeOfDay,
          seed
        })
      });

      if (response.ok) {
        const advice = await response.json();
        setTodayAdvice(advice);

        // 保存建议到本地存储（用于回显）
        localStorage.setItem('last_physical', advice.physical);
        localStorage.setItem('last_sensory', advice.sensory);
        localStorage.setItem('last_awareness', advice.awareness);
      }
    } catch (error) {
      console.error('Failed to generate advice:', error);
      // 使用备用建议
      setTodayAdvice(generateFallbackAdvice());
    }

    storage.saveLastCheckIn(new Date().toISOString().split('T')[0]);
    setIsLoading(false);
    setAppState(AppState.Results);
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const generateFallbackAdvice = (): AIAdvice => {
    return {
      physical: "摸摸左手的指尖，像第一次发现它那样。",
      sensory: "空气里有没有一丝熟悉的味道，悄悄记住它。",
      awareness: "此刻的呼吸，比昨天的更深了一点。",
      timestamp: new Date().toISOString()
    };
  };

  const resetDay = () => {
    const today = new Date().toISOString().split('T')[0];
    const records = storage.getDailyRecords().filter(r => r.date !== today);
    localStorage.setItem('daily_records', JSON.stringify(records));
    localStorage.removeItem('last_check_in');
    initializeApp();
  };

  return (
    <main className="min-h-screen relative">
      <AmbientBackground interactionData={todayInteraction} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 头部导航 */}
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-light text-stone-600">爱你老己</h1>
          <button
            onClick={resetDay}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            重置今日
          </button>
        </header>

        {/* 主要内容 */}
        <div className="flex-1 flex items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {appState === AppState.Onboarding && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Onboarding onComplete={handleOnboardingComplete} />
              </motion.div>
            )}

            {appState === AppState.DailyInteraction && (
              <motion.div
                key="daily"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl"
              >
                <DailyBox onComplete={handleDailyInteractionComplete} />
              </motion.div>
            )}

            {appState === AppState.Results && todayAdvice && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl"
              >
                {isLoading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600 mx-auto mb-4"></div>
                    <p className="text-stone-600">正在生成今日觉察...</p>
                  </div>
                ) : (
                  <AdviceDisplay advice={todayAdvice} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部装饰 */}
        <footer className="p-6 text-center text-stone-400 text-sm">
          <p>明天的你，会有新的发现</p>
        </footer>
      </div>
    </main>
  );
}