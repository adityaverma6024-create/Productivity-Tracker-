import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DayData, AppSettings } from '../types';
import { t } from '../lib/i18n';
import { playSound, triggerHaptic } from '../lib/sound';

export default function DayCircle({ day, isInteractive, settings, onLongPress }: { day: DayData, isInteractive: boolean, settings: AppSettings, onLongPress: () => void }) {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [status, setStatus] = useState<'DEFAULT' | 'COMPLETED' | 'MISSED'>('DEFAULT');
  const [progress, setProgress] = useState(0);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const calculateState = () => {
      const now = new Date();
      const dayDate = new Date(day.date);
      
      const startOfDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0);
      const endOfDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 23, 59, 59);

      const totalTasks = day.tasks.length;
      const completedTasks = day.tasks.filter(t => t.completed).length;
      const currentProgress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
      setProgress(currentProgress);

      const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;

      if (isAllCompleted) {
        setStatus('COMPLETED');
      } else if (now > endOfDay) {
        setStatus('MISSED');
      } else {
        setStatus('DEFAULT');
      }

      // Timer logic
      if (now >= startOfDay && now <= endOfDay) {
        const diff = endOfDay.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else if (now < startOfDay) {
        setTimeLeft('24:00:00');
      } else {
        setTimeLeft('00:00:00');
      }
    };

    calculateState();
    const interval = setInterval(calculateState, 1000);
    return () => clearInterval(interval);
  }, [day]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    if (!isInteractive) return;
    pressTimer.current = setTimeout(() => {
      playSound('open', settings.sound);
      triggerHaptic('medium', settings.haptics);
      onLongPress();
      pressTimer.current = null;
    }, 600);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (isCompleted) {
      playSound('click', settings.sound);
      triggerHaptic('light', settings.haptics);
      setShowTimerPopup(!showTimerPopup);
    } else if (!isInteractive) {
      // Small bounce handled by whileTap, but we can add a tiny haptic
      triggerHaptic('light', settings.haptics);
    }
  };

  const isCompleted = status === 'COMPLETED';
  const isMissed = status === 'MISSED';

  const d = new Date(day.date);
  const dateString = new Intl.DateTimeFormat(settings.language, { month: 'short', day: 'numeric' }).format(d);

  // Apply settings
  let shapeClass = 'rounded-full';
  if (settings.iconShape === 'square') shapeClass = 'rounded-2xl';
  if (settings.iconShape === 'rectangle') shapeClass = 'rounded-2xl aspect-[4/3] w-auto h-auto px-8 py-6';
  if (settings.iconShape === 'ellipse') shapeClass = 'rounded-[50%] aspect-[4/3] w-auto h-auto px-8 py-6';

  let sizeClass = 'w-32 h-32 sm:w-36 sm:h-36';
  if (settings.iconSize === 'small') sizeClass = 'w-24 h-24 sm:w-28 sm:h-28';
  if (settings.iconSize === 'large') sizeClass = 'w-40 h-40 sm:w-44 sm:h-44';

  if (settings.iconShape === 'rectangle' || settings.iconShape === 'ellipse') {
    if (settings.iconSize === 'small') sizeClass = 'w-32 h-24 sm:w-36 sm:h-28';
    if (settings.iconSize === 'medium') sizeClass = 'w-40 h-32 sm:w-48 sm:h-36';
    if (settings.iconSize === 'large') sizeClass = 'w-48 h-40 sm:w-56 sm:h-44';
  }

  const durationClass = settings.hdrMode ? 'duration-[800ms] ease-out' : 'duration-500 ease-in-out';
  
  let bgClass = '';
  if (!isInteractive) {
    bgClass = settings.theme === 'dark' ? 'bg-neutral-800/40 border border-neutral-800' : 'bg-neutral-100/40 border border-neutral-200/50';
  } else if (isCompleted) {
    bgClass = `bg-gradient-to-br from-emerald-300 to-emerald-400 ${settings.hdrMode ? 'shadow-[0_0_80px_rgba(52,211,153,0.8)] border border-white/30 backdrop-blur-sm' : 'shadow-[0_0_40px_rgba(52,211,153,0.4)]'}`;
  } else if (isMissed) {
    bgClass = `bg-gradient-to-br from-rose-300 to-rose-400 ${settings.hdrMode ? 'shadow-[0_0_80px_rgba(251,113,133,0.8)] border border-white/30 backdrop-blur-sm' : 'shadow-[0_0_30px_rgba(251,113,133,0.2)]'}`;
  } else {
    bgClass = settings.theme === 'dark' 
      ? `bg-gradient-to-b from-neutral-800 to-neutral-800/80 border border-neutral-700 ${settings.hdrMode ? 'shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'shadow-sm group-hover:shadow-md'}`
      : settings.theme === 'eyecare'
      ? `bg-gradient-to-b from-[#fdf6e3] to-[#f4ecd8] border border-[#e6d5b8] ${settings.hdrMode ? 'shadow-[0_10px_30px_rgba(92,77,60,0.15)]' : 'shadow-sm group-hover:shadow-md'}`
      : `bg-gradient-to-b from-white to-neutral-50/80 border border-neutral-100 ${settings.hdrMode ? 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : 'shadow-sm group-hover:shadow-md'}`;
  }

  return (
    <motion.div 
      className={`relative ${sizeClass} ${shapeClass} cursor-pointer select-none touch-none group flex items-center justify-center`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      whileHover={isInteractive ? { y: -4, filter: settings.hdrMode ? 'brightness(1.1) contrast(1.05)' : 'brightness(1.05)' } : {}}
      whileTap={isInteractive ? { scale: 0.92 } : { scale: 0.95, y: -2 }}
      transition={{ duration: settings.hdrMode ? 0.3 : 0.2, type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Timer Popup */}
      <AnimatePresence>
        {isCompleted && showTimerPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs font-mono px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
          >
            {timeLeft}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className={`absolute inset-0 ${shapeClass} transition-all ${durationClass} ${bgClass}`} />

      {/* Universal Progress Ring for all shapes */}
      {!isCompleted && !isMissed && isInteractive && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'rotate(-90deg)' }}>
          <motion.rect 
            x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
            rx={settings.iconShape === 'round' || settings.iconShape === 'ellipse' ? "50%" : "16"} 
            fill="none" 
            stroke="#34d399" 
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
      )}

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10`}>
        {!isInteractive ? (
          <span className={`text-base font-medium tracking-tight ${settings.theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {t(settings.language, 'day')} {day.dayIndex}
          </span>
        ) : isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -6, 0] }}
            transition={{ 
              scale: { type: "spring", bounce: 0.6 },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-4xl drop-shadow-lg"
            style={{ filter: settings.hdrMode ? 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' : 'drop-shadow(0 0 5px rgba(0,0,0,0.1))' }}
          >
            🏆
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="flex flex-col items-center"
            >
              <span className={`text-base font-medium tracking-tight ${isMissed ? 'text-white' : settings.theme === 'dark' ? 'text-neutral-200' : 'text-neutral-700'}`}>
                {t(settings.language, 'day')} {day.dayIndex}
              </span>
              <span className={`text-xs mt-0.5 ${isMissed ? 'text-white/80' : settings.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {dateString}
              </span>
            </motion.div>

            <motion.span 
              className={`text-sm font-mono tracking-tight mt-1.5 ${isMissed ? 'text-white/90' : settings.theme === 'dark' ? 'text-neutral-400' : 'text-neutral-400'}`}
            >
              {timeLeft}
            </motion.span>
          </>
        )}
      </div>
    </motion.div>
  );
}
