import { useState } from "react";
import { Workout } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutHistoryCardProps {
  workout: Workout;
  onDelete: (workoutId: string) => void;
}

export function WorkoutHistoryCard({ workout, onDelete }: WorkoutHistoryCardProps) {
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const workoutVolume = workout.exercises.reduce((total, exercise) => 
    total + exercise.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0), 0
  );
  const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setCurrentX(touch.clientX);
    
    const deltaX = startX - touch.clientX;
    
    // Show delete button when swiping left (deltaX > 50)
    if (deltaX > 50) {
      setIsSwipeMode(true);
    } else if (deltaX < 20) {
      setIsSwipeMode(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaX = startX - currentX;
    
    // If swipe is less than 50px, reset to normal mode
    if (deltaX < 50) {
      setIsSwipeMode(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setCurrentX(e.clientX);
    const deltaX = startX - e.clientX;
    
    if (deltaX > 50) {
      setIsSwipeMode(true);
    } else if (deltaX < 20) {
      setIsSwipeMode(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const deltaX = startX - currentX;
    
    if (deltaX < 50) {
      setIsSwipeMode(false);
    }
  };

  const handleClick = () => {
    if (!isSwipeMode && !isDragging) {
      navigate(`/workout/${workout.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(workout.id);
    setIsSwipeMode(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div 
        className={`p-4 bg-accent/20 rounded-lg space-y-2 cursor-pointer transition-transform duration-200 ${
          isSwipeMode ? '-translate-x-20' : 'translate-x-0'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-foreground">
              {new Date(workout.date).toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {workout.duration && (
              <p className="text-sm text-muted-foreground">
                Durata: {Math.round(workout.duration)} minuti
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{Math.round(workoutVolume)}kg</p>
            <p className="text-sm text-muted-foreground">{totalSets} serie</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {workout.exercises.map((exercise, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md font-medium"
            >
              {exercise.name}
            </span>
          ))}
        </div>

        {workout.notes && (
          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
            {workout.notes}
          </p>
        )}
      </div>

      {/* Delete Button - appears on swipe */}
      {isSwipeMode && (
        <div className="absolute right-0 top-0 h-full flex items-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-full rounded-l-none px-4"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}