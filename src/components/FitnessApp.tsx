import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { TabContent } from "./TabContent";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator, 
  Timer,
  Database,
  Trophy,
  Crosshair
} from "lucide-react";

export function FitnessApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  // Improved sign out with confirmation
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast({
        title: "Disconnesso",
        description: "Sei stato disconnesso con successo.",
      });
      navigate("/auth");
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Errore",
        description: "Errore durante la disconnessione.",
        variant: "destructive",
      });
    }
  }, [signOut, navigate, toast]);

  // Tab change with smooth transition
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Navigation tabs configuration
  const tabs = [
    {
      id: "dashboard",
      label: "Home 🏠",
      icon: LayoutDashboard,
    },
    {
      id: "workout-log",
      label: "My Workouts 💪", 
      icon: BookOpen,
    },
    {
      id: "exercises",
      label: "Exercise Hub 🎯",
      icon: Database,
    },
    {
      id: "workout-plans",
      label: "My Plans 📋",
      icon: Target,
    },
    {
      id: "goals",
      label: "Goals 🎯",
      icon: Crosshair,
    },
    {
      id: "gamification",
      label: "Beast Mode 🚀",
      icon: Trophy,
    },
    {
      id: "progress",
      label: "Progress 📈",
      icon: TrendingUp,
    },
    {
      id: "achievements",
      label: "Achievements 🏆",
      icon: Trophy,
    },
    {
      id: "calories",
      label: "Calories 🔥",
      icon: Calculator,
    },
    {
      id: "timer",
      label: "Timer ⏱️",
      icon: Timer,
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner message="Caricamento FitTracker Pro..." size="lg" />
      </div>
    );
  }

  // User not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to auth
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full flex flex-col bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft"></div>
        </div>

        {/* Header */}
        <AppHeader 
          user={user} 
          onSignOut={handleSignOut} 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 pb-8 relative z-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <TabContent activeTab={activeTab} />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}