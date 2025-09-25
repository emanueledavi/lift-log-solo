import { useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';

// Component to handle gamification notifications
export function GamificationNotifications() {
  const { stats } = useGamification();
  
  // Display streak notifications
  useEffect(() => {
    if (stats.currentStreak > 0 && stats.currentStreak % 3 === 0) {
      const streakMessage = stats.currentStreak === 3 
        ? "🔥 3 giorni di fila! Sei in fire!" 
        : stats.currentStreak === 7 
        ? "⚡ Una settimana intera! Beast mode!" 
        : stats.currentStreak === 30
        ? "👑 30 giorni! Sei una leggenda!"
        : `🚀 ${stats.currentStreak} giorni consecutivi! Incredibile!`;
        
      if (stats.currentStreak >= 3) {
        toast({
          title: "🔥 STREAK BEAST!",
          description: streakMessage,
        });
      }
    }
  }, [stats.currentStreak]);

  // This component doesn't render anything visible
  return null;
}