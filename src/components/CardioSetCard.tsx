import { useState } from "react";
import { Set } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, MapPin, Zap, TrendingUp } from "lucide-react";

interface CardioSetCardProps {
  set: Set;
  setIndex: number;
  onEdit: (setId: string) => void;
  onDelete: (setId: string) => void;
}

export function CardioSetCard({ set, setIndex, onEdit, onDelete }: CardioSetCardProps) {
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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
    
    if (deltaX > 50) {
      setIsSwipeMode(true);
    } else if (deltaX < 20) {
      setIsSwipeMode(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaX = startX - currentX;
    
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(set.id);
    setIsSwipeMode(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(set.id);
    setIsSwipeMode(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div 
        className={`p-3 bg-accent/20 rounded-lg transition-transform duration-200 ${
          isSwipeMode ? '-translate-x-24' : 'translate-x-0'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Serie {setIndex + 1}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {set.duration && set.duration > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                <span className="font-medium">{set.duration}min</span>
              </div>
            )}
            
            {set.distance && set.distance > 0 && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-secondary" />
                <span className="font-medium">{set.distance}km</span>
              </div>
            )}
            
            {set.speed && set.speed > 0 && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-accent-foreground" />
                <span className="font-medium">{set.speed}km/h</span>
              </div>
            )}
            
            {set.incline && set.incline > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-warning" />
                <span className="font-medium">{set.incline}%</span>
              </div>
            )}
          </div>

          {set.calories && set.calories > 0 && (
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{set.calories} cal</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - appear on swipe */}
      {isSwipeMode && (
        <div className="absolute right-0 top-0 h-full flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-full rounded-l-none rounded-r-none px-3 border-r-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-full rounded-l-none px-3"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}