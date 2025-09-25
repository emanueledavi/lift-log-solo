import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Badge, Level, Challenge, GamificationStats, XpSource } from '@/types/gamification';
import { Workout } from '@/types/fitness';
import { useToast } from './use-toast';

const LEVELS: Level[] = [
  { level: 1, name: 'Rookie Beast', minXp: 0, maxXp: 100, rewards: ['Basic tracking'], color: 'from-gray-400 to-gray-600' },
  { level: 2, name: 'Fitness Explorer', minXp: 100, maxXp: 250, rewards: ['Workout plans'], color: 'from-green-400 to-green-600' },
  { level: 3, name: 'Gym Warrior', minXp: 250, maxXp: 500, rewards: ['Advanced analytics'], color: 'from-blue-400 to-blue-600' },
  { level: 4, name: 'Iron Beast', minXp: 500, maxXp: 1000, rewards: ['Custom challenges'], color: 'from-purple-400 to-purple-600' },
  { level: 5, name: 'Fitness Legend', minXp: 1000, maxXp: 2000, rewards: ['Beast mode unlock'], color: 'from-orange-400 to-orange-600' },
  { level: 6, name: 'Ultimate Beast', minXp: 2000, maxXp: 99999, rewards: ['All features'], color: 'from-red-400 to-red-600' },
];

const XP_SOURCES: Record<string, XpSource> = {
  workout_completed: { action: 'workout_completed', xp: 50, description: 'Workout completato' },
  first_workout: { action: 'first_workout', xp: 100, description: 'Primo workout!' },
  streak_3: { action: 'streak_3', xp: 25, description: '3 giorni consecutivi' },
  streak_7: { action: 'streak_7', xp: 100, description: '7 giorni consecutivi' },
  streak_30: { action: 'streak_30', xp: 500, description: '30 giorni consecutivi' },
  personal_best: { action: 'personal_best', xp: 75, description: 'Nuovo record personale' },
  exercise_milestone: { action: 'exercise_milestone', xp: 30, description: '10 esercizi in un workout' },
  challenge_completed: { action: 'challenge_completed', xp: 100, description: 'Sfida completata' },
};

