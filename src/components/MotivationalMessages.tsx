import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout } from "@/types/fitness";
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  Flame,
  Heart,
  Star,
  Zap,
  Trophy,
  Clock,
  Calendar
} from "lucide-react";

interface MotivationalMessage {
  id: string;
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'achievement' | 'encouragement' | 'streak' | 'goal' | 'tip';
  priority: number;
}

export function MotivationalMessages() {
  const [workouts] = useLocalStorage<Workout[]>("workouts", []);

  const motivationalData = useMemo(() => {
    const today = new Date();
    const thisWeek = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const diffTime = Math.abs(today.getTime() - workoutDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    const thisMonth = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.getMonth() === today.getMonth() && 
             workoutDate.getFullYear() === today.getFullYear();
    });

    const lastWorkout = workouts.length > 0 ? new Date(workouts[workouts.length - 1].date) : null;
    const daysSinceLastWorkout = lastWorkout ? 
      Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const totalVolume = workouts.reduce((sum, workout) => {
      return sum + workout.exercises
        .filter(e => e.type === 'strength')
        .reduce((exerciseSum, exercise) => {
          return exerciseSum + exercise.sets.reduce((setSum, set) => {
            return setSum + ((set.weight || 0) * (set.reps || 0));
          }, 0);
        }, 0);
    }, 0);

    return {
      totalWorkouts: workouts.length,
      thisWeekWorkouts: thisWeek.length,
      thisMonthWorkouts: thisMonth.length,
      daysSinceLastWorkout,
      totalVolume,
      hasWorkouts: workouts.length > 0
    };
  }, [workouts]);

  const messages = useMemo((): MotivationalMessage[] => {
    const messagesList: MotivationalMessage[] = [];

    // Messages based on workout frequency
    if (motivationalData.totalWorkouts === 0) {
      messagesList.push({
        id: 'welcome',
        title: 'Benvenuto in FitTracker!',
        message: 'Inizia il tuo percorso fitness oggi stesso. Ogni grande viaggio inizia con un primo passo!',
        icon: Star,
        type: 'encouragement',
        priority: 10
      });
    }

    if (motivationalData.totalWorkouts >= 1 && motivationalData.totalWorkouts < 5) {
      messagesList.push({
        id: 'getting-started',
        title: 'Ottimo inizio!',
        message: `Hai completato ${motivationalData.totalWorkouts} allenamenti. La costanza è la chiave del successo!`,
        icon: TrendingUp,
        type: 'encouragement',
        priority: 8
      });
    }

    if (motivationalData.totalWorkouts >= 10) {
      messagesList.push({
        id: 'consistent-performer',
        title: 'Atleta Costante!',
        message: `${motivationalData.totalWorkouts} allenamenti completati! Stai costruendo abitudini vincenti.`,
        icon: Trophy,
        type: 'achievement',
        priority: 7
      });
    }

    // Weekly performance messages
    if (motivationalData.thisWeekWorkouts >= 3) {
      messagesList.push({
        id: 'weekly-champion',
        title: 'Settimana Fantastica!',
        message: `${motivationalData.thisWeekWorkouts} allenamenti questa settimana. Stai dominando i tuoi obiettivi!`,
        icon: Flame,
        type: 'achievement',
        priority: 9
      });
    } else if (motivationalData.thisWeekWorkouts === 0 && motivationalData.hasWorkouts) {
      messagesList.push({
        id: 'weekly-reminder',
        title: 'Ricomincia Oggi!',
        message: 'Non hai ancora fatto allenamenti questa settimana. È il momento perfetto per ricominciare!',
        icon: Calendar,
        type: 'encouragement',
        priority: 8
      });
    }

    // Rest day messages
    if (motivationalData.daysSinceLastWorkout >= 3 && motivationalData.hasWorkouts) {
      messagesList.push({
        id: 'comeback-time',
        title: 'È Ora di Tornare!',
        message: `Sono passati ${motivationalData.daysSinceLastWorkout} giorni dal tuo ultimo allenamento. Il tuo corpo ti sta aspettando!`,
        icon: Zap,
        type: 'encouragement',
        priority: 9
      });
    } else if (motivationalData.daysSinceLastWorkout === 1) {
      messagesList.push({
        id: 'rest-day',
        title: 'Recupero Attivo',
        message: 'Un giorno di riposo può essere perfetto per il recupero. Ascolta il tuo corpo!',
        icon: Heart,
        type: 'tip',
        priority: 5
      });
    }

    // Volume-based messages
    if (motivationalData.totalVolume >= 1000) {
      messagesList.push({
        id: 'volume-master',
        title: 'Potenza Incredibile!',
        message: `Hai sollevato ${Math.round(motivationalData.totalVolume)}kg di volume totale! La tua forza sta crescendo!`,
        icon: Target,
        type: 'achievement',
        priority: 6
      });
    }

    // Monthly goals
    if (motivationalData.thisMonthWorkouts >= 8) {
      messagesList.push({
        id: 'monthly-star',
        title: 'Stella del Mese!',
        message: `${motivationalData.thisMonthWorkouts} allenamenti questo mese. Stai superando te stesso!`,
        icon: Star,
        type: 'achievement',
        priority: 7
      });
    }

    // Motivational tips
    const tips: MotivationalMessage[] = [
      {
        id: 'consistency-tip',
        title: 'Consiglio del Giorno',
        message: 'La costanza batte la perfezione. Meglio 15 minuti oggi che 2 ore mai!',
        icon: Clock,
        type: 'tip',
        priority: 3
      },
      {
        id: 'form-tip',
        title: 'Focus sulla Tecnica',
        message: 'La forma corretta previene infortuni e massimizza i risultati. Qualità over quantità!',
        icon: Target,
        type: 'tip',
        priority: 3
      },
      {
        id: 'progress-tip',
        title: 'Celebra i Piccoli Successi',
        message: 'Ogni workout è una vittoria. Celebra ogni piccolo progresso verso i tuoi obiettivi!',
        icon: Sparkles,
        type: 'tip',
        priority: 4
      }
    ];

    // Add random tip if no high priority messages
    if (messagesList.filter(m => m.priority >= 7).length === 0) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      messagesList.push(randomTip);
    }

    // Sort by priority (highest first)
    return messagesList.sort((a, b) => b.priority - a.priority);
  }, [motivationalData]);

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'gradient-primary text-white';
      case 'encouragement': return 'gradient-secondary text-white';
      case 'streak': return 'bg-success text-success-foreground';
      case 'goal': return 'bg-warning text-warning-foreground';
      case 'tip': return 'gradient-card border-primary/20';
      default: return 'gradient-card';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement': return 'Traguardo';
      case 'encouragement': return 'Motivazione';
      case 'streak': return 'Serie';
      case 'goal': return 'Obiettivo';
      case 'tip': return 'Consiglio';
      default: return '';
    }
  };

  // Show top 3 messages
  const displayMessages = messages.slice(0, 3);

  if (displayMessages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {displayMessages.map((message, index) => (
        <Card 
          key={message.id} 
          className={`${getMessageColor(message.type)} border-0 animate-slide-up transition-all duration-300 hover:scale-[1.02]`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${message.type === 'tip' ? 'bg-primary/10' : 'bg-white/20'}`}>
                <message.icon className={`h-5 w-5 ${message.type === 'tip' ? 'text-primary' : 'text-white'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${message.type === 'tip' ? 'text-foreground' : 'text-white'}`}>
                    {message.title}
                  </h3>
                  {message.type !== 'tip' && (
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                      {getTypeLabel(message.type)}
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${message.type === 'tip' ? 'text-muted-foreground' : 'text-white/90'}`}>
                  {message.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}