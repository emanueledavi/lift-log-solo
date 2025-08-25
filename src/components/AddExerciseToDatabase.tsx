import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

interface CustomExercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'functional';
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  description: string;
  instructions: string[];
  tips: string[];
  isCustom: true;
}

export function AddExerciseToDatabase() {
  const [customExercises, setCustomExercises] = useLocalStorage<CustomExercise[]>("customExercises", []);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "" as 'strength' | 'cardio' | 'flexibility' | 'functional',
    difficulty: "" as 'beginner' | 'intermediate' | 'advanced',
    description: "",
    targetMuscles: [] as string[],
    equipment: [] as string[],
    instructions: [""],
    tips: [""]
  });
  const [currentMuscle, setCurrentMuscle] = useState("");
  const [currentEquipment, setCurrentEquipment] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      category: "" as 'strength' | 'cardio' | 'flexibility' | 'functional',
      difficulty: "" as 'beginner' | 'intermediate' | 'advanced',
      description: "",
      targetMuscles: [],
      equipment: [],
      instructions: [""],
      tips: [""]
    });
    setCurrentMuscle("");
    setCurrentEquipment("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.difficulty) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    const newExercise: CustomExercise = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      targetMuscles: formData.targetMuscles,
      difficulty: formData.difficulty,
      equipment: formData.equipment,
      description: formData.description,
      instructions: formData.instructions.filter(i => i.trim() !== ""),
      tips: formData.tips.filter(t => t.trim() !== ""),
      isCustom: true
    };

    setCustomExercises([...customExercises, newExercise]);
    toast.success(`Esercizio "${formData.name}" aggiunto al database!`);
    resetForm();
    setOpen(false);
  };

  const addMuscle = () => {
    if (currentMuscle && !formData.targetMuscles.includes(currentMuscle)) {
      setFormData({
        ...formData,
        targetMuscles: [...formData.targetMuscles, currentMuscle]
      });
      setCurrentMuscle("");
    }
  };

  const removeMuscle = (muscle: string) => {
    setFormData({
      ...formData,
      targetMuscles: formData.targetMuscles.filter(m => m !== muscle)
    });
  };

  const addEquipment = () => {
    if (currentEquipment && !formData.equipment.includes(currentEquipment)) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, currentEquipment]
      });
      setCurrentEquipment("");
    }
  };

  const removeEquipment = (equipment: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter(e => e !== equipment)
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ""]
    });
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData({
        ...formData,
        instructions: formData.instructions.filter((_, i) => i !== index)
      });
    }
  };

  const updateTip = (index: number, value: string) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData({ ...formData, tips: newTips });
  };

  const addTip = () => {
    setFormData({
      ...formData,
      tips: [...formData.tips, ""]
    });
  };

  const removeTip = (index: number) => {
    if (formData.tips.length > 1) {
      setFormData({
        ...formData,
        tips: formData.tips.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Esercizio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto gradient-card border-0">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-primary bg-clip-text text-transparent">
            Aggiungi Nuovo Esercizio
          </DialogTitle>
          <DialogDescription>
            Crea un nuovo esercizio personalizzato per il tuo database
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Esercizio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="es. Squat bulgaro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Forza</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flessibilità</SelectItem>
                  <SelectItem value="functional">Funzionale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty and Description */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficoltà *</Label>
              <Select value={formData.difficulty} onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona difficoltà" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descrizione dell'esercizio..."
                rows={3}
              />
            </div>
          </div>

          {/* Target Muscles */}
          <div className="space-y-2">
            <Label>Muscoli Target</Label>
            <div className="flex gap-2">
              <Input
                value={currentMuscle}
                onChange={(e) => setCurrentMuscle(e.target.value)}
                placeholder="es. Quadricipiti"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMuscle())}
              />
              <Button type="button" onClick={addMuscle} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.targetMuscles.map((muscle) => (
                <Badge key={muscle} variant="secondary" className="flex items-center gap-1">
                  {muscle}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeMuscle(muscle)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label>Attrezzatura</Label>
            <div className="flex gap-2">
              <Input
                value={currentEquipment}
                onChange={(e) => setCurrentEquipment(e.target.value)}
                placeholder="es. Bilanciere"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
              />
              <Button type="button" onClick={addEquipment} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.equipment.map((equipment) => (
                <Badge key={equipment} variant="outline" className="flex items-center gap-1">
                  {equipment}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeEquipment(equipment)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label>Istruzioni</Label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Istruzione ${index + 1}`}
                />
                {formData.instructions.length > 1 && (
                  <Button type="button" onClick={() => removeInstruction(index)} size="sm" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addInstruction} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Istruzione
            </Button>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <Label>Consigli</Label>
            {formData.tips.map((tip, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={tip}
                  onChange={(e) => updateTip(index, e.target.value)}
                  placeholder={`Consiglio ${index + 1}`}
                />
                {formData.tips.length > 1 && (
                  <Button type="button" onClick={() => removeTip(index)} size="sm" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={addTip} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Consiglio
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" className="gradient-primary text-white border-0">
              Salva Esercizio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}