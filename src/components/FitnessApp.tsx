import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft"></div>
        </div>

        {/* Mobile-First Sidebar */}
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Mobile Header */}
          <header className="sticky top-0 z-50 glass-strong border-b border-border/50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="lg:hidden p-2">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div className="flex items-center gap-2">
                  <div className="gradient-primary p-2 rounded-xl shadow-glow">
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-bold text-foreground tracking-tight">FitTracker Pro</h1>
                    <p className="text-xs text-muted-foreground">La tua palestra digitale</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="hidden sm:flex glass p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-success text-xs truncate max-w-24">{user?.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2 h-9"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Esci</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Mobile Content */}
          <main className="flex-1 px-4 py-4 pb-20 relative z-10 overflow-y-auto">
            <div className="space-y-4">
              {/* Active Tab Content */}
              <div className="animate-fade-in">
                {(() => {
                  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
                  return ActiveComponent ? <ActiveComponent /> : null;
                })()}
              </div>
            </div>
          </main>

          {/* Mobile Bottom Navigation - Hidden on larger screens */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 px-4 py-2">
            <div className="flex items-center justify-center">
              <SidebarTrigger className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}