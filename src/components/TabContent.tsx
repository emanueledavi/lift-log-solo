import { Suspense, lazy, ComponentType } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./Dashboard").then(m => ({ default: m.Dashboard })));
const WorkoutLog = lazy(() => import("./WorkoutLog").then(m => ({ default: m.WorkoutLog })));
const WorkoutPlansComponent = lazy(() => import("./WorkoutPlans").then(m => ({ default: m.WorkoutPlansComponent })));
const Progress = lazy(() => import("./Progress").then(m => ({ default: m.Progress })));
const CalorieCalculator = lazy(() => import("./CalorieCalculator").then(m => ({ default: m.CalorieCalculator })));
const RestTimer = lazy(() => import("./RestTimer").then(m => ({ default: m.RestTimer })));
const ExerciseDatabase = lazy(() => import("./ExerciseDatabase").then(m => ({ default: m.ExerciseDatabase })));
const Achievements = lazy(() => import("./Achievements").then(m => ({ default: m.Achievements })));
const Goals = lazy(() => import("./Goals").then(m => ({ default: m.Goals })));
const Gamification = lazy(() => import("./Gamification").then(m => ({ default: m.Gamification })));

interface TabContentProps {
  activeTab: string;
}

// Component mapping with lazy loading
const componentMap: Record<string, ComponentType> = {
  "dashboard": Dashboard,
  "workout-log": WorkoutLog,
  "exercises": ExerciseDatabase,
  "workout-plans": WorkoutPlansComponent,
  "goals": Goals,
  "gamification": Gamification,
  "progress": Progress,
  "achievements": Achievements,
  "calories": CalorieCalculator,
  "timer": RestTimer,
};

function ComponentNotFound({ tabId }: { tabId: string }) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-warning/10">
          <AlertCircle className="h-6 w-6 text-warning" />
        </div>
        <CardTitle>Sezione non trovata</CardTitle>
        <CardDescription>
          La sezione "{tabId}" non è ancora disponibile o è in manutenzione.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">
        Prova a selezionare un'altra sezione dal menu.
      </CardContent>
    </Card>
  );
}

export function TabContent({ activeTab }: TabContentProps) {
  const Component = componentMap[activeTab];

  if (!Component) {
    return <ComponentNotFound tabId={activeTab} />;
  }

  return (
    <ErrorBoundary
      fallback={
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Errore nel caricamento</CardTitle>
            <CardDescription>
              Si è verificato un errore nel caricamento di questa sezione.
            </CardDescription>
          </CardHeader>
        </Card>
      }
    >
      <Suspense fallback={<LoadingSpinner message="Caricamento sezione..." />}>
        <div className="animate-fade-in">
          <Component />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}