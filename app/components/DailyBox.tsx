'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractionProps {
  onComplete: (data: any) => void;
}

// 滑动条类型
const SliderInteraction = ({ onComplete }: InteractionProps) => {
  const sliders = [
    {
      id: 'weather',
      label: '内心天气',
      left: '大雨',
      right: '艳阳',
      icon: ['🌧️', '☀️']
    },
    {
      id: 'battery',
      label: '内心电量',
      left: '0%',
      right: '100%',
      icon: ['🔋', '⚡']
    }
  ];

  const currentSlider = sliders[Math.floor(Math.random() * sliders.length)];
  const [value, setValue] = useState(50);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h3 className="text-2xl font-light text-stone-700 mb-8">
        {currentSlider.label}
      </h3>
      <div className="mb-6">
        <span className="text-4xl mr-4">{currentSlider.icon[0]}</span>
        <span className="text-4xl">{currentSlider.icon[1]}</span>
      </div>
      <div className="relative mb-6 max-w-md mx-auto">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-blue-200 to-amber-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #e0e7ff 0%, #fef3c7 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-stone-500 mt-2">
          <span>{currentSlider.left}</span>
          <span className="font-medium">{value}%</span>
          <span>{currentSlider.right}</span>
        </div>
      </div>
      <button
        onClick={() => onComplete({ type: 'slider', id: currentSlider.id, value })}
        className="px-6 py-2 bg-gradient-to-r from-stone-600 to-stone-700 text-white rounded-full hover:shadow-lg transition-all"
      >
        确认
      </button>
    </motion.div>
  );
};

// 二选一类型
const ChoiceInteraction = ({ onComplete }: InteractionProps) => {
  const choices = [
    {
      id: 'space',
      left: { text: '想躲在被窝听雨', emoji: '🏠', value: 'indoor' },
      right: { text: '想在旷野奔跑', emoji: '🏃', value: 'outdoor' }
    },
    {
      id: 'social',
      left: { text: '想一个人静静', emoji: '🧘', value: 'alone' },
      right: { text: '想和朋友分享', emoji: '👥', value: 'social' }
    }
  ];

  const currentChoice = choices[Math.floor(Math.random() * choices.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h3 className="text-xl font-light text-stone-700 mb-8">
        今天的感觉是...
      </h3>
      <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete({ type: 'choice', id: currentChoice.id, choice: currentChoice.left.value })}
          className="p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 cursor-pointer shadow-lg hover:shadow-xl transition-all"
        >
          <div className="text-6xl mb-4">{currentChoice.left.emoji}</div>
          <p className="text-stone-700">{currentChoice.left.text}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete({ type: 'choice', id: currentChoice.id, choice: currentChoice.right.value })}
          className="p-8 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 cursor-pointer shadow-lg hover:shadow-xl transition-all"
        >
          <div className="text-6xl mb-4">{currentChoice.right.emoji}</div>
          <p className="text-stone-700">{currentChoice.right.text}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// 五感盲盒类型
const SensesInteraction = ({ onComplete }: InteractionProps) => {
  const senses = [
{
      type: 'smell',
      question: '如果现在有一种味道，你希望是：',
      options: [
        { text: '苦橙', emoji: '🍊', value: 'orange' },
        { text: '泥土', emoji: '🌱', value: 'earth' },
        { text: '肉桂', emoji: '🥖', value: 'cinnamon' },
        { text: '海盐', emoji: '🌊', value: 'salt' }
      ]
    },
    {
      type: 'touch',
      question: '想触碰的质感：',
      options: [
        { text: '柔软羊毛', emoji: '🧶', value: 'wool' },
        { text: '光滑木头', emoji: '🪵', value: 'wood' },
        { text: '冰凉金属', emoji: '🔩', value: 'metal' },
        { text: '温暖陶瓷', emoji: '🏺', value: 'ceramic' }
      ]
    }
  ];

  const currentSense = senses[Math.floor(Math.random() * senses.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h3 className="text-xl font-light text-stone-700 mb-6">
        {currentSense.question}
      </h3>
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {currentSense.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete({
              type: 'senses',
              sense: currentSense.type,
              choice: option.value
            })}
            className="p-6 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-2">{option.emoji}</div>
            <p className="text-stone-600">{option.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function DailyBox({ onComplete }: { onComplete: (data: any) => void }) {
  const [interactionType, setInteractionType] = useState<'slider' | 'choice' | 'senses' | null>(null);

  useEffect(() => {
    const types: ('slider' | 'choice' | 'senses')[] = ['slider', 'choice', 'senses'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setInteractionType(randomType);
  }, []);

  const handleComplete = (data: any) => {
    onComplete(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-light text-stone-700 mb-2">今日觉察</h2>
        <p className="text-stone-500">花一分钟，感受一下此刻的自己</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {interactionType === 'slider' && (
          <SliderInteraction key="slider" onComplete={handleComplete} />
        )}
        {interactionType === 'choice' && (
          <ChoiceInteraction key="choice" onComplete={handleComplete} />
        )}
        {interactionType === 'senses' && (
          <SensesInteraction key="senses" onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {/* 装饰元素 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}