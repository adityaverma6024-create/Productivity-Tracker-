import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings } from '../types';
import { ArrowLeft, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { t } from '../lib/i18n';
import { playSound, triggerHaptic } from '../lib/sound';

export default function SettingsScreen({ settings, onSave, onCancel, theme }: { settings: AppSettings, onSave: (s: AppSettings) => void, onCancel: () => void, theme: string }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showExtraLangs, setShowExtraLangs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('save', localSettings.sound);
    triggerHaptic('success', localSettings.haptics);
    onSave(localSettings);
  };

  const handleBack = () => {
    playSound('click', localSettings.sound);
    triggerHaptic('light', localSettings.haptics);
    onCancel();
  };

  const handleOptionChange = (key: keyof AppSettings, value: any) => {
    playSound('click', localSettings.sound);
    triggerHaptic('light', localSettings.haptics);
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const OptionCard = ({ title, options, value, onChange }: any) => (
    <div className="mb-8">
      <label className="block text-sm font-medium opacity-70 mb-3 ml-1 uppercase tracking-wider">{title}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt: any) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative py-4 px-4 rounded-2xl border flex items-center justify-center transition-all ${
                isSelected 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800' : theme === 'glass' ? 'bg-white/50 border-white/60 hover:bg-white/70 shadow-sm' : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }`}
            >
              <span className="font-medium text-sm">{opt.label}</span>
              {isSelected && <Check size={14} className="absolute top-2 right-2 opacity-50" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const lang = localSettings.language;

  const extraLanguages = [
    { label: 'Sanskrit', value: 'sa' },
    { label: 'German', value: 'de' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'Russian', value: 'ru' },
    { label: 'Korean', value: 'ko' },
  ];

  const isExtraLangSelected = extraLanguages.some(l => l.value === localSettings.language);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen p-6 sm:p-12 max-w-3xl mx-auto pb-32"
    >
      <button onClick={handleBack} className="flex items-center mb-8 opacity-70 hover:opacity-100 transition-opacity">
        <ArrowLeft size={20} className="mr-2" /> {t(lang, 'cancel')}
      </button>

      <h1 className="text-3xl font-medium tracking-tight mb-2">{t(lang, 'settings')}</h1>
      <p className="opacity-60 mb-10 text-sm">{t(lang, 'settingsSubtitle')}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium opacity-70 mb-3 ml-1 uppercase tracking-wider">{t(lang, 'language')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleOptionChange('language', 'en')}
              className={`relative py-4 px-4 rounded-2xl border flex items-center justify-center transition-all ${
                localSettings.language === 'en' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800' : theme === 'glass' ? 'bg-white/50 border-white/60 hover:bg-white/70 shadow-sm' : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }`}
            >
              <span className="font-medium text-sm">English</span>
              {localSettings.language === 'en' && <Check size={14} className="absolute top-2 right-2 opacity-50" />}
            </button>
            <button
              type="button"
              onClick={() => handleOptionChange('language', 'hi')}
              className={`relative py-4 px-4 rounded-2xl border flex items-center justify-center transition-all ${
                localSettings.language === 'hi' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800' : theme === 'glass' ? 'bg-white/50 border-white/60 hover:bg-white/70 shadow-sm' : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }`}
            >
              <span className="font-medium text-sm">Hindi</span>
              {localSettings.language === 'hi' && <Check size={14} className="absolute top-2 right-2 opacity-50" />}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('click', localSettings.sound);
                triggerHaptic('light', localSettings.haptics);
                setShowExtraLangs(!showExtraLangs);
              }}
              className={`relative py-4 px-4 rounded-2xl border flex items-center justify-center transition-all ${
                isExtraLangSelected 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800' : theme === 'glass' ? 'bg-white/50 border-white/60 hover:bg-white/70 shadow-sm' : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }`}
            >
              <span className="font-medium text-sm flex items-center">Extra {showExtraLangs ? <ChevronDown size={16} className="ml-1" /> : <ChevronRight size={16} className="ml-1" />}</span>
              {isExtraLangSelected && <Check size={14} className="absolute top-2 right-2 opacity-50" />}
            </button>
          </div>
          
          <AnimatePresence>
            {showExtraLangs && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 overflow-hidden"
              >
                {extraLanguages.map(l => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => handleOptionChange('language', l.value)}
                    className={`relative py-3 px-4 rounded-xl border flex items-center justify-center transition-all ${
                      localSettings.language === l.value 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : theme === 'dark' ? 'border-neutral-700 hover:bg-neutral-800' : theme === 'glass' ? 'bg-white/50 border-white/60 hover:bg-white/70 shadow-sm' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <span className="font-medium text-sm">{l.label}</span>
                    {localSettings.language === l.value && <Check size={14} className="absolute top-2 right-2 opacity-50" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <OptionCard 
          title={t(lang, 'theme')}
          value={localSettings.theme}
          onChange={(v: any) => handleOptionChange('theme', v)}
          options={[
            { label: t(lang, 'lightMode'), value: 'light' },
            { label: t(lang, 'darkMode'), value: 'dark' },
            { label: t(lang, 'eyeCareMode'), value: 'eyecare' },
            { label: t(lang, 'grayscaleMode'), value: 'grayscale' },
            { label: t(lang, 'glassMode'), value: 'glass' },
          ]}
        />

        <OptionCard 
          title={t(lang, 'iconShape')}
          value={localSettings.iconShape}
          onChange={(v: any) => handleOptionChange('iconShape', v)}
          options={[
            { label: t(lang, 'round'), value: 'round' },
            { label: t(lang, 'square'), value: 'square' },
            { label: t(lang, 'rectangle'), value: 'rectangle' },
            { label: t(lang, 'ellipse'), value: 'ellipse' },
          ]}
        />

        <OptionCard 
          title={t(lang, 'iconSize')}
          value={localSettings.iconSize}
          onChange={(v: any) => handleOptionChange('iconSize', v)}
          options={[
            { label: t(lang, 'small'), value: 'small' },
            { label: t(lang, 'medium'), value: 'medium' },
            { label: t(lang, 'large'), value: 'large' },
          ]}
        />

        <div className="mb-12 space-y-4">
          <label className="block text-sm font-medium opacity-70 mb-3 ml-1 uppercase tracking-wider">{t(lang, 'advancedSystem')}</label>
          
          <button
            type="button"
            onClick={() => handleOptionChange('hdrMode', !localSettings.hdrMode)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : theme === 'glass' ? 'bg-white/50 border-white/60 shadow-sm' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="text-left">
              <div className="font-medium mb-1">{t(lang, 'hdrMode')}</div>
              <div className="text-sm opacity-60">{t(lang, 'hdrDesc')}</div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.hdrMode ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${localSettings.hdrMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleOptionChange('sound', !localSettings.sound)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : theme === 'glass' ? 'bg-white/50 border-white/60 shadow-sm' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="text-left">
              <div className="font-medium mb-1">{t(lang, 'sound')}</div>
              <div className="text-sm opacity-60">{t(lang, 'soundDesc')}</div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.sound ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${localSettings.sound ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleOptionChange('haptics', !localSettings.haptics)}
            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
              theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : theme === 'glass' ? 'bg-white/50 border-white/60 shadow-sm' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="text-left">
              <div className="font-medium mb-1">{t(lang, 'haptics')}</div>
              <div className="text-sm opacity-60">{t(lang, 'hapticsDesc')}</div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${localSettings.haptics ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${localSettings.haptics ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/5 to-transparent backdrop-blur-md flex justify-center">
          <button 
            type="submit"
            className="w-full max-w-3xl py-4 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
          >
            {t(lang, 'saveSettings')}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
