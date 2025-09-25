import { useEffect } from 'react';
import { useGamification } from './useGamification';
import { useLocalStorage } from './useLocalStorage';
import { Workout } from '@/types/fitness';

// Hook to integrate gamification with workout system
export function useWorkoutGamification() {
  const [workouts] = useLocalStorage<Workout[]>('workouts', []);
  const { awardXP, updateBadges } = useGamification();

  // Monitor workouts and award XP automatically
  useEffect(() => {
    const currentWorkoutCount = workouts.length;
    const lastProcessedCount = parseInt(localStorage.getItem('gamification_last_workout_count') || '0');
    
    if (currentWorkoutCount > lastProcessedCount) {
      // New workout completed!
      const newWorkouts = currentWorkoutCount - lastProcessedCount;
      
      for (let i = 0; i < newWorkouts; i++) {
        if (lastProcessedCount + i === 0) {
          // First workout ever
          awardXP('first_workout');
        } else {
          // Regular workout
          awardXP('workout_completed');
        }
      }
      
      // Update badges
      setTimeout(() => {
        updateBadges();
      }, 1000);
      
      // Save processed count
      localStorage.setItem('gamification_last_workout_count', currentWorkoutCount.toString());
    }
  }, [workouts.length, awardXP, updateBadges]);

  return {
    awardXP,
    updateBadges
  };
}