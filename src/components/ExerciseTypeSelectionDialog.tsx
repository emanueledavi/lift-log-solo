import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Heart } from "lucide-react";

interface ExerciseTypeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'strength' | 'cardio') => void;
}

export function ExerciseTypeSelectionDialog({ isOpen, onClose, onSelectType }: ExerciseTypeSelectionDialogProps) {
  const handleSelectType = (type: 'strength' | 'cardio') => {
    onSelectType(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Seleziona Tipo di Esercizio</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleSelectType('strength')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Forza/Pesi</h3>
                <p className="text-sm text-muted-foreground">
                  Esercizi con pesi, ripetizioni e serie
                </p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleSelectType('cardio')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="bg-red-500/10 p-3 rounded-full">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Cardio</h3>
                <p className="text-sm text-muted-foreground">
                  Tapis roulant, corsa, bici, ecc.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}