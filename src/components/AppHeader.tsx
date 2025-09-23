import { Button } from "@/components/ui/button";
import { LogOut, Dumbbell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface User {
  email: string;
  loggedIn: boolean;
}

interface AppHeaderProps {
  user: User;
  onSignOut: () => void;
}

export function AppHeader({ user, onSignOut }: AppHeaderProps) {
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
          
          {/* Sign out button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="gap-2 h-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}