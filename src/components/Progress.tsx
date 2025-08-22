import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout, PersonalBest, type Progress } from "@/types/fitness";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { TrendingUp, Trophy, Target, Calendar } from "lucide-react";

export function Progress() {
  const [workouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [personalBests] = useLocalStorage<PersonalBest[]>('fitness-personal-bests', []);
  
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // Get all unique exercises from workouts
  const allExercises = useMemo(() => {
    const exercises = new Set<string>();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.name.trim()) {
          exercises.add(exercise.name);
        }
      });
    });
    return Array.from(exercises).sort();
  }, [workouts]);

  // Generate progress data for selected exercise
  const progressData = useMemo(() => {
    if (!selectedExercise) return [];

    const exerciseWorkouts = workouts
      .filter(workout => 
        workout.exercises.some(ex => ex.name === selectedExercise)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return exerciseWorkouts.map(workout => {
      const exercise = workout.exercises.find(ex => ex.name === selectedExercise)!;
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      const totalVolume = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      const avgReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0) / exercise.sets.length;

      return {
        date: new Date(workout.date).toLocaleDateString('it-IT', { 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: workout.date,
        maxWeight,
        totalVolume,
        avgReps: Math.round(avgReps * 10) / 10,
        sets: exercise.sets.length
      };
    });
  }, [workouts, selectedExercise]);

  // Generate volume progression over time (all exercises)
  const volumeProgression = useMemo(() => {
    return workouts
      .slice(-12) // Last 12 workouts
      .map(workout => ({
        date: new Date(workout.date).toLocaleDateString('it-IT', { 
          month: 'short', 
          day: 'numeric' 
        }),
        volume: workout.exercises.reduce((total, exercise) => 
          total + exercise.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0)
        , 0)
      }));
  }, [workouts]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    if (workouts.length === 0) {
      return {
        totalVolume: 0,
        totalSets: 0,
        avgWorkoutVolume: 0,
        thisMonthWorkouts: 0
      };
    }

    const totalVolume = workouts.reduce((sum, workout) => 
      sum + workout.exercises.reduce((exerciseSum, exercise) => 
        exerciseSum + exercise.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0)
      , 0)
    , 0);

    const totalSets = workouts.reduce((sum, workout) => 
      sum + workout.exercises.reduce((exerciseSum, exercise) => exerciseSum + exercise.sets.length, 0)
    , 0);

    const avgWorkoutVolume = Math.round(totalVolume / workouts.length);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthWorkouts = workouts.filter(w => new Date(w.date) >= thisMonth).length;

    return {
      totalVolume: Math.round(totalVolume),
      totalSets,
      avgWorkoutVolume,
      thisMonthWorkouts
    };
  }, [workouts]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Monitoraggio Progressi</h1>
        <p className="text-muted-foreground">Analizza i tuoi miglioramenti nel tempo</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Totale</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalVolume.toLocaleString()}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serie Totali</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalSets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-accent-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Medio</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgWorkoutVolume}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Questo Mese</p>
                <p className="text-2xl font-bold text-foreground">{stats.thisMonthWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volume Progression Chart */}
      {volumeProgression.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Progressione Volume Totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeProgression}>
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
                  formatter={(value: number) => [`${value}kg`, 'Volume']}
                />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Exercise-Specific Progress */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle>Progressi per Esercizio</CardTitle>
          <div className="w-full max-w-xs">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un esercizio" />
              </SelectTrigger>
              <SelectContent>
                {allExercises.map(exercise => (
                  <SelectItem key={exercise} value={exercise}>
                    {exercise}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedExercise && progressData.length > 0 ? (
            <div className="space-y-6">
              {/* Weight Progress Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Progressione Peso Massimo</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
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
                      formatter={(value: number) => [`${value}kg`, 'Peso Max']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="maxWeight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Volume Progress Chart */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Progressione Volume</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
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
                      formatter={(value: number) => [`${value}kg`, 'Volume Totale']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalVolume" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--secondary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Latest Stats */}
              {progressData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Peso Max Attuale</p>
                    <p className="text-xl font-bold text-primary">
                      {progressData[progressData.length - 1].maxWeight}kg
                    </p>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Volume Ultima Sessione</p>
                    <p className="text-xl font-bold text-secondary">
                      {progressData[progressData.length - 1].totalVolume}kg
                    </p>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Rep Medie</p>
                    <p className="text-xl font-bold text-accent-foreground">
                      {progressData[progressData.length - 1].avgReps}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Serie Ultime</p>
                    <p className="text-xl font-bold text-foreground">
                      {progressData[progressData.length - 1].sets}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : selectedExercise ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessun dato disponibile per "{selectedExercise}"
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Seleziona un esercizio per visualizzare i progressi specifici
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Bests */}
      {personalBests.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-warning" />
              Tutti i Personal Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalBests
                .sort((a, b) => b.weight - a.weight)
                .map((pb, index) => (
                <div key={index} className="p-4 bg-accent/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{pb.exerciseName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(pb.date).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-primary">{pb.weight}kg</span>
                    <span className="text-sm text-muted-foreground">x {pb.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {workouts.length === 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Non hai ancora registrato nessun allenamento.
            </p>
            <p className="text-sm text-muted-foreground">
              Inizia ad allenarti per vedere i tuoi progressi!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}