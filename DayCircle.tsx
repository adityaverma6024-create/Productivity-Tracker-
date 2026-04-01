import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings } from '../types';
import { Check, ChevronRight, Trophy } from 'lucide-react';

import { t } from '../lib/i18n';

export default function SetupScreen({ onComplete }: { onComplete: (name: string, days: number, start: Date, settings: AppSettings) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [days, setDays] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'eyecare' | 'grayscale'>('light');
  const [iconShape, setIconShape] = useState<'round' | 'square' | 'rectangle' | 'ellipse'>('round');
  const [language, setLanguage] = useState('en');
  
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && days && startDate) {
      setStep(2);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  useEffect(() => {
    if (step === 3) {
      const startTime = Date.now();
      const duration = 5000;
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / duration) * 100, 100);
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(4), 200);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleBegin = () => {
    const d = new Date(startDate);
    const localDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    onComplete(name, Number(days), localDate, {
      theme,
      iconShape,
      iconSize: 'medium',
      hdrMode: true,
      language: 'en',
      sound: true,
      haptics: true
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 selection:bg-neutral-200 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 w-full max-w-md"
          >
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">{t(language, 'setupTitle')}</h1>
              <p className="text-neutral-400 text-sm mt-2">{t(language, 'setupStep1')}</p>
            </div>
            
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">{t(language, 'yourName')}</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 outline-none transition-all text-neutral-800 placeholder:text-neutral-400"
                  placeholder={t(language, 'enterName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">{t(language, 'numberOfDays')}</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max="365"
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 outline-none transition-all text-neutral-800 placeholder:text-neutral-400"
                  placeholder={t(language, 'eg30')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">{t(language, 'startDate')}</label>
                <input 
                  type="date" 
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 outline-none transition-all text-neutral-800"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-medium flex items-center justify-center transition-all mt-8 shadow-md shadow-neutral-900/10"
              >
                {t(language, 'next')} <ChevronRight size={18} className="ml-1" />
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 w-full max-w-md"
          >
            <div className="mb-10 text-center">
              <h1 className="text-2xl font-medium text-neutral-800 tracking-tight">{t(language, 'appearance')}</h1>
              <p className="text-neutral-400 text-sm mt-2">{t(language, 'setupStep2')}</p>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">{t(language, 'theme')}</label>
                <select 
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 outline-none transition-all text-neutral-800"
                >
                  <option value="light">{t(language, 'lightMode')}</option>
                  <option value="dark">{t(language, 'darkMode')}</option>
                  <option value="eyecare">{t(language, 'eyeCareMode')}</option>
                  <option value="grayscale">{t(language, 'grayscaleMode')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2 ml-1">{t(language, 'iconShape')}</label>
                <select 
                  value={iconShape}
                  onChange={e => setIconShape(e.target.value as any)}
                  className="w-full px-5 py-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 focus:bg-white focus:border-neutral-300 focus:ring-4 focus:ring-neutral-100 outline-none transition-all text-neutral-800"
                >
                  <option value="round">{t(language, 'round')}</option>
                  <option value="square">{t(language, 'square')}</option>
                  <option value="rectangle">{t(language, 'rectangle')}</option>
                  <option value="ellipse">{t(language, 'ellipse')}</option>
                </select>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-medium flex items-center justify-center transition-all mt-8 shadow-lg shadow-emerald-500/20"
              >
                {t(language, 'save')} <Check size={18} className="ml-2" />
              </motion.button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <motion.circle 
                  cx="50" cy="50" r="46" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (loadingProgress / 100) * 289}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-medium text-emerald-500">
                {Math.round(loadingProgress)}%
              </div>
            </div>
            <h2 className="text-xl font-medium text-neutral-800">{t(language, 'settingUp')}</h2>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
            className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(16,185,129,0.15)] border border-emerald-100 w-full max-w-md text-center relative overflow-hidden"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"
            />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
            >
              <Trophy size={36} strokeWidth={2} />
            </motion.div>
            
            <h1 className="text-2xl font-medium text-neutral-800 tracking-tight mb-2">{t(language, 'congratulations')}</h1>
            <p className="text-neutral-500 mb-10">{t(language, 'appReady')}</p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBegin}
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-2xl font-medium flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30 relative overflow-hidden group"
            >
              <motion.div 
                className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"
              />
              {t(language, 'beginJourney')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
