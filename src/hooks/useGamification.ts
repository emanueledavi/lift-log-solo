import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Badge, Level, Challenge, GamificationStats, XpSource } from '@/types/gamification';
import { Workout } from '@/types/fitness';
import { useNotificationManager } from './useNotificationManager';

const LEVELS: Level[] = [
  { level: 1, name: '🔥 Fire Starter', minXp: 0, maxXp: 300, rewards: ['Basic tracking', '+50 XP boost'], color: 'from-orange-400 to-red-500' },
  { level: 2, name: '⚡ Beast Rookie', minXp: 300, maxXp: 800, rewards: ['Workout plans', 'Streak multiplier x1.2'], color: 'from-blue-400 to-cyan-500' },
  { level: 3, name: '💪 Iron Warrior', minXp: 800, maxXp: 1800, rewards: ['Advanced analytics', 'XP boost +25%'], color: 'from-purple-400 to-pink-500' },
  { level: 4, name: '🚀 Gym Dominator', minXp: 1800, maxXp: 4000, rewards: ['Custom challenges', 'Beast badges'], color: 'from-green-400 to-emerald-500' },
  { level: 5, name: '👑 Fitness Titan', minXp: 4000, maxXp: 8000, rewards: ['Elite features', 'Legendary status'], color: 'from-yellow-400 to-orange-500' },
  { level: 6, name: '🌟 Beast God', minXp: 8000, maxXp: 15000, rewards: ['God mode', 'Ultimate rewards'], color: 'from-purple-500 to-red-500' },
  { level: 7, name: '⭐ Immortal Legend', minXp: 15000, maxXp: 30000, rewards: ['Immortal status', 'All powers'], color: 'from-gradient-start to-gradient-end' },
  { level: 8, name: '🏆 Supreme Being', minXp: 30000, maxXp: 99999, rewards: ['Supreme power', 'Infinite glory'], color: 'from-gold-400 to-yellow-600' },
];

