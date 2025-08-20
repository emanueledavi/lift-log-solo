import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "./Dashboard";
import { WorkoutLog } from "./WorkoutLog";
import { WorkoutPlansComponent } from "./WorkoutPlans";
import { Progress } from "./Progress";
import { CalorieCalculator } from "./CalorieCalculator";
import { RestTimer } from "./RestTimer";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calculator, 
  Timer,
  Dumbbell
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FitTracker</h1>
              <p className="text-sm text-muted-foreground">Il tuo compagno di allenamento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-card border shadow-fitness">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-2 py-3 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:bg-accent"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs font-medium hidden sm:block">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            FitTracker - La tua app fitness personale
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tutti i dati sono salvati localmente nel tuo browser
          </p>
        </div>
      </footer>
    </div>
  );
}