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
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t-2 border-primary/30 px-2 py-4 safe-area-bottom shadow-glow-lg">
      {/* Primary row - most important tabs */}
      <div className="grid grid-cols-5 gap-2 mb-3">
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
                flex flex-col gap-1 h-auto py-3 px-2 text-xs font-bold
                transition-all duration-300 touch-manipulation
                ${isActive ? 'shadow-glow-lg scale-105' : 'hover:bg-muted/50 hover:scale-102'}
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-in' : ''}`} />
              <span className="truncate leading-tight font-black text-xs">
                {tab.label.split(' ')[0]}
              </span>
            </Button>
          );
        })}
      </div>
      
      {/* Secondary row - additional tabs */}
      {secondaryTabs.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
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
                  flex flex-col gap-1 h-auto py-3 px-2 text-xs font-bold
                  transition-all duration-300 touch-manipulation
                  ${isActive ? 'shadow-glow-lg scale-105' : 'hover:bg-muted/50 hover:scale-102'}
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'animate-bounce-in' : ''}`} />
                <span className="truncate leading-tight font-black text-xs">
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