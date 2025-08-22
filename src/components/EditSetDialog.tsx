import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Set } from "@/types/fitness";

interface EditSetDialogProps {
  set: Set | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (setId: string, updates: Partial<Set>) => void;
}

export function EditSetDialog({ set, isOpen, onClose, onSave }: EditSetDialogProps) {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [incline, setIncline] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    if (set) {
      setWeight(set.weight || 0);
      setReps(set.reps || 0);
      setDuration(set.duration || 0);
      setDistance(set.distance || 0);
      setSpeed(set.speed || 0);
      setIncline(set.incline || 0);
      setCalories(set.calories || 0);
    }
  }, [set]);

  const handleSave = () => {
    if (!set) return;

    const updates: Partial<Set> = set.type === 'strength' 
      ? { weight: weight > 0 ? weight : undefined, reps: reps > 0 ? reps : undefined }
      : { 
          duration: duration > 0 ? duration : undefined,
          distance: distance > 0 ? distance : undefined,
          speed: speed > 0 ? speed : undefined,
          incline: incline > 0 ? incline : undefined
        };

    onSave(set.id, updates);
    onClose();
  };

  if (!set) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Modifica Serie {set.type === 'cardio' ? 'Cardio' : 'Forza'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {set.type === 'strength' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight === 0 ? '' : weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setWeight(0);
                    }
                  }}
                  placeholder="Inserisci il peso"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reps">Ripetizioni</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps === 0 ? '' : reps}
                  onChange={(e) => setReps(Number(e.target.value) || 0)}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setReps(0);
                    }
                  }}
                  placeholder="Inserisci le ripetizioni"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Durata (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration === 0 ? '' : duration}
                    onChange={(e) => setDuration(Number(e.target.value) || 0)}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setDuration(0);
                      }
                    }}
                    placeholder="Durata"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="distance">Distanza (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={distance === 0 ? '' : distance}
                    onChange={(e) => setDistance(Number(e.target.value) || 0)}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setDistance(0);
                      }
                    }}
                    placeholder="Distanza"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="speed">Velocità (km/h)</Label>
                  <Input
                    id="speed"
                    type="number"
                    step="0.1"
                    value={speed === 0 ? '' : speed}
                    onChange={(e) => setSpeed(Number(e.target.value) || 0)}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setSpeed(0);
                      }
                    }}
                    placeholder="Velocità"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="incline">Inclinazione (%)</Label>
                  <Input
                    id="incline"
                    type="number"
                    step="0.1"
                    value={incline === 0 ? '' : incline}
                    onChange={(e) => setIncline(Number(e.target.value) || 0)}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setIncline(0);
                      }
                    }}
                    placeholder="Inclinazione"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva Modifiche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}