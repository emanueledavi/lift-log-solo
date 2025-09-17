import { useState } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, Trophy, Calendar, TrendingUp, CheckCircle2, Clock, Flame } from "lucide-react";
import { Workout, PersonalBest } from "@/types/fitness";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'weight' | 'reps' | 'workouts' | 'streak' | 'volume';
  targetValue: number;
  currentValue: number;
  exercise?: string;
  deadline: string;
  createdAt: string;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high';
}

const GOAL_TYPES = [
  { value: 'weight', label: 'Peso Massimo', icon: Trophy, description: 'Raggiungi un peso target in un esercizio' },
  { value: 'reps', label: 'Ripetizioni', icon: TrendingUp, description: 'Esegui un numero di ripetizioni target' },
  { value: 'workouts', label: 'Allenamenti', icon: Calendar, description: 'Completa un numero di allenamenti' },
  { value: 'streak', label: 'Giorni Consecutivi', icon: Flame, description: 'Mantieni una streak di allenamenti' },
  { value: 'volume', label: 'Volume Totale', icon: Target, description: 'Raggiungi un volume di carico totale' }
];

const PRIORITY_COLORS = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning-foreground',
  high: 'bg-destructive/20 text-destructive-foreground'
};

export function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('fitness-goals', []);
  const [workouts] = useLocalStorage<Workout[]>('fitness-workouts', []);
  const [personalBests] = useLocalStorage<PersonalBest[]>('fitness-personal-bests', []);
  const [showDialog, setShowDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'weight' as Goal['type'],
    targetValue: 0,
    exercise: '',
    deadline: '',
    priority: 'medium' as Goal['priority']
  });
  const { toast } = useToast();

  // Calculate current values for goals
  const calculateCurrentValue = (goal: Goal): number => {
    switch (goal.type) {
      case 'weight':
        if (!goal.exercise) return 0;
        const exercisePBs = personalBests.filter(pb => pb.exerciseName === goal.exercise);
        return exercisePBs.length > 0 ? Math.max(...exercisePBs.map(pb => pb.weight)) : 0;
      
      case 'reps':
        if (!goal.exercise) return 0;
        const repsPBs = personalBests.filter(pb => pb.exerciseName === goal.exercise);
        return repsPBs.length > 0 ? Math.max(...repsPBs.map(pb => pb.reps)) : 0;
      
      case 'workouts':
        return workouts.length;
      
      case 'streak':
        return calculateStreak();
      
      case 'volume':
        return workouts.reduce((total, workout) => {
          return total + workout.exercises
            .filter(exercise => exercise.type === 'strength')
            .reduce((exerciseSum, exercise) => {
              return exerciseSum + exercise.sets.reduce((setSum, set) => {
                return setSum + ((set.weight || 0) * (set.reps || 0));
              }, 0);
            }, 0);
        }, 0);
      
      default:
        return 0;
    }
  };

  const calculateStreak = (): number => {
    if (workouts.length === 0) return 0;
    
    const sortedDates = workouts
      .map(w => new Date(w.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let currentStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const previous = new Date(sortedDates[i - 1]);
      const diffDays = Math.abs(previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  const createGoal = () => {
    if (!newGoal.title || !newGoal.targetValue || !newGoal.deadline) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    if ((newGoal.type === 'weight' || newGoal.type === 'reps') && !newGoal.exercise) {
      toast({
        title: "Errore",
        description: "Seleziona un esercizio per questo tipo di obiettivo",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      targetValue: newGoal.targetValue,
      currentValue: 0,
      exercise: newGoal.exercise || undefined,
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString(),
      priority: newGoal.priority
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      type: 'weight',
      targetValue: 0,
      exercise: '',
      deadline: '',
      priority: 'medium'
    });
    setShowDialog(false);

    toast({
      title: "Obiettivo creato! 🎯",
      description: "Hai aggiunto un nuovo traguardo da raggiungere",
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast({
      title: "Obiettivo eliminato",
      description: "L'obiettivo è stato rimosso dalla lista",
    });
  };

  const completeGoal = (goalId: string) => {
    setGoals(goals.map(g => 
      g.id === goalId 
        ? { ...g, completedAt: new Date().toISOString() }
        : g
    ));
    toast({
      title: "Obiettivo completato! 🏆",
      description: "Fantastico! Hai raggiunto il tuo traguardo!",
    });
  };

  // Update current values for all goals
  const updatedGoals = goals.map(goal => ({
    ...goal,
    currentValue: calculateCurrentValue(goal)
  }));

  const activeGoals = updatedGoals.filter(g => !g.completedAt);
  const completedGoals = updatedGoals.filter(g => g.completedAt);

  // Get unique exercises for selection
  const uniqueExercises = Array.from(new Set(
    workouts.flatMap(w => w.exercises.map(e => e.name))
  )).filter(name => name.trim()).sort();

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">I Tuoi Obiettivi</h1>
          <p className="text-muted-foreground">Stabilisci traguardi e monitora i tuoi progressi</p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Obiettivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Obiettivo</DialogTitle>
              <DialogDescription>
                Definisci un traguardo specifico e traccia i tuoi progressi
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titolo Obiettivo</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="es. Panca piana 100kg"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione (opzionale)</Label>
                <Input
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  placeholder="Dettagli aggiuntivi sull'obiettivo"
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo di Obiettivo</Label>
                <Select value={newGoal.type} onValueChange={(value: Goal['type']) => setNewGoal({...newGoal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newGoal.type === 'weight' || newGoal.type === 'reps') && (
                <div>
                  <Label htmlFor="exercise">Esercizio</Label>
                  <Select value={newGoal.exercise} onValueChange={(value) => setNewGoal({...newGoal, exercise: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona esercizio" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueExercises.map(exercise => (
                        <SelectItem key={exercise} value={exercise}>
                          {exercise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="targetValue">Valore Target</Label>
                <Input
                  id="targetValue"
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value) || 0})}
                  placeholder={
                    newGoal.type === 'weight' ? 'Peso in kg' :
                    newGoal.type === 'reps' ? 'Numero ripetizioni' :
                    newGoal.type === 'workouts' ? 'Numero allenamenti' :
                    newGoal.type === 'streak' ? 'Giorni consecutivi' :
                    'Volume in kg'
                  }
                />
              </div>

              <div>
                <Label htmlFor="deadline">Scadenza</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priorità</Label>
                <Select value={newGoal.priority} onValueChange={(value: Goal['priority']) => setNewGoal({...newGoal, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Bassa</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={createGoal} className="w-full gradient-primary text-primary-foreground">
                Crea Obiettivo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Obiettivi Attivi ({activeGoals.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal, index) => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              const isOverdue = new Date(goal.deadline) < new Date();
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const canComplete = goal.currentValue >= goal.targetValue;

              return (
                <Card key={goal.id} className={`gradient-card border-0 shadow-fitness animate-scale-in ${canComplete ? 'ring-2 ring-success' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                      {GOAL_TYPES.find(t => t.value === goal.type) && (
                        React.createElement(
                          GOAL_TYPES.find(t => t.value === goal.type)!.icon, 
                          { className: "h-5 w-5 text-primary" }
                        )
                      )}
                          {goal.title}
                        </CardTitle>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[goal.priority]}`}>
                        {goal.priority === 'low' ? 'Bassa' : goal.priority === 'medium' ? 'Media' : 'Alta'}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">
                          {goal.currentValue} / {goal.targetValue}
                          {goal.type === 'weight' ? 'kg' : 
                           goal.type === 'reps' ? ' rep' : 
                           goal.type === 'workouts' ? ' allenamenti' :
                           goal.type === 'streak' ? ' giorni' : 'kg'}
                        </span>
                        <span className={`font-bold ${canComplete ? 'text-success' : progress > 75 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {goal.exercise && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Esercizio:</strong> {goal.exercise}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className={isOverdue ? 'text-destructive font-medium' : daysLeft <= 7 ? 'text-warning font-medium' : 'text-muted-foreground'}>
                          {isOverdue ? 'Scaduto' : daysLeft === 0 ? 'Scade oggi' : `${daysLeft} giorni`}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {canComplete && (
                          <Button 
                            size="sm" 
                            onClick={() => completeGoal(goal.id)}
                            className="bg-success text-success-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Completa
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteGoal(goal.id)}
                        >
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-success" />
            Obiettivi Completati ({completedGoals.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedGoals.map((goal, index) => (
              <Card key={goal.id} className="gradient-card border-0 shadow-fitness opacity-80 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-success" />
                      <h3 className="font-semibold line-through">{goal.title}</h3>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Completato il {new Date(goal.completedAt!).toLocaleDateString('it-IT')}
                  </p>
                  <div className="text-sm font-medium text-success">
                    {goal.currentValue} / {goal.targetValue}
                    {goal.type === 'weight' ? 'kg' : 
                     goal.type === 'reps' ? ' rep' : 
                     goal.type === 'workouts' ? ' allenamenti' :
                     goal.type === 'streak' ? ' giorni' : 'kg'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeGoals.length === 0 && completedGoals.length === 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nessun Obiettivo Impostato</h3>
            <p className="text-muted-foreground mb-6">
              Inizia a definire i tuoi traguardi fitness per rimanere motivato e tracciare i progressi
            </p>
            <Button onClick={() => setShowDialog(true)} className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Crea il Tuo Primo Obiettivo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}