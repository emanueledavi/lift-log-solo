import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { exerciseDatabase } from './ExerciseDatabase';
import { Dumbbell, Heart, Target, Users, BookOpen } from 'lucide-react';

interface ExerciseAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ExerciseAutocomplete({ value, onChange, placeholder }: ExerciseAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState(exerciseDatabase.slice(0, 10));
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const filtered = exerciseDatabase
        .filter(exercise => 
          exercise.name.toLowerCase().includes(value.toLowerCase()) ||
          exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(value.toLowerCase()))
        )
        .slice(0, 8);
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exerciseDatabase.slice(0, 8));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="h-3 w-3" />;
      case 'cardio': return <Heart className="h-3 w-3" />;
      case 'flexibility': return <Target className="h-3 w-3" />;
      case 'functional': return <Users className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleExerciseSelect = (exerciseName: string) => {
    onChange(exerciseName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full"
      />
      
      {isOpen && (
        <Card 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto bg-background border shadow-lg"
        >
          {filteredExercises.length > 0 ? (
            <div className="p-1">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-3 hover:bg-accent cursor-pointer rounded-md transition-colors"
                  onClick={() => handleExerciseSelect(exercise.name)}
                >
                  <div className="flex items-start gap-2">
                    {getCategoryIcon(exercise.category)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {exercise.name}
                        </span>
                        <Badge 
                          className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}
                        >
                          {exercise.difficulty === 'beginner' ? 'P' : 
                           exercise.difficulty === 'intermediate' ? 'I' : 'A'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.slice(0, 2).map((muscle) => (
                          <Badge key={muscle} variant="secondary" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                        {exercise.targetMuscles.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{exercise.targetMuscles.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nessun esercizio trovato
            </div>
          )}
        </Card>
      )}
    </div>
  );
}