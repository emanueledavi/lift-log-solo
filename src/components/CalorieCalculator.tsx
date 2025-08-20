import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CalorieCalculation } from "@/types/fitness";
import { Calculator, Flame, Clock, Weight, Activity } from "lucide-react";

const ACTIVITY_TYPES = [
  { 
    value: 'strength', 
    label: 'Allenamento di Forza',
    met: 6.0, // MET value for strength training
    description: 'Pesi, macchine, bodyweight'
  },
  { 
    value: 'cardio', 
    label: 'Allenamento Cardio',
    met: 8.0, // MET value for general cardio
    description: 'Corsa, cyclette, ellittica'
  },
  { 
    value: 'mixed', 
    label: 'Allenamento Misto',
    met: 7.0, // MET value for mixed training
    description: 'Circuiti, CrossFit, HIIT'
  }
];

export function CalorieCalculator() {
  const [calculations, setCalculations] = useLocalStorage<CalorieCalculation[]>('fitness-calorie-calculations', []);
  
  const [weight, setWeight] = useState<number>(70);
  const [duration, setDuration] = useState<number>(60);
  const [activityType, setActivityType] = useState<'strength' | 'cardio' | 'mixed'>('strength');
  const [result, setResult] = useState<number | null>(null);

  const calculateCalories = () => {
    const activity = ACTIVITY_TYPES.find(a => a.value === activityType);
    if (!activity) return;

    // Formula: Calories = MET × weight (kg) × time (hours)
    const hours = duration / 60;
    const caloriesBurned = Math.round(activity.met * weight * hours);
    
    setResult(caloriesBurned);

    // Save calculation
    const calculation: CalorieCalculation = {
      weight,
      duration,
      activityType,
      caloriesBurned
    };

    setCalculations(prev => [calculation, ...prev.slice(0, 9)]); // Keep last 10 calculations
  };

  const clearHistory = () => {
    setCalculations([]);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calcolatore Calorie</h1>
        <p className="text-muted-foreground">Stima le calorie bruciate durante l'allenamento</p>
      </div>

      {/* Calculator */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Calcola Calorie Bruciate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Weight className="h-4 w-4 mr-2 text-muted-foreground" />
                Peso Corporeo (kg)
              </Label>
              <Input
                type="number"
                min="40"
                max="200"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 70)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                Durata Allenamento (minuti)
              </Label>
              <Input
                type="number"
                min="1"
                max="300"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="text-lg"
              />
            </div>
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              Tipo di Allenamento
            </Label>
            <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
              <SelectTrigger className="text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map(activity => (
                  <SelectItem key={activity.value} value={activity.value}>
                    <div>
                      <div className="font-medium">{activity.label}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Duration Buttons */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Durate Comuni:</Label>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 75, 90, 120].map(minutes => (
                <Button
                  key={minutes}
                  variant={duration === minutes ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(minutes)}
                >
                  {minutes}min
                </Button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateCalories}
            className="w-full gradient-primary text-primary-foreground font-medium"
            size="lg"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calcola Calorie
          </Button>

          {/* Result */}
          {result !== null && (
            <div className="mt-6 p-6 bg-gradient-primary rounded-lg text-center text-white">
              <div className="flex justify-center items-center mb-2">
                <Flame className="h-8 w-8 mr-2" />
                <span className="text-3xl font-bold">{result}</span>
                <span className="text-lg ml-2">kcal</span>
              </div>
              <p className="text-primary-foreground/90">
                Calorie stimate bruciate in {duration} minuti di {ACTIVITY_TYPES.find(a => a.value === activityType)?.label.toLowerCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle>Come Funziona il Calcolo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Il calcolo si basa sui valori MET (Metabolic Equivalent of Task), che rappresentano 
            l'intensità metabolica di diverse attività fisiche.
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium">Allenamento di Forza</p>
                <p className="text-sm text-muted-foreground">Pesi, macchine, bodyweight</p>
              </div>
              <span className="font-bold text-primary">6.0 MET</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium">Allenamento Cardio</p>
                <p className="text-sm text-muted-foreground">Corsa, cyclette, ellittica</p>
              </div>
              <span className="font-bold text-secondary">8.0 MET</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium">Allenamento Misto</p>
                <p className="text-sm text-muted-foreground">Circuiti, CrossFit, HIIT</p>
              </div>
              <span className="font-bold text-accent-foreground">7.0 MET</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Formula utilizzata:</p>
            <p className="text-sm text-muted-foreground font-mono">
              Calorie = MET × Peso (kg) × Tempo (ore)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      {calculations.length > 0 && (
        <Card className="gradient-card border-0 shadow-fitness">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cronologia Calcoli</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive"
              >
                Cancella Cronologia
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calculations.map((calc, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{calc.caloriesBurned}</p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {ACTIVITY_TYPES.find(a => a.value === calc.activityType)?.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {calc.weight}kg • {calc.duration}min
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}