export function useGamification() {
  const [workouts] = useLocalStorage<Workout[]>('workouts', []);
  const [gamificationStats, setGamificationStats] = useLocalStorage<GamificationStats>('gamification_stats', {
    currentXp: 0,
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    badges: [],
    challenges: [],
    progressPhotos: []
  });

  const { toast } = useToast();

  // Calculate current level based on XP
  const getCurrentLevel = useCallback((xp: number): Level => {
    return LEVELS.find(level => xp >= level.minXp && xp < level.maxXp) || LEVELS[LEVELS.length - 1];
  }, []);

  // Calculate streak
  const calculateStreak = useCallback((): number => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }, [workouts]);

  // Initialize badges
  const initializeBadges = useCallback((): Badge[] => {
    return [
      {
        id: 'first_workout',
        name: 'Primo Passo',
        description: 'Completa il tuo primo workout',
        icon: '🎯',
        category: 'workout',
        rarity: 'common',
        requirement: { type: 'workouts', target: 1 },
        unlocked: false
      },
      {
        id: 'workout_streak_3',
        name: 'Costanza',
        description: '3 giorni consecutivi di allenamento',
        icon: '🔥',
        category: 'consistency',
        rarity: 'common',
        requirement: { type: 'streak', target: 3 },
        unlocked: false
      },
      {
        id: 'workout_streak_7',
        name: 'Settimana Beast',
        description: '7 giorni consecutivi di allenamento',
        icon: '⚡',
        category: 'consistency',
        rarity: 'rare',
        requirement: { type: 'streak', target: 7 },
        unlocked: false
      },
      {
        id: 'workout_10',
        name: 'Veterano',
        description: 'Completa 10 workout',
        icon: '💪',
        category: 'workout',
        rarity: 'common',
        requirement: { type: 'workouts', target: 10 },
        unlocked: false
      },
      {
        id: 'workout_50',
        name: 'Macchina da Guerra',
        description: 'Completa 50 workout',
        icon: '🤖',
        category: 'workout',
        rarity: 'epic',
        requirement: { type: 'workouts', target: 50 },
        unlocked: false
      },
      {
        id: 'workout_100',
        name: 'Centurione',
        description: 'Completa 100 workout',
        icon: '👑',
        category: 'workout',
        rarity: 'legendary',
        requirement: { type: 'workouts', target: 100 },
        unlocked: false
      }
    ];
  }, []);

  // Generate daily challenges
  const generateDailyChallenge = useCallback((): Challenge => {
    const challenges = [
      {
        title: 'Beast Starter',
        description: 'Completa 1 workout oggi',
        category: 'workout' as const,
        target: 1,
        xpReward: 50
      },
      {
        title: 'Iron Focus',
        description: 'Esegui 5 esercizi diversi',
        category: 'exercise' as const,
        target: 5,
        xpReward: 75
      },
      {
        title: 'Cardio Beast',
        description: 'Esegui 20 minuti di cardio',
        category: 'cardio' as const,
        target: 20,
        xpReward: 60
      }
    ];
    
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    return {
      id: `daily_${Date.now()}`,
      title: randomChallenge.title,
      description: randomChallenge.description,
      type: 'daily',
      category: randomChallenge.category,
      target: randomChallenge.target,
      progress: 0,
      xpReward: randomChallenge.xpReward,
      expiresAt: tomorrow.toISOString(),
      completed: false
    };
  }, []);

  // Award XP and check for level up
  const awardXP = useCallback((source: string, customAmount?: number) => {
    const xpSource = XP_SOURCES[source];
    if (!xpSource) return;
    
    const xpAmount = customAmount || xpSource.xp;
    const newTotalXp = gamificationStats.totalXp + xpAmount;
    const currentLevel = getCurrentLevel(gamificationStats.totalXp);
    const newLevel = getCurrentLevel(newTotalXp);
    
    setGamificationStats(prev => ({
      ...prev,
      currentXp: prev.currentXp + xpAmount,
      totalXp: newTotalXp,
      level: newLevel.level
    }));
    
    // Check for level up
    if (newLevel.level > currentLevel.level) {
      toast({
        title: "🎉 LEVEL UP!",
        description: `Congratulazioni! Ora sei ${newLevel.name} (Livello ${newLevel.level})!`,
      });
    } else {
      toast({
        title: `+${xpAmount} XP`,
        description: xpSource.description,
      });
    }
  }, [gamificationStats.totalXp, gamificationStats.currentXp, getCurrentLevel, setGamificationStats, toast]);

  // Update badges based on current progress
  const updateBadges = useCallback(() => {
    const currentStreak = calculateStreak();
    const totalWorkouts = workouts.length;
    
    setGamificationStats(prev => {
      const updatedBadges = prev.badges.length > 0 ? prev.badges : initializeBadges();
      
      const newBadges = updatedBadges.map(badge => {
        let current = 0;
        let shouldUnlock = false;
        
        switch (badge.requirement.type) {
          case 'workouts':
            current = totalWorkouts;
            shouldUnlock = current >= badge.requirement.target;
            break;
          case 'streak':
            current = currentStreak;
            shouldUnlock = current >= badge.requirement.target;
            break;
        }
        
        const wasLocked = !badge.unlocked;
        const newUnlocked = shouldUnlock || badge.unlocked;
        
        // Show toast for newly unlocked badges
        if (wasLocked && newUnlocked && shouldUnlock) {
          setTimeout(() => {
            toast({
              title: `🏆 BADGE SBLOCCATO!`,
              description: `${badge.icon} ${badge.name} - ${badge.description}`,
            });
            awardXP('challenge_completed', 25);
          }, 500);
        }
        
        return {
          ...badge,
          requirement: { ...badge.requirement, current },
          unlocked: newUnlocked,
          unlockedAt: newUnlocked && !badge.unlockedAt ? new Date().toISOString() : badge.unlockedAt
        };
      });
      
      return {
        ...prev,
        badges: newBadges,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        totalWorkouts
      };
    });
  }, [workouts, calculateStreak, initializeBadges, setGamificationStats, toast, awardXP]);

  // Initialize challenges if none exist
  const initializeChallenges = useCallback(() => {
    setGamificationStats(prev => {
      if (prev.challenges.length === 0) {
        return {
          ...prev,
          challenges: [generateDailyChallenge()]
        };
      }
      return prev;
    });
  }, [generateDailyChallenge, setGamificationStats]);

  // Get current level info
  const currentLevelInfo = getCurrentLevel(gamificationStats.totalXp);
  const nextLevelInfo = LEVELS.find(level => level.level === currentLevelInfo.level + 1);
  const progressToNextLevel = nextLevelInfo 
    ? ((gamificationStats.totalXp - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100
    : 100;

  // Initialize on mount
  useEffect(() => {
    updateBadges();
    initializeChallenges();
  }, [updateBadges, initializeChallenges]);

  return {
    stats: gamificationStats,
    currentLevel: currentLevelInfo,
    nextLevel: nextLevelInfo,
    progressToNextLevel,
    levels: LEVELS,
    awardXP,
    updateBadges,
    generateDailyChallenge
  };
}