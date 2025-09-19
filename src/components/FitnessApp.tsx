import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { WorkoutLog } from "./WorkoutLog";
import { WorkoutPlansComponent } from "./WorkoutPlans";
import { Progress } from "./Progress";
import { CalorieCalculator } from "./CalorieCalculator";
import { RestTimer } from "./RestTimer";
import { ExerciseDatabase } from "./ExerciseDatabase";
import { Achievements } from "./Achievements";
import { Goals } from "./Goals";
import { ThemeToggle } from "./ThemeToggle";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator, 
  Timer,
  Dumbbell,
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing user session
    const checkAuth = () => {
      const stored = localStorage.getItem('fitapp_user');
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          if (userData.loggedIn) {
            setUser(userData);
          } else {
            navigate("/auth");
          }
        } catch (error) {
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('fitapp_user');
    setUser(null);
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Centro di Controllo",
      icon: LayoutDashboard,
      component: Dashboard
    },
    {
      id: "workout-log",
      label: "Diario Allenamenti",
      icon: BookOpen,
      component: WorkoutLog
    },
    {
      id: "exercises",
      label: "Database Esercizi",
      icon: Database,
      component: ExerciseDatabase
    },
    {
      id: "workout-plans",
      label: "Le Tue Schede",
      icon: Target,
      component: WorkoutPlansComponent
    },
    {
      id: "goals",
      label: "I Tuoi Obiettivi",
      icon: Crosshair,
      component: Goals
    },
    {
      id: "progress",
      label: "Analisi Progressi",
      icon: TrendingUp,
      component: Progress
    },
    {
      id: "achievements",
      label: "Hall of Fame",
      icon: Trophy,
      component: Achievements
    },
    {
      id: "calories",
      label: "Calc. Calorie",
      icon: Calculator,
      component: CalorieCalculator
    },
    {
      id: "timer",
      label: "Timer Riposo",
      icon: Timer,
      component: RestTimer
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft"></div>
      </div>

      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="gradient-primary p-3 rounded-2xl shadow-glow animate-glow-pulse">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">FitTracker Pro</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">La tua palestra digitale intelligente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="glass p-2 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-success">{user?.email}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Layout */}
      <main className="container mx-auto px-3 py-6 pb-24 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Modern Navigation Tabs */}
          <div className="glass-strong p-2 rounded-2xl shadow-fitness-lg">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 h-auto p-0 bg-transparent gap-1">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl transition-all duration-300 
                           data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                           data-[state=active]:shadow-glow data-[state=active]:scale-105
                           hover:bg-accent hover:scale-102 hover:shadow-md
                           min-h-[70px] touch-manipulation group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <tab.icon className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold leading-tight text-center">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Enhanced Tab Content */}
          <div className="relative">
            {tabs.map((tab, index) => (
              <TabsContent 
                key={tab.id} 
                value={tab.id} 
                className="space-y-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <tab.component />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </main>

      {/* Enhanced Footer */}
      <footer className="glass-strong border-t border-border/50 mt-12 relative z-10">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <p className="text-lg font-bold text-foreground">FitTracker Pro</p>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            La tua app fitness intelligente e moderna
          </p>
          <p className="text-xs text-muted-foreground">
            🔒 Tutti i dati sono crittografati e salvati localmente
          </p>
        </div>
      </footer>
    </div>
  );
}