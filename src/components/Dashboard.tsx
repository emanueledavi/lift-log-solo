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
    <div className="space-y-8 animate-stagger">
      {/* Motivational Messages */}
      <div className="animate-slide-up">
        <MotivationalMessages />
      </div>

      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-glow-lg animate-scale-in">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 6s ease infinite'
          }}
        ></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-black mb-2 tracking-tight">
                Hey Beast! 💪
              </h1>
              <p className="text-xl font-bold opacity-90">
                Time to level up! 🚀
              </p>
            </div>
            <div className="glass p-4 rounded-3xl animate-bounce-in">
              <Trophy className="h-10 w-10 text-warning animate-glow-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="glass p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-success rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">Ready to crush it!</span>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-warning rounded-full animate-bounce"></div>
                <span className="font-bold text-lg">Beast mode: ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Workout Plan - Enhanced */}
      {todayWorkoutPlan ? (
        <Card className="glass-strong border-0 shadow-glow-lg animate-slide-up hover-lift neon-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-4xl font-black flex items-center justify-between text-primary">
              <div className="flex items-center">
                <div className="gradient-primary p-3 rounded-2xl mr-4 animate-glow-pulse">
                  <Target className="h-8 w-8 text-white animate-bounce-in" />
                </div>
                Today's Mission 🎯
              </div>
              <div className="text-2xl">🔥</div>
            </CardTitle>
            <p className="text-muted-foreground text-xl font-bold">
              {new Date().toLocaleDateString('it-IT', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long'
              })} - Time to shine!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="gradient-card rounded-2xl p-6 shadow-fitness-lg">
              <h3 className="text-2xl font-bold mb-6 text-primary">{todayWorkoutPlan.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {todayWorkoutPlan.exercises.slice(0, 4).map((exercise, index) => (
                  <div 
                    key={exercise.id} 
                    className="glass p-4 rounded-xl hover-glow transition-all animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground text-lg">{exercise.name}</p>
                        <p className="text-muted-foreground font-medium">
                          {exercise.targetSets} serie × {exercise.targetReps} reps
                          {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
                        </p>
                      </div>
                      {exercise.restTime && (
                        <div className="glass p-2 rounded-lg flex items-center text-sm font-medium text-primary">
                          <Clock className="h-4 w-4 mr-1" />
                          {Math.floor(exercise.restTime / 60)}:{(exercise.restTime % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {todayWorkoutPlan.exercises.length > 4 && (
                  <div className="col-span-full text-center">
                    <div className="glass p-4 rounded-xl">
                      <p className="text-muted-foreground font-semibold text-lg">
                        ... e altri {todayWorkoutPlan.exercises.length - 4} esercizi straordinari! 💪
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => startGuidedWorkout(todayWorkoutPlan)}
                size="xl"
                className="w-full relative overflow-hidden text-2xl font-black py-8 rounded-3xl shadow-glow-lg hover:scale-105 transition-all group"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite'
                }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <PlayCircle className="h-10 w-10 animate-bounce-in" />
                  <span>LET'S GOOO! 🚀💥</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-strong border-0 shadow-fitness-lg hover-lift animate-slide-up">
          <CardContent className="p-8 text-center">
            <div className="animate-bounce-in">
              <Target className="h-16 w-16 mx-auto mb-6 text-primary" />
            </div>
            <h3 className="text-3xl font-black mb-4 text-foreground">Rest Day Vibes! 😎</h3>
            <p className="text-muted-foreground mb-6 text-xl font-bold">
              Perfect time to plan your next epic workout session!
            </p>
            <div className="glass p-6 rounded-2xl neon-border">
              <p className="text-lg font-bold text-primary">
                💡 Hit up "Workout Plans" to create your transformation blueprint! 🎯
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
        <Card className="glass-strong border-0 shadow-fitness-lg hover-lift animate-scale-in neon-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="gradient-primary p-3 rounded-2xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">Total Workouts</p>
                  <p className="text-4xl font-black text-foreground">{totalWorkouts}</p>
                </div>
              </div>
              <div className="text-success animate-pulse-soft">📈</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 shadow-fitness-lg hover-lift animate-scale-in neon-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="gradient-secondary p-3 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">This Week</p>
                  <p className="text-4xl font-black text-foreground">{thisWeekWorkouts}</p>
                </div>
              </div>
              <div className="text-secondary animate-pulse-soft">⚡</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 shadow-fitness-lg hover-lift animate-scale-in neon-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="gradient-success p-3 rounded-2xl">
                  <Timer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">Avg Time</p>
                  <p className="text-4xl font-black text-foreground">{Math.round(avgDuration)}min</p>
                </div>
              </div>
              <div className="text-warning animate-pulse-soft">⏱️</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 shadow-fitness-lg hover-lift animate-scale-in neon-border pulse-success">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="gradient-primary p-3 rounded-2xl animate-glow-pulse">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-muted-foreground uppercase tracking-wider">PRs</p>
                  <p className="text-4xl font-black text-foreground">{personalBests.length}</p>
                </div>
              </div>
              <div className="text-warning animate-bounce-in">🏆</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Progress Chart */}
      <Card className="glass-strong border-0 shadow-glow-lg animate-slide-up hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-black flex items-center text-primary">
            <div className="gradient-primary p-3 rounded-2xl mr-4 animate-glow-pulse">
              <TrendingUp className="h-8 w-8 text-white animate-bounce-in" />
            </div>
            Your Glow Up Journey 📈
          </CardTitle>
          <p className="text-muted-foreground font-bold text-lg">Track your gains and flex your progress! 💪</p>
        </CardHeader>
        <CardContent className="p-6">
          {recentProgress.length > 0 ? (
            <div className="glass p-4 rounded-xl">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={recentProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={13}
                    fontWeight={600}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={13}
                    fontWeight={600}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--primary))',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-glow)',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 3, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 3, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center glass p-8 rounded-xl">
              <div className="animate-bounce-in">
                <TrendingUp className="h-16 w-16 text-primary mb-6" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-foreground">Your Story Starts NOW! 🚀</h3>
              <p className="text-muted-foreground font-bold text-lg">
                Start crushing workouts to see epic progress charts! 📊✨
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Personal Bests */}
      {personalBests.length > 0 && (
        <Card className="glass-strong border-0 shadow-glow-lg animate-slide-up hover-lift">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-black flex items-center">
              <div className="gradient-primary p-3 rounded-2xl mr-4 animate-glow-pulse">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              Personal Records Hall of Fame 🏆
            </CardTitle>
            <p className="text-muted-foreground font-bold text-lg">Every PR is a flex! Let's celebrate your wins! 🎉💪</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {personalBests.slice(-5).reverse().map((pb, index) => (
                <div 
                  key={index} 
                  className="glass p-4 rounded-xl hover-glow transition-all animate-scale-in neon-border"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="gradient-success p-2 rounded-lg">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{pb.exerciseName}</p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {new Date(pb.date).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl text-primary">{pb.weight}kg</p>
                      <p className="text-sm text-muted-foreground font-bold">{pb.reps} reps</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Workout History */}
      {workouts.length > 0 && (
        <Card className="glass-strong border-0 shadow-glow-lg animate-slide-up hover-lift">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-black flex items-center text-primary">
              <div className="gradient-secondary p-3 rounded-2xl mr-4 animate-glow-pulse">
                <Calendar className="h-8 w-8 text-white animate-bounce-in" />
              </div>
              Your Success Story 📚
            </CardTitle>
            <p className="text-muted-foreground font-bold text-lg">Every workout is a chapter in your fitness journey! 🌟</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {workouts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((workout, index) => (
                  <div 
                    key={workout.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <WorkoutHistoryCard 
                      workout={workout}
                      onDelete={handleDeleteWorkout}
                    />
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}