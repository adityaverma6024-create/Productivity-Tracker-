/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SetupScreen from './components/SetupScreen';
import HomeScreen from './components/HomeScreen';
import AccountScreen from './components/AccountScreen';
import SettingsScreen from './components/SettingsScreen';
import StudentZoneScreen from './components/StudentZoneScreen';
import FocusTimerScreen from './components/FocusTimerScreen';
import { AppState, DayData, Task, UserProfile, AppSettings, Exam } from './types';

const defaultSettings: AppSettings = {
  theme: 'light',
  iconShape: 'round',
  iconSize: 'medium',
  hdrMode: false,
  language: 'en',
  sound: true,
  haptics: true,
};

const defaultProfile: UserProfile = {
  avatar: '👤',
  name: '',
  gender: '',
  email: '',
};

const loadState = (): AppState | null => {
  try {
    const saved = localStorage.getItem('challengeAppState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.settings) {
        parsed.settings = { ...defaultSettings, ...parsed.settings };
      } else {
        parsed.settings = defaultSettings;
      }
      if (!parsed.profile) parsed.profile = { ...defaultProfile, name: parsed.name };
      if (!parsed.exams) parsed.exams = [];
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return null;
};

const saveState = (state: AppState) => {
  localStorage.setItem('challengeAppState', JSON.stringify(state));
};

export default function App() {
  const [state, setState] = useState<AppState | null>(loadState);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'account' | 'settings' | 'studentZone' | 'focusTimer'>('home');

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const handleSetupComplete = (name: string, totalDays: number, startDate: Date, settings: AppSettings) => {
    const days: DayData[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push({
        id: `day-${i + 1}`,
        dayIndex: i + 1,
        date: date.toISOString(),
        tasks: []
      });
    }
    setState({
      isSetupComplete: true,
      name,
      totalDays,
      startDate: startDate.toISOString(),
      days,
      profile: { ...defaultProfile, name },
      settings,
      exams: [],
    });
  };

  const updateDayTasks = (dayId: string, tasks: Task[]) => {
    if (!state) return;
    setState({
      ...state,
      days: state.days.map(d => d.id === dayId ? { ...d, tasks } : d)
    });
  };

  const extendChallenge = (extraDays: number) => {
    if (!state) return;
    const newTotal = Math.min(365, state.totalDays + extraDays);
    const daysToAdd = newTotal - state.totalDays;
    if (daysToAdd <= 0) return;

    const newDays = [...state.days];
    const lastDateStr = state.days[state.days.length - 1].date;
    const lastDate = new Date(lastDateStr);

    for (let i = 0; i < daysToAdd; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i + 1);
      const dayIndex = state.totalDays + i + 1;
      newDays.push({
        id: `day-${dayIndex}`,
        dayIndex,
        date: date.toISOString(),
        tasks: []
      });
    }

    setState({
      ...state,
      totalDays: newTotal,
      days: newDays
    });
  };

  const startFresh = () => {
    localStorage.removeItem('challengeAppState');
    setState(null);
    setCurrentScreen('home');
  };

  const updateProfile = (profile: UserProfile) => {
    if (!state) return;
    setState({ ...state, profile });
    setCurrentScreen('home');
  };

  const updateSettings = (settings: AppSettings) => {
    if (!state) return;
    setState({ ...state, settings });
    setCurrentScreen('home');
  };

  if (!state || !state.isSetupComplete) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  let themeClasses = 'bg-[#fafafa] text-neutral-800';
  if (state.settings.theme === 'dark') themeClasses = 'bg-neutral-900 text-white';
  if (state.settings.theme === 'eyecare') themeClasses = 'bg-[#fdf6e3] text-[#5c4d3c]';
  if (state.settings.theme === 'grayscale') themeClasses = 'bg-[#f0f0f0] text-[#222222] grayscale';
  if (state.settings.theme === 'glass') themeClasses = 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-neutral-800';

  const handleUpdateExams = (exams: Exam[]) => {
    if (!state) return;
    setState({ ...state, exams });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses}`}>
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
            <HomeScreen 
              state={state} 
              onUpdateTasks={updateDayTasks} 
              onNavigate={setCurrentScreen}
              onExtend={extendChallenge}
              onStartFresh={startFresh}
            />
          </motion.div>
        )}
        {currentScreen === 'account' && (
          <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
            <AccountScreen profile={state.profile} onSave={updateProfile} onCancel={() => setCurrentScreen('home')} settings={state.settings} />
          </motion.div>
        )}
        {currentScreen === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
            <SettingsScreen settings={state.settings} onSave={updateSettings} onCancel={() => setCurrentScreen('home')} theme={state.settings.theme} />
          </motion.div>
        )}
        {currentScreen === 'studentZone' && (
          <motion.div key="studentZone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
            <StudentZoneScreen 
              state={state} 
              onUpdateTasks={updateDayTasks}
              onUpdateExams={handleUpdateExams}
              onCancel={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}
        {currentScreen === 'focusTimer' && (
          <motion.div key="focusTimer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}>
            <FocusTimerScreen 
              state={state} 
              onCancel={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
