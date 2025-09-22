import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavigationTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavigationProps {
  tabs: NavigationTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNavigation({ tabs, activeTab, onTabChange }: BottomNavigationProps) {
  // Split tabs into two rows for better mobile experience
  const primaryTabs = tabs.slice(0, 5);
  const secondaryTabs = tabs.slice(5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 px-2 py-3 safe-area-bottom">
      {/* Primary row - most important tabs */}
      <div className="grid grid-cols-5 gap-1">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col gap-1 h-auto py-2 px-1 text-xs 
                transition-all duration-200 touch-manipulation
                ${isActive ? 'shadow-glow' : 'hover:bg-muted/50'}
              `}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'animate-bounce-in' : ''}`} />
              <span className="truncate leading-tight font-medium">
                {tab.label.split(' ')[0]}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Secondary row - additional tabs */}
      {secondaryTabs.length > 0 && (
        <div className="grid grid-cols-4 gap-1 mt-2">
          {secondaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col gap-1 h-auto py-2 px-1 text-xs 
                  transition-all duration-200 touch-manipulation
                  ${isActive ? 'shadow-glow' : 'hover:bg-muted/50'}
                `}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'animate-bounce-in' : ''}`} />
                <span className="truncate leading-tight font-medium">
                  {tab.label.split(' ')[0]}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}