import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout, PersonalBest, WorkoutPlan } from "@/types/fitness";
import { TrendingUp, Calendar, Timer, Trophy, PlayCircle, Target, Clock } from "lucide-react";
import { WorkoutHistoryCard } from "@/components/WorkoutHistoryCard";
import { MotivationalMessages } from "@/components/MotivationalMessages";
import { GuidedWorkout } from "@/components/GuidedWorkout";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function Dashboard() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [personalBests] = useLocalStorage<PersonalBest[]>('fitness-personal-bests', []);
  const [workoutPlans] = useLocalStorage<WorkoutPlan[]>('fitness-workout-plans', []);
  const [activeGuidedWorkout, setActiveGuidedWorkout] = useState<WorkoutPlan | null>(null);
  const { toast } = useToast();

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    toast({
      title: "Allenamento eliminato",
      description: "L'allenamento è stato eliminato con successo.",
    });
  };

  // Get today's workout plan
  const today = new Date().getDay();
  const todayWorkoutPlan = workoutPlans.find(plan => plan.dayOfWeek === today);

  const startGuidedWorkout = (plan: WorkoutPlan) => {
    setActiveGuidedWorkout(plan);
  };

  const completeGuidedWorkout = () => {
    setActiveGuidedWorkout(null);
    toast({
      title: "Allenamento completato! 🎉",
      description: "Ottimo lavoro! Controlla il tuo storico per vedere i progressi.",
    });
  };

  // Calculate stats
  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length;

  const avgDuration = workouts.length > 0 
    ? workouts.filter(w => w.duration).reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.filter(w => w.duration).length
    : 0;

  // Recent progress data for chart
  const recentProgress = workouts
    .slice(-10)
    .map(workout => ({
      date: new Date(workout.date).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }),
      volume: workout.exercises
        .filter(exercise => exercise.type === 'strength')
        .reduce((total, exercise) => 
          total + exercise.sets.reduce((setTotal, set) => setTotal + ((set.weight || 0) * (set.reps || 0)), 0)
        , 0)
    }));

  // Show guided workout if active
  if (activeGuidedWorkout) {
    return (
      <GuidedWorkout 
        workoutPlan={activeGuidedWorkout}
        onComplete={completeGuidedWorkout}
        onClose={() => setActiveGuidedWorkout(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Motivational Messages */}
      <MotivationalMessages />

      {/* Header */}
      <div className="gradient-hero rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bentornato nel tuo Fitness Journey! 💪</h1>
        <p className="text-primary-foreground/90">Ecco un riepilogo dei tuoi progressi</p>
      </div>

      {/* Today's Workout Plan */}
      {todayWorkoutPlan ? (
        <Card className="gradient-card border-0 shadow-fitness-lg animate-pulse-subtle">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Target className="h-6 w-6 mr-3 text-primary" />
              Allenamento di Oggi
            </CardTitle>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('it-IT', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-accent/20 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4">{todayWorkoutPlan.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {todayWorkoutPlan.exercises.slice(0, 4).map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.targetSets} serie × {exercise.targetReps} reps
                        {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
                      </p>
                    </div>
                    {exercise.restTime && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.floor(exercise.restTime / 60)}:{(exercise.restTime % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                ))}
                
                {todayWorkoutPlan.exercises.length > 4 && (
                  <div className="col-span-full text-center text-muted-foreground">
                    ... e altri {todayWorkoutPlan.exercises.length - 4} esercizi
                  </div>
                )}
              </div>

              <Button 
                onClick={() => startGuidedWorkout(todayWorkoutPlan)}
                size="lg"
                className="w-full gradient-primary text-primary-foreground text-lg py-6"
              >
                <PlayCircle className="h-6 w-6 mr-3" />
                Inizia l'Allenamento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nessun allenamento oggi</h3>
            <p className="text-muted-foreground mb-4">
              Non hai una scheda programmata per oggi. Vai alla sezione "Schede" per crearne una!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 shadow-fitness transition-smooth hover:shadow-fitness-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Allenamenti Totali</p>
                <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness transition-smooth hover:shadow-fitness-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Questa Settimana</p>
                <p className="text-2xl font-bold text-foreground">{thisWeekWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness transition-smooth hover:shadow-fitness-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-accent-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durata Media</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(avgDuration)}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness transition-smooth hover:shadow-fitness-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Personal Best</p>
                <p className="text-2xl font-bold text-foreground">{personalBests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Progressi nel Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Inizia ad allenarti per vedere i tuoi progressi!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Personal Bests */}
      {personalBests.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-warning" />
              Personal Best Recenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personalBests.slice(-5).reverse().map((pb, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{pb.exerciseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pb.date).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{pb.weight}kg</p>
                    <p className="text-sm text-muted-foreground">{pb.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout History */}
      {workouts.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Storico Allenamenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {workouts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((workout) => (
                  <WorkoutHistoryCard 
                    key={workout.id}
                    workout={workout}
                    onDelete={handleDeleteWorkout}
                  />
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}