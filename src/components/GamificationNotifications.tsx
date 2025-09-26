import { useEffect, useRef } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';

// Component to handle gamification notifications
export function GamificationNotifications() {
  const { stats } = useGamification();
  const lastNotifiedStreak = useRef<number>(0);
  
  // Display streak notifications only when streak actually increases
  useEffect(() => {
    const currentStreak = stats.currentStreak;
    
    // Only show notification if streak is higher than last notified and is a milestone
    if (currentStreak > lastNotifiedStreak.current && 
        currentStreak > 0 && 
        (currentStreak === 3 || currentStreak === 7 || currentStreak === 30 || currentStreak % 10 === 0)) {
      
      const streakMessage = currentStreak === 3 
        ? "🔥 3 giorni di fila! Sei in fire!" 
        : currentStreak === 7 
        ? "⚡ Una settimana intera! Beast mode!" 
        : currentStreak === 30
        ? "👑 30 giorni! Sei una leggenda!"
        : `🚀 ${currentStreak} giorni consecutivi! Incredibile!`;
        
      toast({
        title: "🔥 STREAK BEAST!",
        description: streakMessage,
      });
      
      lastNotifiedStreak.current = currentStreak;
    }
  }, [stats.currentStreak]);

  // This component doesn't render anything visible
  return null;
}