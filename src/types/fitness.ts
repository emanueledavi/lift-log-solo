export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio';
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  type: 'strength' | 'cardio';
  // Strength properties
  reps?: number;
  weight?: number;
  // Cardio properties  
  duration?: number; // in minutes
  distance?: number; // in km
  speed?: number; // in km/h
  incline?: number; // in percentage
  calories?: number;
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  duration?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: PlannedExercise[];
  dayOfWeek?: number;
}

export interface PlannedExercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string; // e.g., "8-12" or "10"
  targetWeight?: number;
  restTime?: number; // in seconds
}

export interface PersonalBest {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface Progress {
  exerciseName: string;
  data: ProgressPoint[];
}

export interface ProgressPoint {
  date: string;
  weight: number;
  reps: number;
  volume: number; // weight * reps * sets
}

export interface CalorieCalculation {
  weight: number;
  duration: number;
  activityType: 'strength' | 'cardio' | 'mixed';
  caloriesBurned: number;
}