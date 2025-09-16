import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "./Dashboard";
import { WorkoutLog } from "./WorkoutLog";
import { WorkoutPlansComponent } from "./WorkoutPlans";
import { Progress } from "./Progress";
import { CalorieCalculator } from "./CalorieCalculator";
import { RestTimer } from "./RestTimer";
import { ExerciseDatabase } from "./ExerciseDatabase";
import { Achievements } from "./Achievements";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator, 
  Timer,
  Dumbbell,
  Database,
  Trophy
} from "lucide-react";

export function FitnessApp() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      component: Dashboard
    },
    {
      id: "workout-log",
      label: "Diario",
      icon: BookOpen,
      component: WorkoutLog
    },
    {
      id: "exercises",
      label: "Esercizi",
      icon: Database,
      component: ExerciseDatabase
    },
    {
      id: "workout-plans",
      label: "Schede",
      icon: Target,
      component: WorkoutPlansComponent
    },
    {
      id: "progress",
      label: "Progressi",
      icon: TrendingUp,
      component: Progress
    },
    {
      id: "achievements",
      label: "Traguardi",
      icon: Trophy,
      component: Achievements
    },
    {
      id: "calories",
      label: "Calorie",
      icon: Calculator,
      component: CalorieCalculator
    },
    {
      id: "timer",
      label: "Timer",
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
                <p className="text-sm text-muted-foreground hidden sm:block">La tua palestra digitale personalizzata</p>
              </div>
            </div>
            <div className="glass p-2 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Layout */}
      <main className="container mx-auto px-3 py-6 pb-24 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Modern Navigation Tabs */}
          <div className="glass-strong p-2 rounded-2xl shadow-fitness-lg">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-0 bg-transparent gap-1">
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