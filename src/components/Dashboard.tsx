import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout, PersonalBest } from "@/types/fitness";
import { TrendingUp, Calendar, Timer, Trophy } from "lucide-react";
import { WorkoutHistoryCard } from "@/components/WorkoutHistoryCard";
import { MotivationalMessages } from "@/components/MotivationalMessages";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [personalBests] = useLocalStorage<PersonalBest[]>('fitness-personal-bests', []);
  const { toast } = useToast();

  const handleDeleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    toast({
      title: "Allenamento eliminato",
      description: "L'allenamento è stato eliminato con successo.",
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

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Motivational Messages */}
      <MotivationalMessages />

      {/* Header */}
      <div className="gradient-hero rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bentornato nel tuo Fitness Journey! 💪</h1>
        <p className="text-primary-foreground/90">Ecco un riepilogo dei tuoi progressi</p>
      </div>

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