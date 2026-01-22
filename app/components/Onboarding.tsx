'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, UserPreferences } from '@/lib/storage';

const items = [
  { id: 'lantern', name: '小油灯', icon: '🏮', description: '渴望指引', color: 'from-amber-200 to-orange-300' },
  { id: 'radio', name: '老式收音机', icon: '📻', description: '怀旧声音', color: 'from-rose-200 to-pink-300' },
  { id: 'pillow', name: '柔软枕头', icon: '🛏️', description: '极度疲惫', color: 'from-blue-200 to-indigo-300' },
  { id: 'telescope', name: '望远镜', icon: '🔭', description: '探索欲', color: 'from-purple-200 to-violet-300' },
  { id: 'flower', name: '小花盆', icon: '🌱', description: '生命力', color: 'from-green-200 to-emerald-300' },
  { id: 'journal', name: '手账本', icon: '📓', description: '秩序感', color: 'from-stone-200 to-gray-300' },
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleComplete = () => {
    if (selectedItems.length === 3) {
      const preferences: UserPreferences = {
        items: selectedItems,
        timestamp: new Date().toISOString()
      };
      storage.saveUserPreferences(preferences);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center mb-12"
      >
        <h1 className="text-4xl font-light text-stone-700 mb-4">
          欢迎来到你的星球
        </h1>
        <p className="text-lg text-stone-500">
          带上 3 件东西，开始这段旅程
        </p>
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-3xl">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: items.indexOf(item) * 0.1 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                relative p-8 rounded-2xl cursor-pointer transition-all duration-300
                bg-gradient-to-br ${item.color} shadow-lg
                ${selectedItems.includes(item.id)
                  ? 'ring-4 ring-white/50 shadow-2xl scale-105'
                  : 'hover:shadow-xl'
                }
              `}
            >
              <div className="text-6xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-medium text-stone-700">{item.name}</h3>
              <p className="text-sm text-stone-500 mt-1">{item.description}</p>

              <AnimatePresence>
                {hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedItems.length > 0 ? 1 : 0 }}
        className="text-center"
      >
        <p className="text-stone-600 mb-4">
          已选择 {selectedItems.length}/3
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          disabled={selectedItems.length !== 3}
          className={`
            px-8 py-3 rounded-full font-medium transition-all duration-300
            ${selectedItems.length === 3
              ? 'bg-gradient-to-r from-stone-600 to-stone-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }
          `}
        >
          开始旅程
        </motion.button>
      </motion.div>

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}