import { useEffect, useRef } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { useNotificationManager } from '@/hooks/useNotificationManager';

// Component to handle gamification notifications
export function GamificationNotifications() {
  const { stats, awardXP } = useGamification();
  const { showNotification } = useNotificationManager();
  const lastNotifiedStreak = useRef<number>(0);
  const processedStreaks = useRef<Set<number>>(new Set());
  
  // Display streak notifications only when streak actually increases
  useEffect(() => {
    const currentStreak = stats.currentStreak;
    
    // Skip if already processed this streak
    if (processedStreaks.current.has(currentStreak) || currentStreak <= lastNotifiedStreak.current) {
      return;
    }
    
    // Only show notification for milestones
    const isStreakMilestone = 
      currentStreak === 3 || currentStreak === 7 || currentStreak === 10 || 
      currentStreak === 21 || currentStreak === 30 || currentStreak === 50 || 
      currentStreak === 100 || currentStreak % 25 === 0;
    
    if (isStreakMilestone && currentStreak > 0) {
      // Mark as processed immediately
      processedStreaks.current.add(currentStreak);
      lastNotifiedStreak.current = currentStreak;
      
      const streakMessages: Record<number, string> = {
        3: "🔥 3 giorni di FUOCO! Bestia in crescita!",
        7: "⚡ Una settimana DEVASTANTE! Beast mode ON!",
        10: "💪 10 giorni di FERRO! Macchina inarrestabile!",
        21: "🏆 21 giorni! Hai creato l'ABITUDINE!",
        30: "👑 30 giorni! SEI UNA LEGGENDA VIVENTE!",
        50: "⭐ 50 giorni! IMMORTALE del fitness!",
        100: "🌟 100 giorni! DIO DEL FITNESS!"
      };
      
      const message = streakMessages[currentStreak] || 
        `🚀 ${currentStreak} giorni consecutivi! DIVENTI LEGGENDA!`;
      
      // Use centralized notification system
      showNotification(
        `streak_${currentStreak}`,
        "🔥 STREAK LEGGENDARIO!",
        message
      );
      
      // Award XP after notification
      setTimeout(() => {
        if (currentStreak >= 100) awardXP('streak_100');
        else if (currentStreak >= 50) awardXP('streak_50');
        else if (currentStreak >= 30) awardXP('streak_30');
        else if (currentStreak >= 21) awardXP('streak_21');
        else if (currentStreak >= 10) awardXP('streak_10');
        else if (currentStreak >= 7) awardXP('streak_7');
        else if (currentStreak >= 3) awardXP('streak_3');
      }, 500);
    }
  }, [stats.currentStreak, awardXP, showNotification]);

  // This component doesn't render anything visible
  return null;
}