import { useState, useEffect, useRef } from 'react';
import { AppState, DayData, Task } from '../types';
import DayCircle from './DayCircle';
import TodoModal from './TodoModal';
import UserGuideScreen from './UserGuideScreen';
import { User, Settings, RefreshCw, Plus, Minus, UserCircle, BookOpen, GraduationCap, Timer } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { t } from '../lib/i18n';
import { playSound, triggerHaptic } from '../lib/sound';

export default function HomeScreen({ 
  state, 
  onUpdateTasks, 
  onNavigate,
  onExtend,
  onStartFresh
}: { 
  state: AppState, 
  onUpdateTasks: (dayId: string, tasks: Task[]) => void,
  onNavigate: (screen: 'account' | 'settings' | 'studentZone' | 'focusTimer') => void,
  onExtend: (days: number) => void,
  onStartFresh: () => void
}) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [extendDays, setExtendDays] = useState<number>(1);
  const [showFreshConfirm, setShowFreshConfirm] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedDay = state.days.find(d => d.id === selectedDayId) || null;
  const lang = state.settings.language;
  const hasPassedExams = state.exams?.some(e => new Date(e.date) < new Date() && e.status === 'upcoming');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleExtend = () => {
    if (extendDays > 0) {
      playSound('save', state.settings.sound);
      triggerHaptic('success', state.settings.haptics);
      onExtend(extendDays);
      setShowExtend(false);
      setExtendDays(1);
    }
  };

  const handleMenuClick = (action: () => void) => {
    playSound('click', state.settings.sound);
    triggerHaptic('light', state.settings.haptics);
    setShowMenu(false);
    action();
  };

  return (
    <div className="p-6 sm:p-12 pb-32 relative selection:bg-neutral-200 min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-6 sm:gap-10"
        >
          {state.days.map((day, index) => {
            const previousDay = index > 0 ? state.days[index - 1] : null;
            const prevCompleted = previousDay ? previousDay.tasks.length > 0 && previousDay.tasks.every(t => t.completed) : true;
            const now = new Date();
            const dayDate = new Date(day.date);
            const startOfDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0);
            
            const isInteractive = now >= startOfDay || prevCompleted;

            return (
              <motion.div
                key={day.id}
                variants={{
                  hidden: { opacity: 0, scale: 0, y: 20 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
                }}
              >
                <DayCircle 
                  day={day} 
                  isInteractive={isInteractive}
                  settings={state.settings}
                  onLongPress={() => { if (isInteractive) setSelectedDayId(day.id); }} 
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Dim Background when Menu Open */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-30"
          />
        )}
      </AnimatePresence>

      {/* Profile Icon */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end" ref={menuRef}>
        <AnimatePresence>
          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`mb-4 rounded-2xl shadow-xl border overflow-hidden flex flex-col w-56 ${
                state.settings.theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 
                state.settings.theme === 'eyecare' ? 'bg-[#f4ecd8] border-[#e6d5b8] text-[#5c4d3c]' :
                state.settings.theme === 'glass' ? 'bg-white/70 backdrop-blur-xl border-white/80 text-neutral-800 shadow-2xl shadow-black/10' :
                'bg-white border-neutral-100 text-neutral-800'
              }`}
            >
              <button onClick={() => handleMenuClick(() => onNavigate('account'))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left">
                <UserCircle size={16} className="mr-3" /> {t(lang, 'account')}
              </button>
              <button onClick={() => handleMenuClick(() => onNavigate('studentZone'))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5 relative">
                <GraduationCap size={16} className="mr-3" /> {t(lang, 'studentZone')}
                {hasPassedExams && <div className="absolute right-4 w-2 h-2 rounded-full bg-rose-500" />}
              </button>
              <button onClick={() => handleMenuClick(() => onNavigate('focusTimer'))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5">
                <Timer size={16} className="mr-3" /> {t(lang, 'focusTimer')}
              </button>
              <button onClick={() => handleMenuClick(() => setShowExtend(true))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5">
                <Plus size={16} className="mr-3" /> {t(lang, 'extendChallenge')}
              </button>
              <button onClick={() => handleMenuClick(() => onNavigate('settings'))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5">
                <Settings size={16} className="mr-3" /> {t(lang, 'settings')}
              </button>
              <button onClick={() => handleMenuClick(() => setShowGuide(true))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5">
                <BookOpen size={16} className="mr-3" /> {t(lang, 'userGuide')}
              </button>
              <button onClick={() => handleMenuClick(() => setShowFreshConfirm(true))} className="flex items-center px-4 py-3 hover:bg-black/5 transition-colors text-sm font-medium text-left border-t border-black/5 text-rose-500">
                <RefreshCw size={16} className="mr-3" /> {t(lang, 'startFresh')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('toggle', state.settings.sound);
            triggerHaptic('light', state.settings.haptics);
            setShowMenu(!showMenu);
          }}
          className={`relative w-14 h-14 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] border flex items-center justify-center transition-all ${
            state.settings.theme === 'dark' ? 'bg-neutral-800 border-neutral-700 text-white' : 
            state.settings.theme === 'eyecare' ? 'bg-[#f4ecd8] border-[#e6d5b8] text-[#5c4d3c]' :
            state.settings.theme === 'glass' ? 'bg-white/60 backdrop-blur-md border-white/80 text-neutral-600 shadow-lg shadow-black/5' :
            'bg-white border-neutral-100 text-neutral-600'
          }`}
        >
          {state.profile.avatar ? <span className="text-2xl">{state.profile.avatar}</span> : <User size={22} strokeWidth={2} />}
          {hasPassedExams && <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-rose-500 border-2 border-white dark:border-neutral-800" />}
        </motion.button>
      </div>

      {/* Extend Modal */}
      <AnimatePresence>
        {showExtend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExtend(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl ${state.settings.theme === 'dark' ? 'bg-neutral-800 text-white' : state.settings.theme === 'eyecare' ? 'bg-[#fdf6e3] text-[#5c4d3c]' : state.settings.theme === 'glass' ? 'bg-white/70 backdrop-blur-xl border border-white/80 text-neutral-800 shadow-2xl shadow-black/10' : 'bg-white text-neutral-800'}`}>
              <h2 className="text-xl font-medium mb-4">{t(lang, 'extendChallenge')}</h2>
              <p className="text-sm opacity-70 mb-6">{t(lang, 'extendDesc')}</p>
              
              <div className="flex items-center justify-between mb-8 bg-black/5 dark:bg-white/5 rounded-2xl p-2">
                <button 
                  onClick={() => {
                    playSound('click', state.settings.sound);
                    triggerHaptic('light', state.settings.haptics);
                    setExtendDays(Math.max(1, extendDays - 1));
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-neutral-700 shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <Minus size={20} />
                </button>
                <div className="text-3xl font-medium w-20 text-center">{extendDays}</div>
                <button 
                  onClick={() => {
                    playSound('click', state.settings.sound);
                    triggerHaptic('light', state.settings.haptics);
                    setExtendDays(Math.min(365 - state.totalDays, extendDays + 1));
                  }}
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-neutral-700 shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => {
                  playSound('click', state.settings.sound);
                  triggerHaptic('light', state.settings.haptics);
                  setShowExtend(false);
                }} className="flex-1 py-3 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors">{t(lang, 'cancel')}</button>
                <button onClick={handleExtend} className="flex-1 py-3 rounded-xl font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">{t(lang, 'extend')}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Start Fresh Confirm */}
      <AnimatePresence>
        {showFreshConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFreshConfirm(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-sm rounded-[2rem] p-8 shadow-2xl ${state.settings.theme === 'dark' ? 'bg-neutral-800 text-white' : state.settings.theme === 'eyecare' ? 'bg-[#fdf6e3] text-[#5c4d3c]' : state.settings.theme === 'glass' ? 'bg-white/70 backdrop-blur-xl border border-white/80 text-neutral-800 shadow-2xl shadow-black/10' : 'bg-white text-neutral-800'}`}>
              <h2 className="text-xl font-medium mb-4 text-rose-500">{t(lang, 'startFreshConfirm')}</h2>
              <p className="text-sm opacity-70 mb-8">{t(lang, 'resetWarning')}</p>
              <div className="flex gap-3">
                <button onClick={() => {
                  playSound('click', state.settings.sound);
                  triggerHaptic('light', state.settings.haptics);
                  setShowFreshConfirm(false);
                }} className="flex-1 py-3 rounded-xl font-medium bg-black/5 hover:bg-black/10 transition-colors">{t(lang, 'cancel')}</button>
                <button onClick={() => { 
                  playSound('delete', state.settings.sound);
                  triggerHaptic('light', state.settings.haptics);
                  setShowFreshConfirm(false); 
                  onStartFresh(); 
                }} className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 transition-all shadow-lg shadow-rose-500/30">{t(lang, 'resetAll')}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGuide && (
          <UserGuideScreen 
            onClose={() => setShowGuide(false)} 
            theme={state.settings.theme} 
            language={lang}
            sound={state.settings.sound}
            haptics={state.settings.haptics}
          />
        )}
      </AnimatePresence>

      {/* Todo Modal */}
      <AnimatePresence>
        {selectedDay && (
          <TodoModal 
            day={selectedDay} 
            theme={state.settings.theme}
            settings={state.settings}
            onClose={() => setSelectedDayId(null)}
            onUpdateTasks={(tasks) => onUpdateTasks(selectedDay.id, tasks)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
