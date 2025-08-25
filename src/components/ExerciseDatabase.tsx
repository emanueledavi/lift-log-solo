import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Dumbbell, 
  Heart, 
  Target, 
  Clock, 
  Users,
  Play,
  BookOpen,
  Star
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
}

const exerciseDatabase: Exercise[] = [
  // Strength Exercises
  {
    id: "squat",
    name: "Squat",
    category: "strength",
    targetMuscles: ["Quadricipiti", "Glutei", "Core"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio fondamentale per allenare la parte inferiore del corpo, perfetto per sviluppare forza e stabilità.",
    instructions: [
      "Posizionati con i piedi leggermente più larghi delle spalle",
      "Tieni la schiena dritta e il petto in fuori",
      "Scendi come se ti stessi sedendo su una sedia invisibile",
      "Scendi fino a quando le cosce sono parallele al pavimento",
      "Spingi attraverso i talloni per tornare alla posizione iniziale"
    ],
    tips: [
      "Mantieni le ginocchia allineate con le punte dei piedi",
      "Non permettere alle ginocchia di cedere verso l'interno",
      "Controlla il movimento, non scendere troppo velocemente"
    ]
  },
  {
    id: "push-up",
    name: "Push-up",
    category: "strength",
    targetMuscles: ["Pettorali", "Tricipiti", "Spalle", "Core"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Esercizio completo per la parte superiore del corpo che sviluppa forza funzionale.",
    instructions: [
      "Posizionati in posizione di plank con le mani sotto le spalle",
      "Mantieni il corpo in linea retta dalla testa ai piedi",
      "Scendi controllando il movimento fino a sfiorare il pavimento",
      "Spingi per tornare alla posizione iniziale",
      "Mantieni il core contratto durante tutto il movimento"
    ],
    tips: [
      "Se troppo difficile, inizia dalle ginocchia",
      "Respira in discesa e espira in salita",
      "Mantieni i gomiti a 45° rispetto al corpo"
    ]
  },
  {
    id: "deadlift",
    name: "Stacco da Terra",
    category: "strength",
    targetMuscles: ["Glutei", "Femorali", "Schiena", "Core"],
    difficulty: "intermediate",
    equipment: ["Bilanciere", "Pesi"],
    description: "Movimento fondamentale per sviluppare forza posteriore e migliorare la postura.",
    instructions: [
      "Posizionati con i piedi sotto la barra",
      "Piega le ginocchia e afferra la barra con presa mista",
      "Mantieni la schiena neutra e il petto alto",
      "Solleva la barra mantenendola vicina al corpo",
      "Estendi completamente anche e ginocchia"
    ],
    tips: [
      "Inizia con peso leggero per apprendere la tecnica",
      "Mantieni sempre la schiena neutra",
      "La barra deve rimanere vicina alle gambe"
    ]
  },
  // Cardio Exercises
  {
    id: "running",
    name: "Corsa",
    category: "cardio",
    targetMuscles: ["Gambe", "Core", "Sistema cardiovascolare"],
    difficulty: "beginner",
    equipment: ["Corpo libero"],
    description: "Attività cardiovascolare completa per migliorare resistenza e bruciare calorie.",
    instructions: [
      "Inizia con un riscaldamento di 5-10 minuti di camminata",
      "Mantieni una postura eretta con spalle rilassate",
      "Atterra con la parte centrale del piede",
      "Mantieni un ritmo respiratorio costante",
      "Termina con defaticamento graduale"
    ],
    tips: [
      "Inizia gradualmente se sei principiante",
      "Ascolta il tuo corpo e riposa quando necessario",
      "Investi in buone scarpe da corsa"
    ],
    duration: "20-60 minuti"
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "cardio",
    targetMuscles: ["Tutto il corpo", "Sistema cardiovascolare"],
    difficulty: "advanced",
    equipment: ["Corpo libero"],
    description: "Esercizio ad alta intensità che combina forza e cardio per un allenamento completo.",
    instructions: [
      "Inizia in posizione eretta",
      "Scendi in squat e appoggia le mani a terra",
      "Salta indietro in posizione di plank",
      "Fai un push-up (opzionale)",
      "Salta con i piedi verso le mani e salta in alto"
    ],
    tips: [
      "Mantieni un ritmo costante",
      "Modifica l'esercizio se necessario",
      "Concentrati sulla tecnica anche quando sei stanco"
    ]
  },
  // Flexibility Exercises
  {
    id: "yoga-flow",
    name: "Yoga Flow",
    category: "flexibility",
    targetMuscles: ["Tutto il corpo", "Flessibilità", "Equilibrio"],
    difficulty: "beginner",
    equipment: ["Tappetino"],
    description: "Sequenza fluida di posizioni yoga per migliorare flessibilità e benessere mentale.",
    instructions: [
      "Inizia in posizione del montagna",
      "Passa attraverso saluto al sole",
      "Mantieni ogni posizione per 30-60 secondi",
      "Respira profondamente e lentamente",
      "Termina in posizione di rilassamento"
    ],
    tips: [
      "Non forzare mai le posizioni",
      "Ascolta il tuo corpo",
      "La respirazione è fondamentale"
    ],
    duration: "15-45 minuti"
  }
];

export function ExerciseDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Database Esercizi
        </h1>
        <p className="text-muted-foreground">
          Catalogo completo con istruzioni dettagliate per ogni esercizio
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-0">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca esercizi o muscoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-background/50">
                <TabsTrigger value="all">Tutti</TabsTrigger>
                <TabsTrigger value="strength">Forza</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
                <TabsTrigger value="flexibility">Flessibilità</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <TabsList className="bg-background/50">
                <TabsTrigger value="all">Livelli</TabsTrigger>
                <TabsTrigger value="beginner">Principiante</TabsTrigger>
                <TabsTrigger value="intermediate">Intermedio</TabsTrigger>
                <TabsTrigger value="advanced">Avanzato</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="group hover:shadow-fitness-lg transition-all duration-300 gradient-card border-0 hover:scale-[1.02]">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(exercise.category)}
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {exercise.name}
                  </CardTitle>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty === 'beginner' ? 'Principiante' : 
                   exercise.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzato'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {exercise.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {exercise.description}
              </CardDescription>
              
              {exercise.equipment.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Attrezzatura: {exercise.equipment.join(", ")}</span>
                </div>
              )}
              
              {exercise.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Durata: {exercise.duration}</span>
                </div>
              )}
              
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background/50">
                  <TabsTrigger value="instructions" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Istruzioni
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Consigli
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="mt-3">
                  <ol className="space-y-1 text-sm list-decimal list-inside text-muted-foreground">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-3">
                  <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                    {exercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
              
              {exercise.videoUrl && (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Video dimostrativo disponibile</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="text-center py-12 gradient-card border-0">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun esercizio trovato</h3>
            <p className="text-muted-foreground">
              Prova a modificare i filtri di ricerca per trovare l'esercizio che stai cercando.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}