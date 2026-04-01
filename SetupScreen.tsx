export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface DayData {
  id: string;
  dayIndex: number;
  date: string;
  tasks: Task[];
}

export interface UserProfile {
  avatar: string;
  name: string;
  gender: string;
  email: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'eyecare' | 'grayscale' | 'glass';
  iconShape: 'round' | 'square' | 'rectangle' | 'ellipse';
  iconSize: 'small' | 'medium' | 'large';
  hdrMode: boolean;
  language: string;
  sound: boolean;
  haptics: boolean;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'completed';
  rating?: 'best' | 'moderate' | 'just_good' | 'bad' | 'worse';
  response?: string;
}

export interface AppState {
  isSetupComplete: boolean;
  name: string;
  totalDays: number;
  startDate: string;
  days: DayData[];
  profile: UserProfile;
  settings: AppSettings;
  exams?: Exam[];
}
