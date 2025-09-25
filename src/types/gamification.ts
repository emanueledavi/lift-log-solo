export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'strength' | 'consistency' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'workouts' | 'streak' | 'weight' | 'volume' | 'exercises' | 'special';
    target: number;
    current?: number;
  };
  unlockedAt?: string;
  unlocked: boolean;
}

export interface Level {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  rewards: string[];
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: 'workout' | 'exercise' | 'weight' | 'cardio';
  target: number;
  progress: number;
  xpReward: number;
  expiresAt: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  notes?: string;
  bodyWeight?: number;
}

export interface GamificationStats {
  currentXp: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  badges: Badge[];
  challenges: Challenge[];
  progressPhotos: ProgressPhoto[];
}

export interface XpSource {
  action: string;
  xp: number;
  description: string;
}