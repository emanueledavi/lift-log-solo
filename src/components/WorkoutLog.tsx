import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout, Exercise, Set, PersonalBest } from "@/types/fitness";
import { Plus, Trash2, Save, Calendar, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function WorkoutLog() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [personalBests, setPersonalBests] = useLocalStorage<PersonalBest[]>('fitness-personal-bests', []);
  
  const [currentWorkout, setCurrentWorkout] = useState<Workout>({
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    exercises: [],
    notes: ''
  });

  const [startTime, setStartTime] = useState<Date | null>(null);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      type: 'strength',
      sets: [{ id: Date.now().toString() + '_1', type: 'strength', reps: 0, weight: 0 }],
      notes: ''
    };
    
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: Date.now().toString(),
      type: 'strength',
      reps: 0,
      weight: 0
    };

    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId ? { ...set, [field]: value } : set
              )
            }
          : ex
      )
    }));
  };

  const startWorkout = () => {
    setStartTime(new Date());
    toast({
      title: "Allenamento iniziato!",
      description: "Buona sessione! 💪"
    });
  };

  const saveWorkout = () => {
    if (currentWorkout.exercises.length === 0) {
      toast({
        title: "Errore",
        description: "Aggiungi almeno un esercizio prima di salvare.",
        variant: "destructive"
      });
      return;
    }

    // Calculate duration if workout was started
    let duration: number | undefined;
    if (startTime) {
      duration = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));
    }

    const workoutToSave = {
      ...currentWorkout,
      duration
    };

    setWorkouts(prev => [...prev, workoutToSave]);

    // Check for personal bests
    currentWorkout.exercises.forEach(exercise => {
      if (exercise.name.trim() && exercise.type === 'strength') {
        const maxSet = exercise.sets.reduce((max, set) => 
          (set.weight || 0) > (max.weight || 0) ? set : max
        );

        const existingPB = personalBests.find(pb => pb.exerciseName === exercise.name);
        
        if (maxSet.weight && (!existingPB || maxSet.weight > existingPB.weight)) {
          const newPB: PersonalBest = {
            exerciseName: exercise.name,
            weight: maxSet.weight,
            reps: maxSet.reps || 0,
            date: currentWorkout.date
          };

          setPersonalBests(prev => [
            ...prev.filter(pb => pb.exerciseName !== exercise.name),
            newPB
          ]);

          toast({
            title: "🏆 Nuovo Personal Best!",
            description: `${exercise.name}: ${maxSet.weight}kg x ${maxSet.reps}`,
          });
        }
      }
    });

    // Reset form
    setCurrentWorkout({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercises: [],
      notes: ''
    });
    setStartTime(null);

    toast({
      title: "Allenamento salvato!",
      description: "Ottimo lavoro! 🔥"
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Diario Allenamento</h1>
          <p className="text-muted-foreground">Registra la tua sessione di oggi</p>
        </div>
        
        <div className="flex gap-2">
          {!startTime ? (
            <Button onClick={startWorkout} className="gradient-primary text-primary-foreground">
              <Timer className="h-4 w-4 mr-2" />
              Inizia Allenamento
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>
                Durata: {Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60))}min
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Workout Form */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Allenamento
            </CardTitle>
            <Input
              type="date"
              value={currentWorkout.date}
              onChange={(e) => setCurrentWorkout(prev => ({ ...prev, date: e.target.value }))}
              className="w-auto"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exercises */}
          {currentWorkout.exercises.map((exercise, exerciseIndex) => (
            <Card key={exercise.id} className="bg-muted/20 border-border/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Input
                    placeholder="Nome esercizio (es. Panca piana)"
                    value={exercise.name}
                    onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                    className="flex-1 mr-4 font-medium"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sets - Mobile Optimized */}
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground px-1">
                    <span>Set</span>
                    <span>Kg</span>
                    <span>Reps</span>
                    <span></span>
                  </div>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-sm font-medium text-center bg-muted/50 rounded-md py-2">{setIndex + 1}</span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={set.weight || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                        className="text-center touch-manipulation"
                      />
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="0"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(exercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                        className="text-center touch-manipulation"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSet(exercise.id, set.id)}
                        disabled={exercise.sets.length === 1}
                        className="text-destructive hover:text-destructive touch-manipulation min-h-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSet(exercise.id)}
                    className="w-full touch-manipulation min-h-[44px]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Set
                  </Button>
                </div>

                {/* Exercise Notes */}
                <Textarea
                  placeholder="Note per questo esercizio..."
                  value={exercise.notes || ''}
                  onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}

          {/* Add Exercise Button */}
          <Button
            onClick={addExercise}
            variant="outline"
            className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Esercizio
          </Button>

          {/* Workout Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Note Allenamento</label>
            <Textarea
              placeholder="Come ti sei sentito oggi? Osservazioni generali..."
              value={currentWorkout.notes || ''}
              onChange={(e) => setCurrentWorkout(prev => ({ ...prev, notes: e.target.value }))}
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={saveWorkout}
            className="w-full gradient-primary text-primary-foreground font-medium"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Salva Allenamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}