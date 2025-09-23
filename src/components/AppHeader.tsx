import { Button } from "@/components/ui/button";
import { LogOut, Dumbbell, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { LucideIcon } from "lucide-react";

interface User {
  email: string;
  loggedIn: boolean;
}

interface NavigationTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface AppHeaderProps {
  user: User;
  onSignOut: () => void;
  tabs: NavigationTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AppHeader({ user, onSignOut, tabs, activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between gap-3">
        {/* Logo and branding */}
        <div className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-xl shadow-glow animate-glow-pulse">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              FitTracker Pro 💪
            </h1>
            <p className="text-sm text-muted-foreground font-bold hidden sm:block">
              Your digital gym bestie ✨
            </p>
          </div>
        </div>
        
        {/* User controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* User status indicator */}
          <div className="hidden sm:flex glass p-2 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 bg-success rounded-full pulse-success"></div>
              <span className="text-success text-xs truncate max-w-24">
                {user?.email}
              </span>
            </div>
          </div>
          
          {/* Hamburger Menu */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 h-9 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <DrawerHeader className="text-center pb-4">
                <DrawerTitle className="text-2xl font-black gradient-text">
                  🔥 Navigation Beast 🔥
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="flex-1 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "default" : "outline"}
                        size="lg"
                        onClick={() => onTabChange(tab.id)}
                        className={`
                          flex flex-col gap-3 h-auto py-6 px-4 text-sm font-bold
                          transition-all duration-300 hover:scale-105
                          ${isActive ? 'shadow-glow-lg animate-glow-pulse' : 'hover:bg-primary/5'}
                        `}
                      >
                        <Icon className={`h-8 w-8 ${isActive ? 'animate-bounce' : ''}`} />
                        <span className="font-black text-center leading-tight">
                          {tab.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
                
                {/* Sign out section */}
                <div className="border-t pt-4">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={onSignOut}
                    className="w-full gap-3 py-4 font-bold text-lg hover:scale-105 transition-transform"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out Beast! 👋
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}