import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Target, Weight, BarChart3 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout } from "@/types/fitness";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { useMemo } from "react";

export function WorkoutDetails() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  
  const workout = useMemo(() => 
    workouts.find(w => w.id === workoutId), 
    [workouts, workoutId]
  );

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-card border-0 shadow-fitness">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Allenamento non trovato</p>
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alla Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const workoutStats = useMemo(() => {
    const totalVolume = workout.exercises.reduce((sum, exercise) => 
      sum + exercise.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0
    );
    const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    const totalReps = workout.exercises.reduce((sum, exercise) => 
      sum + exercise.sets.reduce((setSum, set) => setSum + set.reps, 0), 0
    );
    const avgWeight = workout.exercises.reduce((sum, exercise) => {
      const exerciseAvg = exercise.sets.reduce((setSum, set) => setSum + set.weight, 0) / exercise.sets.length;
      return sum + exerciseAvg;
    }, 0) / workout.exercises.length;

    return {
      totalVolume: Math.round(totalVolume),
      totalSets,
      totalReps,
      avgWeight: Math.round(avgWeight * 10) / 10
    };
  }, [workout]);

  const exerciseData = useMemo(() => {
    return workout.exercises.map(exercise => {
      const volume = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
      
      return {
        name: exercise.name.length > 15 ? exercise.name.substring(0, 15) + '...' : exercise.name,
        volume,
        maxWeight,
        sets: exercise.sets.length,
        totalReps
      };
    });
  }, [workout]);

  const setsProgression = useMemo(() => {
    const allSets: any[] = [];
    workout.exercises.forEach((exercise, exerciseIndex) => {
      exercise.sets.forEach((set, setIndex) => {
        allSets.push({
          setNumber: allSets.length + 1,
          weight: set.weight,
          reps: set.reps,
          exercise: exercise.name,
          volume: set.weight * set.reps
        });
      });
    });
    return allSets;
  }, [workout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dettagli Allenamento</h1>
            <p className="text-muted-foreground">
              {new Date(workout.date).toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Workout Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gradient-card border-0 shadow-fitness">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Weight className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volume Totale</p>
                  <p className="text-2xl font-bold text-foreground">{workoutStats.totalVolume}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-fitness">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Serie Totali</p>
                  <p className="text-2xl font-bold text-foreground">{workoutStats.totalSets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-fitness">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-accent-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rep Totali</p>
                  <p className="text-2xl font-bold text-foreground">{workoutStats.totalReps}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-fitness">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Durata</p>
                  <p className="text-2xl font-bold text-foreground">
                    {workout.duration ? `${Math.round(workout.duration)}m` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercise Performance Chart */}
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Performance per Esercizio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Volume (kg)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sets Progression */}
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-secondary" />
              Progressione Serie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={setsProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="setNumber" 
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
                  formatter={(value: number, name: string) => [
                    name === 'weight' ? `${value}kg` : name === 'volume' ? `${value}kg` : value,
                    name === 'weight' ? 'Peso' : name === 'volume' ? 'Volume' : 'Ripetizioni'
                  ]}
                  labelFormatter={(label) => `Serie ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                  name="weight"
                />
                <Line 
                  type="monotone" 
                  dataKey="reps" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
                  name="reps"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Exercise Breakdown */}
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle>Dettaglio Esercizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="border-l-4 border-primary pl-4 space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="p-3 bg-accent/20 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Serie {setIndex + 1}</p>
                          <p className="text-lg font-bold text-primary">{set.weight}kg</p>
                          <p className="text-sm text-muted-foreground">x {set.reps}</p>
                          <p className="text-xs text-accent-foreground">
                            Vol: {set.weight * set.reps}kg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {exercise.notes && (
                    <p className="text-sm text-muted-foreground italic bg-accent/10 p-3 rounded-lg border-l-2 border-primary/30">
                      {exercise.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout Notes */}
        {workout.notes && (
          <Card className="gradient-card border-0 shadow-fitness">
            <CardHeader>
              <CardTitle>Note Allenamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic border-l-4 border-primary/30 pl-4">
                {workout.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}