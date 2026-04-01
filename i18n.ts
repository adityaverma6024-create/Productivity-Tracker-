import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, AppSettings } from '../types';
import { ArrowLeft } from 'lucide-react';
import { t } from '../lib/i18n';
import { playSound, triggerHaptic } from '../lib/sound';

const AVATARS = ['👤', '👩', '👨', '🧑‍🦱', '👩‍🦰', '👱‍♂️', '👩‍🦳', '🧔', '👽', '🤖', '👻', '🦊', '🐱', '🐶'];

export default function AccountScreen({ profile, onSave, onCancel, settings }: { profile: UserProfile, onSave: (p: UserProfile) => void, onCancel: () => void, settings: AppSettings }) {
  const [localProfile, setLocalProfile] = useState(profile);
  const theme = settings.theme;
  const lang = settings.language;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('save', settings.sound);
    triggerHaptic('success', settings.haptics);
    onSave(localProfile);
  };

  const handleBack = () => {
    playSound('click', settings.sound);
    triggerHaptic('light', settings.haptics);
    onCancel();
  };

  const inputClass = `w-full px-5 py-4 rounded-2xl outline-none transition-all border ${
    theme === 'dark' 
      ? 'bg-neutral-800 border-neutral-700 focus:border-neutral-500 text-white placeholder:text-neutral-500' 
      : theme === 'eyecare'
      ? 'bg-[#f4ecd8] border-[#e6d5b8] focus:border-[#cbb590] text-[#5c4d3c] placeholder:text-[#a08f75]'
      : theme === 'glass'
      ? 'bg-white/50 border-white/60 focus:border-white/80 text-neutral-800 placeholder:text-neutral-500 shadow-sm'
      : 'bg-neutral-50 border-neutral-200 focus:border-neutral-400 focus:bg-white text-neutral-800 placeholder:text-neutral-400'
  }`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen p-6 sm:p-12 max-w-2xl mx-auto"
    >
      <button onClick={handleBack} className="flex items-center mb-8 opacity-70 hover:opacity-100 transition-opacity">
        <ArrowLeft size={20} className="mr-2" /> {t(lang, 'cancel')}
      </button>

      <h1 className="text-3xl font-medium tracking-tight mb-8">{t(lang, 'account')}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium opacity-70 mb-3 ml-1">{t(lang, 'avatar')}</label>
          <div className="flex flex-wrap gap-3">
            {AVATARS.map(a => (
              <button 
                key={a}
                type="button"
                onClick={() => {
                  playSound('click', settings.sound);
                  triggerHaptic('light', settings.haptics);
                  setLocalProfile({ ...localProfile, avatar: a });
                }}
                className={`w-12 h-12 text-2xl rounded-full flex items-center justify-center transition-all ${
                  localProfile.avatar === a 
                    ? 'bg-emerald-500 shadow-lg scale-110' 
                    : theme === 'dark' ? 'bg-neutral-800 hover:bg-neutral-700' : theme === 'glass' ? 'bg-white/50 border border-white/60 hover:bg-white/70 shadow-sm' : 'bg-white shadow-sm hover:shadow-md border border-black/5'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-2 ml-1">{t(lang, 'name')}</label>
          <input 
            type="text" 
            required
            value={localProfile.name}
            onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })}
            className={inputClass}
            placeholder={t(lang, 'name')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-2 ml-1">{t(lang, 'email')}</label>
          <input 
            type="email" 
            value={localProfile.email}
            onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })}
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium opacity-70 mb-2 ml-1">{t(lang, 'gender')}</label>
          <select 
            value={localProfile.gender}
            onChange={e => setLocalProfile({ ...localProfile, gender: e.target.value })}
            className={inputClass}
            required
          >
            <option value="" disabled>{t(lang, 'selectGender', 'Select Gender')}</option>
            <option value="male">{t(lang, 'male')}</option>
            <option value="female">{t(lang, 'female')}</option>
          </select>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
        >
          {t(lang, 'saveProfile')}
        </button>
      </form>
    </motion.div>
  );
}
