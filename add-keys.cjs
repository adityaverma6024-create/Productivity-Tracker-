import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState } from '../types';
import { ArrowLeft, Play, Pause, Square, Plus, Check } from 'lucide-react';
import { t } from '../lib/i18n';
import { playSound, triggerHaptic } from '../lib/sound';

export default function FocusTimerScreen({ 
  state, 
  onCancel 
}: { 
  state: AppState, 
  onCancel: () => void 
}) {
  const theme = state.settings.theme;
  const lang = state.settings.language;
  const settings = state.settings;

  const [durationSecs, setDurationSecs] = useState<number>(25 * 60); // Default 25 mins
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    playSound('timerComplete', settings.sound); // Premium relaxing achievement sound
    triggerHaptic('success', settings.haptics);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStart = () => {
    if (durationSecs < 30 || durationSecs > 36000) return; // Min 30s, Max 10h
    playSound('open', settings.sound);
    triggerHaptic('medium', settings.haptics);
    setTimeLeft(durationSecs);
    setIsActive(true);
    setIsPaused(false);
    setIsCompleted(false);
  };

  const handlePauseResume = () => {
    playSound('click', settings.sound);
    triggerHaptic('light', settings.haptics);
    setIsPaused(!isPaused);
  };

  const handleEnd = () => {
    playSound('delete', settings.sound);
    triggerHaptic('medium', settings.haptics);
    setShowEndConfirm(true);
  };

  const confirmEnd = () => {
    playSound('click', settings.sound);
    triggerHaptic('light', settings.haptics);
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(durationSecs);
    setShowEndConfirm(false);
  };

  const handleHourglassClick = () => {
    if (!isActive) return;
    playSound('click', settings.sound);
    triggerHaptic('light', settings.haptics);
    setShowTime(true);
    if (timeTimeoutRef.current) clearTimeout(timeTimeoutRef.current);
    timeTimeoutRef.current = setTimeout(() => {
      setShowTime(false);
    }, 5000);
  };

  const handleBack = () => {
    playSound('click', settings.sound);
    triggerHaptic('light', settings.haptics);
    onCancel();
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = isActive ? ((durationSecs - timeLeft) / durationSecs) * 100 : 0;
  const sandTopHeight = isActive ? Math.max(0, (timeLeft / durationSecs) * 100) : 100;
  const sandBottomHeight = isActive ? Math.min(100, ((durationSecs - timeLeft) / durationSecs) * 100) : 0;

  const inputClass = `w-full px-5 py-4 rounded-2xl outline-none transition-all border text-center text-2xl font-medium ${
    theme === 'dark' 
      ? 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-white' 
      : theme === 'eyecare'
      ? 'bg-[#f4ecd8] border-[#e6d5b8] focus:border-[#cbb590] text-[#5c4d3c]'
      : theme === 'glass'
      ? 'bg-white/50 border-white/60 focus:border-white/80 text-neutral-800 shadow-sm'
      : 'bg-neutral-50 border-neutral-200 focus:border-neutral-400 focus:bg-white text-neutral-800'
  }`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen p-6 sm:p-12 max-w-3xl mx-auto pb-32 flex flex-col"
    >
      <button onClick={handleBack} className="flex items-center mb-8 opacity-70 hover:opacity-100 transition-opacity self-start">
        <ArrowLeft size={20} className="mr-2" /> {t(lang, 'back')}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {!isActive && !isCompleted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-center">{t(lang, 'timerSetup')}</h1>
            
            <div className="mb-8">
              <label className="block text-sm font-medium opacity-70 mb-4 text-center uppercase tracking-wider">{t(lang, 'duration')} (Minutes)</label>
              <div className="flex items-center justify-center gap-4">
                <button 
                  onClick={() => { playSound('click', settings.sound); triggerHaptic('light', settings.haptics); setDurationSecs(Math.max(30, durationSecs - 300)); }}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                >-</button>
                <input 
                  type="number" 
                  value={Math.floor(durationSecs / 60)}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 0;
                    setDurationSecs(Math.min(600, Math.max(0.5, val)) * 60);
                  }}
                  className={inputClass}
                  style={{ width: '120px' }}
                />
                <button 
                  onClick={() => { playSound('click', settings.sound); triggerHaptic('light', settings.haptics); setDurationSecs(Math.min(36000, durationSecs + 300)); }}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                >+</button>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center text-lg"
            >
              <Play size={20} className="mr-2 fill-current" /> {t(lang, 'startTimer')}
            </button>
          </motion.div>
        ) : isCompleted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full max-w-sm"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check size={64} className="text-emerald-500" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-medium mb-8">Focus Complete!</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => { playSound('click', settings.sound); triggerHaptic('light', settings.haptics); setIsCompleted(false); setTimeLeft(durationSecs); }}
                className="w-full py-4 bg-black/5 dark:bg-white/5 rounded-2xl font-medium hover:bg-black/10 transition-colors flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" /> {t(lang, 'addNewTimer')}
              </button>
              <button 
                onClick={handleBack}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
              >
                {t(lang, 'done')}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full max-w-sm"
          >
            {/* Timer Ring & Hourglass */}
            <div 
              className="relative w-64 h-64 mb-12 cursor-pointer"
              onClick={handleHourglassClick}
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="opacity-10"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  className="text-emerald-500 transition-all duration-1000 ease-linear"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showTime ? (
                    <motion.div 
                      key="time"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-4xl font-medium tabular-nums tracking-tight"
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="hourglass"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-24 h-32 flex flex-col items-center justify-between"
                    >
                      {/* Top Glass */}
                      <div className="w-24 h-14 border-4 border-current rounded-t-xl rounded-b-full relative overflow-hidden flex items-end justify-center">
                        <div 
                          className="w-full bg-emerald-500/80 transition-all duration-1000 ease-linear"
                          style={{ height: `${sandTopHeight}%` }}
                        />
                      </div>
                      
                      {/* Middle Neck */}
                      <div className="w-4 h-4 border-l-4 border-r-4 border-current relative">
                        {/* Flowing Sand */}
                        {!isPaused && timeLeft > 0 && (
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-emerald-500/80 animate-pulse" />
                        )}
                      </div>

                      {/* Bottom Glass */}
                      <div className="w-24 h-14 border-4 border-current rounded-b-xl rounded-t-full relative overflow-hidden flex items-start justify-center">
                        <div 
                          className="w-full bg-emerald-500/80 transition-all duration-1000 ease-linear absolute bottom-0"
                          style={{ height: `${sandBottomHeight}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={handlePauseResume}
                className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                {isPaused ? <Play size={24} className="fill-current ml-1" /> : <Pause size={24} className="fill-current" />}
              </button>
              <button 
                onClick={handleEnd}
                className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20 transition-colors"
              >
                <Square size={20} className="fill-current" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* End Confirm Popup */}
      <AnimatePresence>
        {showEndConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEndConfirm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl ${theme === 'dark' ? 'bg-neutral-800 text-white' : theme === 'eyecare' ? 'bg-[#fdf6e3] text-[#5c4d3c]' : theme === 'glass' ? 'bg-white/70 backdrop-blur-xl border border-white/80 text-neutral-800 shadow-2xl shadow-black/10' : 'bg-white text-neutral-800'}`}>
              <h2 className="text-xl font-medium mb-4 text-rose-500">{t(lang, 'endTimerConfirm')}</h2>
              <div className="flex gap-3 mt-8">
                <button onClick={() => { playSound('click', settings.sound); triggerHaptic('light', settings.haptics); setShowEndConfirm(false); }} className="flex-1 py-3 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors">{t(lang, 'noResume')}</button>
                <button onClick={confirmEnd} className="flex-1 py-3 rounded-xl font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors">{t(lang, 'yesEnd')}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
