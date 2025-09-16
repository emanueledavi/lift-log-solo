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

  const workoutVolume = workout.exercises
    .filter(exercise => exercise.type === 'strength')
    .reduce((total, exercise) => 
      total + exercise.sets.reduce((setTotal, set) => setTotal + ((set.weight || 0) * (set.reps || 0)), 0), 0
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
    <div className="relative overflow-hidden rounded-2xl hover-lift animate-scale-in">
      <div 
        className={`glass p-6 rounded-2xl space-y-4 cursor-pointer transition-all duration-300 hover:glass-strong neon-border ${
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
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <p className="font-bold text-foreground text-lg">
                {new Date(workout.date).toLocaleDateString('it-IT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {workout.duration && (
              <div className="flex items-center gap-2">
                <div className="gradient-primary p-1 rounded-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  ⏱️ Durata: {Math.round(workout.duration)} minuti
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="glass p-3 rounded-xl">
              <p className="font-black text-2xl text-primary">{Math.round(workoutVolume)}kg</p>
              <p className="text-sm text-muted-foreground font-bold">{totalSets} serie</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {workout.exercises.map((exercise, idx) => (
            <span 
              key={idx} 
              className="glass px-3 py-2 text-primary text-sm rounded-xl font-semibold hover:scale-105 transition-all animate-scale-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              💪 {exercise.name}
            </span>
          ))}
        </div>

        {workout.notes && (
          <div className="glass p-4 rounded-xl">
            <p className="text-sm text-muted-foreground italic border-l-4 border-primary pl-4 font-medium">
              💭 {workout.notes}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Delete Button */}
      {isSwipeMode && (
        <div className="absolute right-0 top-0 h-full flex items-center animate-slide-in-right">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            className="h-full rounded-l-none px-6 shadow-glow-lg neon-glow"
          >
            <Trash2 className="h-6 w-6" />
            <span className="font-bold">Elimina</span>
          </Button>
        </div>
      )}
    </div>
  );
}