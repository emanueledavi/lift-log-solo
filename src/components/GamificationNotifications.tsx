import { useEffect, useRef } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';

// Component to handle gamification notifications
export function GamificationNotifications() {
  const { stats, awardXP } = useGamification();
  const lastNotifiedStreak = useRef<number>(0);
  const notificationCooldown = useRef<boolean>(false);
  
  // Display streak notifications only when streak actually increases
  useEffect(() => {
    const currentStreak = stats.currentStreak;
    
    // Prevent notification spam with cooldown
    if (notificationCooldown.current) return;
    
    // Only show notification if streak is higher than last notified and is a milestone
    if (currentStreak > lastNotifiedStreak.current && currentStreak > 0) {
      const isStreakMilestone = 
        currentStreak === 3 || currentStreak === 7 || currentStreak === 10 || 
        currentStreak === 21 || currentStreak === 30 || currentStreak === 50 || 
        currentStreak === 100 || currentStreak % 25 === 0;
      
      if (isStreakMilestone) {
        // Activate cooldown to prevent duplicate notifications
        notificationCooldown.current = true;
        
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
        
        toast({
          title: "🔥 STREAK LEGGENDARIO!",
          description: message,
        });
        
        // Award massive XP for streaks
        if (currentStreak >= 100) awardXP('streak_100');
        else if (currentStreak >= 50) awardXP('streak_50');
        else if (currentStreak >= 30) awardXP('streak_30');
        else if (currentStreak >= 21) awardXP('streak_21');
        else if (currentStreak >= 10) awardXP('streak_10');
        else if (currentStreak >= 7) awardXP('streak_7');
        else if (currentStreak >= 3) awardXP('streak_3');
        
        lastNotifiedStreak.current = currentStreak;
        
        // Reset cooldown after 3 seconds
        setTimeout(() => {
          notificationCooldown.current = false;
        }, 3000);
      }
    }
  }, [stats.currentStreak, awardXP]);

  // This component doesn't render anything visible
  return null;
}