import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { BottomNavigation } from "./BottomNavigation";
import { TabContent } from "./TabContent";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { useToast } from "@/hooks/use-toast";
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

interface User {
  email: string;
  loggedIn: boolean;
}

export function FitnessApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authentication check with improved error handling
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stored = localStorage.getItem('fitapp_user');
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.loggedIn && userData.email) {
          setUser(userData);
        } else {
          throw new Error('Dati utente non validi');
        }
      } else {
        navigate("/auth");
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Errore nel caricamento dei dati utente');
      localStorage.removeItem('fitapp_user');
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Improved sign out with confirmation
  const handleSignOut = useCallback(() => {
    try {
      localStorage.removeItem('fitapp_user');
      setUser(null);
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
  }, [navigate, toast]);

  // Tab change with smooth transition
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg font-semibold">{error}</div>
          <button 
            onClick={checkAuth}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
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
        <AppHeader user={user} onSignOut={handleSignOut} />

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 pb-32 relative z-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <TabContent activeTab={activeTab} />
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </ErrorBoundary>
  );
}