const XP_SOURCES: Record<string, XpSource> = {
  workout_completed: { action: 'workout_completed', xp: 150, description: '🔥 Workout Beast completato!' },
  first_workout: { action: 'first_workout', xp: 300, description: '🎯 Primo workout da LEGGENDA!' },
  streak_3: { action: 'streak_3', xp: 200, description: '⚡ 3 giorni di FUOCO consecutivi!' },
  streak_7: { action: 'streak_7', xp: 500, description: '🚀 Una settimana da BESTIA!' },
  streak_30: { action: 'streak_30', xp: 2000, description: '👑 30 giorni: SEI UNA LEGGENDA!' },
  streak_10: { action: 'streak_10', xp: 800, description: '💪 10 giorni di puro FERRO!' },
  streak_21: { action: 'streak_21', xp: 1200, description: '🏆 21 giorni: Macchina da guerra!' },
  streak_50: { action: 'streak_50', xp: 3500, description: '⭐ 50 giorni: IMMORTALE!' },
  streak_100: { action: 'streak_100', xp: 7500, description: '🌟 100 giorni: DIO DEL FITNESS!' },
  personal_best: { action: 'personal_best', xp: 250, description: '💥 Nuovo RECORD personale!' },
  exercise_milestone: { action: 'exercise_milestone', xp: 100, description: '🎯 10+ esercizi: Varietà BEAST!' },
  volume_milestone: { action: 'volume_milestone', xp: 300, description: '📈 Volume ESTREMO raggiunto!' },
  endurance_beast: { action: 'endurance_beast', xp: 400, description: '⏱️ Resistenza da TITANO!' },
  strength_god: { action: 'strength_god', xp: 500, description: '💪 Forza DIVINA!' },
  cardio_warrior: { action: 'cardio_warrior', xp: 350, description: '❤️ Cuore da GUERRIERO!' },
  challenge_completed: { action: 'challenge_completed', xp: 300, description: '🏅 Sfida DOMINATA!' },
  perfect_week: { action: 'perfect_week', xp: 1000, description: '✨ Settimana PERFETTA!' },
  beast_mode: { action: 'beast_mode', xp: 800, description: '🦁 BEAST MODE attivato!' },
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

  const { showNotification } = useNotificationManager();

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
        name: '🎯 BEAST AWAKENED',
        description: 'Hai iniziato il tuo viaggio da LEGGENDA!',
        icon: '🔥',
        category: 'milestone',
        rarity: 'rare',
        requirement: { type: 'workouts', target: 1 },
        unlocked: false
      },
      {
        id: 'workout_streak_3',
        name: '🔥 FIRE STARTER',
        description: '3 giorni di FUOCO consecutivi!',
        icon: '⚡',
        category: 'consistency',
        rarity: 'rare',
        requirement: { type: 'streak', target: 3 },
        unlocked: false
      },
      {
        id: 'workout_streak_7',
        name: '⚡ WEEK DOMINATOR',
        description: 'Una settimana DEVASTANTE!',
        icon: '💪',
        category: 'consistency',
        rarity: 'epic',
        requirement: { type: 'streak', target: 7 },
        unlocked: false
      },
      {
        id: 'workout_streak_21',
        name: '🏆 HABIT CRUSHER',
        description: '21 giorni: Hai SPEZZATO le catene!',
        icon: '⛓️‍💥',
        category: 'consistency',
        rarity: 'epic',
        requirement: { type: 'streak', target: 21 },
        unlocked: false
      },
      {
        id: 'workout_streak_30',
        name: '👑 LEGEND STATUS',
        description: '30 giorni: SEI UNA LEGGENDA!',
        icon: '🌟',
        category: 'consistency',
        rarity: 'legendary',
        requirement: { type: 'streak', target: 30 },
        unlocked: false
      },
      {
        id: 'workout_streak_100',
        name: '🌟 FITNESS GOD',
        description: '100 giorni: DIVINITÀ del FITNESS!',
        icon: '⚡',
        category: 'consistency',
        rarity: 'legendary',
        requirement: { type: 'streak', target: 100 },
        unlocked: false
      },
      {
        id: 'workout_10',
        name: '💪 IRON ROOKIE',
        description: '10 workout: Guerriero del ferro!',
        icon: '🔨',
        category: 'workout',
        rarity: 'rare',
        requirement: { type: 'workouts', target: 10 },
        unlocked: false
      },
      {
        id: 'workout_25',
        name: '🚀 BEAST MACHINE',
        description: '25 workout: Macchina inarrestabile!',
        icon: '⚙️',
        category: 'workout',
        rarity: 'epic',
        requirement: { type: 'workouts', target: 25 },
        unlocked: false
      },
      {
        id: 'workout_50',
        name: '🦁 WAR MACHINE',
        description: '50 workout: Macchina da GUERRA!',
        icon: '⚔️',
        category: 'workout',
        rarity: 'epic',
        requirement: { type: 'workouts', target: 50 },
        unlocked: false
      },
      {
        id: 'workout_100',
        name: '👑 SUPREME WARRIOR',
        description: '100 workout: GUERRIERO SUPREMO!',
        icon: '⚔️',
        category: 'workout',
        rarity: 'legendary',
        requirement: { type: 'workouts', target: 100 },
        unlocked: false
      },
      {
        id: 'workout_200',
        name: '⭐ IMMORTAL BEAST',
        description: '200 workout: BESTIA IMMORTALE!',
        icon: '🔱',
        category: 'workout',
        rarity: 'legendary',
        requirement: { type: 'workouts', target: 200 },
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
      showNotification(
        `level_up_${newLevel.level}`,
        "🎉 LEVEL UP!",
        `Congratulazioni! Ora sei ${newLevel.name} (Livello ${newLevel.level})!`
      );
    } else {
      showNotification(
        `xp_${source}_${Date.now()}`,
        `+${xpAmount} XP`,
        xpSource.description
      );
    }
  }, [gamificationStats.totalXp, gamificationStats.currentXp, getCurrentLevel, setGamificationStats, showNotification]);

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
        
        // STRICT deduplication: Show notification ONLY for newly unlocked badges
        if (wasLocked && newUnlocked && shouldUnlock && !badge.notificationShown) {
          // Immediately mark as notified to prevent any duplicates
          const updatedBadge = {
            ...badge,
            requirement: { ...badge.requirement, current },
            unlocked: newUnlocked,
            unlockedAt: new Date().toISOString(),
            notificationShown: true
          };
          
          // Show notification with delay to ensure state is updated first
          setTimeout(() => {
            showNotification(
              `badge_${badge.id}`,
              `🏆 BADGE LEGGENDARIO SBLOCCATO!`,
              `${badge.icon} ${badge.name} - ${badge.description}`
            );
          }, 200);
          
          return updatedBadge;
        }
        
        return {
          ...badge,
          requirement: { ...badge.requirement, current },
          unlocked: newUnlocked,
          unlockedAt: newUnlocked && !badge.unlockedAt ? new Date().toISOString() : badge.unlockedAt,
          notificationShown: badge.notificationShown || false
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
  }, [workouts, calculateStreak, initializeBadges, setGamificationStats, showNotification]);

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