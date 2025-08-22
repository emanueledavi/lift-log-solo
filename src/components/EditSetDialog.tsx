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
  onSave: (setId: string, weight: number, reps: number) => void;
}

export function EditSetDialog({ set, isOpen, onClose, onSave }: EditSetDialogProps) {
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  useEffect(() => {
    if (set) {
      setWeight(set.weight);
      setReps(set.reps);
    }
  }, [set]);

  const handleSave = () => {
    if (set && weight > 0 && reps > 0) {
      onSave(set.id, weight, reps);
      onClose();
    }
  };

  if (!set) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifica Serie</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="Inserisci il peso"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reps">Ripetizioni</Label>
            <Input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              placeholder="Inserisci le ripetizioni"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={weight <= 0 || reps <= 0}>
            Salva Modifiche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}