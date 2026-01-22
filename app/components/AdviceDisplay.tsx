'use client';

import { motion } from 'framer-motion';
import { AIAdvice } from '@/lib/storage';

export default function AdviceDisplay({ advice }: { advice: AIAdvice }) {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-light text-stone-600 text-center mb-8">
          今日觉察
        </h2>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100"
        >
          <div className="text-lg text-rose-700 mb-2">身体层</div>
          <p className="text-stone-700 leading-relaxed">{advice.physical}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100"
        >
          <div className="text-lg text-amber-700 mb-2">感官层</div>
          <p className="text-stone-700 leading-relaxed">{advice.sensory}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100"
        >
          <div className="text-lg text-sky-700 mb-2">意识层</div>
          <p className="text-stone-700 leading-relaxed">{advice.awareness}</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-stone-500 text-sm">
          明日此刻再来，会有新的发现
        </p>
      </motion.div>
    </div>
  );
}