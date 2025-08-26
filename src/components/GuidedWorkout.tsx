import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutPlan, Workout, Exercise, Set } from "@/types/fitness";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PlayCircle, PauseCircle, CheckCircle2, Timer, Dumbbell, Activity, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuidedWorkoutProps {
  workoutPlan: WorkoutPlan;
  onComplete: () => void;
  onClose: () => void;
}

export function GuidedWorkout({ workoutPlan, onComplete, onClose }: GuidedWorkoutProps) {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([]);
  const [currentExerciseData, setCurrentExerciseData] = useState<Exercise | null>(null);
  const [isRestTimer, setIsRestTimer] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [startTime] = useState(new Date());
  const { toast } = useToast();

  const currentPlannedExercise = workoutPlan.exercises[currentExerciseIndex];
  const totalExercises = workoutPlan.exercises.length;
  const progress = ((currentExerciseIndex + (currentSetIndex / (currentPlannedExercise?.targetSets || 1))) / totalExercises) * 100;

  // Initialize current exercise data
  useEffect(() => {
    if (currentPlannedExercise && !currentExerciseData) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: currentPlannedExercise.name,
        type: 'strength', // Default to strength, could be enhanced to detect type
        sets: [],
        notes: ""
      };
      setCurrentExerciseData(newExercise);
    }
  }, [currentPlannedExercise, currentExerciseData]);

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRestTimer && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsRestTimer(false);
            toast({
              title: "Recupero completato! 💪",
              description: "È ora della prossima serie!"
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimer, restTime, toast]);

  const addSet = (setData: Partial<Set>) => {
    if (!currentExerciseData) return;

    const newSet: Set = {
      id: Date.now().toString(),
      type: 'strength',
      ...setData
    };

    const updatedExercise = {
      ...currentExerciseData,
      sets: [...currentExerciseData.sets, newSet]
    };

    setCurrentExerciseData(updatedExercise);
    
    // Start rest timer if not the last set
    if (currentSetIndex < (currentPlannedExercise?.targetSets || 1) - 1) {
      setRestTime(currentPlannedExercise?.restTime || 90);
      setIsRestTimer(true);
    }

    setCurrentSetIndex(prev => prev + 1);
  };

  const addCardioSet = (setData: Partial<Set>) => {
    if (!currentExerciseData) return;

    const newSet: Set = {
      id: Date.now().toString(),
      type: 'cardio',
      ...setData
    };

    const updatedExercise = {
      ...currentExerciseData,
      sets: [...currentExerciseData.sets, newSet]
    };

    setCurrentExerciseData(updatedExercise);
    setCurrentSetIndex(prev => prev + 1);
  };

  const completeExercise = () => {
    if (!currentExerciseData) return;

    setCompletedExercises(prev => [...prev, currentExerciseData]);
    
    if (currentExerciseIndex < totalExercises - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
      setCurrentExerciseData(null);
      setIsRestTimer(false);
    } else {
      // Workout completed
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const workout: Workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: [...completedExercises, ...(currentExerciseData ? [currentExerciseData] : [])],
      duration,
      notes: workoutNotes
    };

    setWorkouts(prev => [...prev, workout]);
    
    toast({
      title: "Allenamento completato! 🎉",
      description: `Ottimo lavoro! Durata: ${duration} minuti`
    });

    onComplete();
  };

  const skipRestTimer = () => {
    setIsRestTimer(false);
    setRestTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentPlannedExercise) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="gradient-hero rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{workoutPlan.name}</h1>
            <p className="text-primary-foreground/90">
              Esercizio {currentExerciseIndex + 1} di {totalExercises}
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="text-primary bg-white/20 border-white/30">
            Chiudi
          </Button>
        </div>
        
        {/* Progress */}
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-primary-foreground/80 mt-2">
            Progresso: {Math.round(progress)}%
          </p>
        </div>
      </div>

      {/* Rest Timer */}
      {isRestTimer && (
        <Card className="gradient-card border-0 shadow-fitness animate-pulse">
          <CardContent className="p-6 text-center">
            <Timer className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Recupero</h3>
            <p className="text-4xl font-bold text-primary mb-4">{formatTime(restTime)}</p>
            <Button onClick={skipRestTimer} variant="outline">
              Salta recupero
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise */}
      {!isRestTimer && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Dumbbell className="h-6 w-6 mr-3 text-primary" />
              {currentPlannedExercise.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Serie {currentSetIndex + 1} di {currentPlannedExercise.targetSets}</span>
              <span>Target: {currentPlannedExercise.targetReps} reps</span>
              {currentPlannedExercise.targetWeight && (
                <span>Peso consigliato: {currentPlannedExercise.targetWeight}kg</span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Set Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strength Exercise Inputs */}
              <StrengthSetInput 
                onAddSet={addSet}
                targetWeight={currentPlannedExercise.targetWeight}
                targetReps={currentPlannedExercise.targetReps}
                disabled={currentSetIndex >= currentPlannedExercise.targetSets}
              />
            </div>

            {/* Completed Sets */}
            {currentExerciseData && currentExerciseData.sets.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Serie completate:</h4>
                <div className="space-y-2">
                  {currentExerciseData.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center gap-4 p-3 bg-accent/20 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Serie {index + 1}:</span>
                      {set.type === 'strength' && (
                        <span>{set.weight}kg × {set.reps} reps</span>
                      )}
                      {set.type === 'cardio' && (
                        <span>{set.duration}min - {set.distance}km</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Actions */}
            <div className="flex gap-4">
              {currentSetIndex >= currentPlannedExercise.targetSets && (
                <>
                  <Button 
                    onClick={completeExercise} 
                    className="gradient-primary text-primary-foreground flex-1"
                  >
                    {currentExerciseIndex < totalExercises - 1 ? 'Prossimo Esercizio' : 'Completa Allenamento'}
                  </Button>
                  <Button 
                    onClick={() => setCurrentSetIndex(prev => prev - 1)} 
                    variant="outline"
                    className="px-6"
                  >
                    Aggiungi Serie
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Notes */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle className="text-lg">Note Allenamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Aggiungi note sull'allenamento..."
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Emergency Complete */}
      <div className="flex justify-center">
        <Button onClick={completeWorkout} variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Salva e Termina Allenamento
        </Button>
      </div>
    </div>
  );
}

// Strength Set Input Component
function StrengthSetInput({ 
  onAddSet, 
  targetWeight, 
  targetReps, 
  disabled 
}: {
  onAddSet: (set: Partial<Set>) => void;
  targetWeight?: number;
  targetReps: string;
  disabled: boolean;
}) {
  const [weight, setWeight] = useState(targetWeight?.toString() || '');
  const [reps, setReps] = useState('');

  const handleAddSet = () => {
    if (!weight || !reps) return;

    onAddSet({
      weight: parseFloat(weight),
      reps: parseInt(reps)
    });

    // Reset reps, keep weight for next set
    setReps('');
  };

  if (disabled) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Registra Serie</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Peso (kg)</Label>
          <Input
            type="number"
            step="0.5"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Ripetizioni</Label>
          <Input
            type="number"
            placeholder={targetReps}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleAddSet} 
        disabled={!weight || !reps}
        className="w-full gradient-primary text-primary-foreground"
      >
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Aggiungi Serie
      </Button>
    </div>
  );
}
