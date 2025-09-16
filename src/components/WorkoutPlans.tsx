import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { WorkoutPlan, PlannedExercise } from "@/types/fitness";
import { Plus, Trash2, Save, Calendar, Target, Edit3, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ExerciseAutocomplete } from "./ExerciseAutocomplete";

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domenica' },
  { value: 1, label: 'Lunedì' },
  { value: 2, label: 'Martedì' },
  { value: 3, label: 'Mercoledì' },
  { value: 4, label: 'Giovedì' },
  { value: 5, label: 'Venerdì' },
  { value: 6, label: 'Sabato' }
];

export function WorkoutPlansComponent() {
  const [workoutPlans, setWorkoutPlans] = useLocalStorage<WorkoutPlan[]>('fitness-workout-plans', []);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createNewPlan = () => {
    const newPlan: WorkoutPlan = {
      id: Date.now().toString(),
      name: '',
      exercises: []
    };
    setEditingPlan(newPlan);
    setIsDialogOpen(true);
  };

  const editPlan = (plan: WorkoutPlan) => {
    setEditingPlan({ ...plan });
    setIsDialogOpen(true);
  };

  const duplicatePlan = (plan: WorkoutPlan) => {
    const duplicatedPlan: WorkoutPlan = {
      ...plan,
      id: Date.now().toString(),
      name: `${plan.name} (Copia)`,
      dayOfWeek: undefined
    };
    setEditingPlan(duplicatedPlan);
    setIsDialogOpen(true);
  };

  const deletePlan = (planId: string) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== planId));
    toast({
      title: "Scheda eliminata",
      description: "La scheda di allenamento è stata rimossa."
    });
  };

  const savePlan = () => {
    if (!editingPlan || !editingPlan.name.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per la scheda.",
        variant: "destructive"
      });
      return;
    }

    const existingPlanIndex = workoutPlans.findIndex(p => p.id === editingPlan.id);
    
    if (existingPlanIndex >= 0) {
      setWorkoutPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
      toast({
        title: "Scheda aggiornata!",
        description: "Le modifiche sono state salvate."
      });
    } else {
      setWorkoutPlans(prev => [...prev, editingPlan]);
      toast({
        title: "Nuova scheda creata!",
        description: "La scheda è stata aggiunta con successo."
      });
    }

    setEditingPlan(null);
    setIsDialogOpen(false);
  };

  const addExerciseToPlan = () => {
    if (!editingPlan) return;

    const newExercise: PlannedExercise = {
      id: Date.now().toString(),
      name: '',
      targetSets: 3,
      targetReps: '8-12',
      targetWeight: 0,
      restTime: 90
    };

    setEditingPlan({
      ...editingPlan,
      exercises: [...editingPlan.exercises, newExercise]
    });
  };

  const updateExerciseInPlan = (exerciseId: string, field: keyof PlannedExercise, value: any) => {
    if (!editingPlan) return;

    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    });
  };

  const removeExerciseFromPlan = (exerciseId: string) => {
    if (!editingPlan) return;

    setEditingPlan({
      ...editingPlan,
      exercises: editingPlan.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  // Group plans by day of week
  const plansByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    plans: workoutPlans.filter(plan => plan.dayOfWeek === day.value)
  }));

  const unassignedPlans = workoutPlans.filter(plan => plan.dayOfWeek === undefined);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestione Schede</h1>
          <p className="text-muted-foreground">Crea e organizza le tue schede di allenamento</p>
        </div>
        
        <Button onClick={createNewPlan} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Nuova Scheda
        </Button>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {plansByDay.map(day => (
          <Card key={day.value} className="gradient-card border-0 shadow-fitness h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-center">{day.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.plans.length > 0 ? (
                day.plans.map(plan => (
                  <div key={plan.id} className="p-3 bg-accent/20 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{plan.name}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editPlan(plan)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {plan.exercises.length} esercizi
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nessuna scheda</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unassigned Plans */}
      {unassignedPlans.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Schede Non Assegnate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unassignedPlans.map(plan => (
                <div key={plan.id} className="p-4 bg-accent/20 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{plan.name}</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editPlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicatePlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {plan.exercises.length} esercizi
                  </p>
                  <div className="space-y-1">
                    {plan.exercises.slice(0, 3).map(exercise => (
                      <p key={exercise.id} className="text-xs text-muted-foreground">
                        • {exercise.name || 'Esercizio senza nome'}
                      </p>
                    ))}
                    {plan.exercises.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        ... e altri {plan.exercises.length - 3} esercizi
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {workoutPlans.length === 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Non hai ancora creato nessuna scheda di allenamento.
            </p>
            <Button onClick={createNewPlan} className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Crea la tua prima scheda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan && workoutPlans.find(p => p.id === editingPlan.id) ? 'Modifica Scheda' : 'Nuova Scheda'}
            </DialogTitle>
          </DialogHeader>
          
          {editingPlan && (
            <div className="space-y-6">
              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Scheda</Label>
                  <Input
                    placeholder="es. Forza Upper Body"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Giorno della Settimana (Opzionale)</Label>
                  <Select 
                    value={editingPlan.dayOfWeek?.toString() || 'unassigned'} 
                    onValueChange={(value) => 
                      setEditingPlan({ 
                        ...editingPlan, 
                        dayOfWeek: value === 'unassigned' ? undefined : parseInt(value) 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Non assegnato</SelectItem>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Esercizi</h3>
                  <Button onClick={addExerciseToPlan} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Esercizio
                  </Button>
                </div>

                {editingPlan.exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="bg-muted/20">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Esercizio {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExerciseFromPlan(exercise.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome Esercizio</Label>
                          <ExerciseAutocomplete
                            placeholder="es. Panca piana"
                            value={exercise.name}
                            onChange={(value) => updateExerciseInPlan(exercise.id, 'name', value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Serie Target</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={exercise.targetSets}
                            onChange={(e) => updateExerciseInPlan(exercise.id, 'targetSets', parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Ripetizioni Target</Label>
                          <Input
                            placeholder="es. 8-12 o 10"
                            value={exercise.targetReps}
                            onChange={(e) => updateExerciseInPlan(exercise.id, 'targetReps', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Peso Target (kg) - Opzionale</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={exercise.targetWeight || ''}
                            onChange={(e) => updateExerciseInPlan(exercise.id, 'targetWeight', parseFloat(e.target.value) || undefined)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Recupero (secondi)</Label>
                          <Select 
                            value={exercise.restTime?.toString() || '90'} 
                            onValueChange={(value) => updateExerciseInPlan(exercise.id, 'restTime', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 secondi</SelectItem>
                              <SelectItem value="60">1 minuto</SelectItem>
                              <SelectItem value="90">1:30 minuti</SelectItem>
                              <SelectItem value="120">2 minuti</SelectItem>
                              <SelectItem value="180">3 minuti</SelectItem>
                              <SelectItem value="300">5 minuti</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {editingPlan.exercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nessun esercizio aggiunto</p>
                    <p className="text-sm">Clicca "Aggiungi Esercizio" per iniziare</p>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={savePlan} className="gradient-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  Salva Scheda
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}