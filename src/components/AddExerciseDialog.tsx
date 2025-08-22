import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Exercise, Set } from "@/types/fitness";

interface AddExerciseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
}

export function AddExerciseDialog({ isOpen, onClose, onSave }: AddExerciseDialogProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState<'strength' | 'cardio'>('strength');
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<Set[]>([]);

  const addSet = () => {
    const newSet: Set = {
      id: `set_${Date.now()}_${Math.random()}`,
      type: exerciseType,
      ...(exerciseType === 'strength' 
        ? { reps: 0, weight: 0 }
        : { duration: 0, distance: 0, speed: 0, incline: 0, calories: 0 }
      )
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (index: number, field: string, value: number) => {
    const updatedSets = sets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    );
    setSets(updatedSets);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (exerciseName.trim() && sets.length > 0) {
      const exercise: Exercise = {
        id: `exercise_${Date.now()}_${Math.random()}`,
        name: exerciseName.trim(),
        type: exerciseType,
        sets: sets,
        notes: notes.trim() || undefined
      };
      onSave(exercise);
      handleClose();
    }
  };

  const handleClose = () => {
    setExerciseName("");
    setExerciseType('strength');
    setNotes("");
    setSets([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Esercizio</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="exercise-name">Nome Esercizio</Label>
            <Input
              id="exercise-name"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Es. Panca piana, Tapis roulant..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exercise-type">Tipo Esercizio</Label>
            <Select value={exerciseType} onValueChange={(value: 'strength' | 'cardio') => {
              setExerciseType(value);
              setSets([]); // Reset sets when changing type
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Forza</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Serie</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSet}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Serie
              </Button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {sets.map((set, index) => (
                <div key={set.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Serie {index + 1}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSet(index)}
                    >
                      Rimuovi
                    </Button>
                  </div>
                  
                  {exerciseType === 'strength' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Peso (kg)</Label>
                        <Input
                          type="number"
                          value={set.weight === 0 ? '' : set.weight || ''}
                          onChange={(e) => updateSet(index, 'weight', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'weight', 0);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ripetizioni</Label>
                        <Input
                          type="number"
                          value={set.reps === 0 ? '' : set.reps || ''}
                          onChange={(e) => updateSet(index, 'reps', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'reps', 0);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Durata (min)</Label>
                        <Input
                          type="number"
                          value={set.duration === 0 ? '' : set.duration || ''}
                          onChange={(e) => updateSet(index, 'duration', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'duration', 0);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Distanza (km)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={set.distance === 0 ? '' : set.distance || ''}
                          onChange={(e) => updateSet(index, 'distance', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'distance', 0);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Velocità (km/h)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={set.speed === 0 ? '' : set.speed || ''}
                          onChange={(e) => updateSet(index, 'speed', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'speed', 0);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Inclinazione (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={set.incline === 0 ? '' : set.incline || ''}
                          onChange={(e) => updateSet(index, 'incline', Number(e.target.value) || 0)}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              updateSet(index, 'incline', 0);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {sets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aggiungi almeno una serie per completare l'esercizio
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Eventuali note sull'esercizio..."
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Annulla
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!exerciseName.trim() || sets.length === 0}
          >
            Aggiungi Esercizio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}