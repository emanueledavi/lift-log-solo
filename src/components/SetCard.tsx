import { useState } from "react";
import { Set } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface SetCardProps {
  set: Set;
  setIndex: number;
  onEdit: (setId: string) => void;
  onDelete: (setId: string) => void;
}

export function SetCard({ set, setIndex, onEdit, onDelete }: SetCardProps) {
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
    
    // Show action buttons when swiping left (deltaX > 50)
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
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Serie {setIndex + 1}</p>
          <p className="text-lg font-bold text-primary">{set.weight}kg</p>
          <p className="text-sm text-muted-foreground">x {set.reps}</p>
          <p className="text-xs text-accent-foreground">
            Vol: {set.weight * set.reps}kg
          </p>
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