import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { exerciseDatabase } from "./ExerciseDatabase";
import { 
  Search, 
  Dumbbell, 
  Heart, 
  Target, 
  Users,
  BookOpen,
  Check,
  Plus
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'functional';
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  description: string;
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  duration?: string;
  isCustom?: boolean;
}

interface ExerciseSelectorProps {
  onExerciseSelect: (exercise: Exercise) => void;
  exerciseType?: 'strength' | 'cardio';
}

export function ExerciseSelector({ onExerciseSelect, exerciseType }: ExerciseSelectorProps) {
  const [customExercises] = useLocalStorage<Exercise[]>("customExercises", []);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customExerciseName, setCustomExerciseName] = useState("");

  // Combine exercises from database with custom exercises
  const allExercises = [...exerciseDatabase, ...customExercises];

  // Filter exercises based on search term and exercise type if specified
  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !exerciseType || exercise.category === exerciseType;
    
    return matchesSearch && matchesType;
  });

  const handleExerciseSelect = (exercise: Exercise) => {
    onExerciseSelect(exercise);
    setOpen(false);
    setSearchTerm("");
  };

  const handleCustomExercise = () => {
    if (!customExerciseName.trim()) return;

    const customExercise: Exercise = {
      id: `custom_${Date.now()}`,
      name: customExerciseName,
      category: exerciseType || 'strength',
      targetMuscles: [],
      difficulty: 'beginner',
      equipment: [],
      description: `Esercizio personalizzato: ${customExerciseName}`,
      instructions: [],
      tips: [],
      isCustom: true
    };

    onExerciseSelect(customExercise);
    setOpen(false);
    setCustomExerciseName("");
    setSearchTerm("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="h-4 w-4" />;
      case 'cardio': return <Heart className="h-4 w-4" />;
      case 'flexibility': return <Target className="h-4 w-4" />;
      case 'functional': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="justify-start text-muted-foreground hover:text-foreground">
          <Search className="h-4 w-4 mr-2" />
          Seleziona dal database...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden gradient-card border-0">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-primary bg-clip-text text-transparent">
            Seleziona Esercizio
          </DialogTitle>
          <DialogDescription>
            Scegli un esercizio dal database o crea uno personalizzato
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca esercizi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Custom Exercise Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Oppure scrivi il nome di un nuovo esercizio..."
              value={customExerciseName}
              onChange={(e) => setCustomExerciseName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomExercise()}
            />
            <Button 
              onClick={handleCustomExercise} 
              disabled={!customExerciseName.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Exercise List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <Card 
                  key={exercise.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(exercise.category)}
                          <h4 className="font-semibold text-foreground">{exercise.name}</h4>
                          {exercise.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              Personalizzato
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {exercise.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {exercise.targetMuscles.slice(0, 3).map((muscle) => (
                            <Badge key={muscle} variant="secondary" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                          {exercise.targetMuscles.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{exercise.targetMuscles.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getDifficultyColor(exercise.difficulty)}>
                          {exercise.difficulty === 'beginner' ? 'Principiante' : 
                           exercise.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                        </Badge>
                        <Check className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 
                    "Nessun esercizio trovato. Prova a scrivere il nome sopra per crearne uno nuovo." :
                    "Inizia a digitare per cercare esercizi"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}