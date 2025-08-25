import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Workout, PersonalBest } from "@/types/fitness";
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Flame, 
  Calendar,
  Dumbbell,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'strength' | 'consistency' | 'volume' | 'endurance' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: number;
  current: number;
  unlocked: boolean;
  unlockedAt?: string;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-muted text-muted-foreground';
    case 'rare': return 'bg-primary text-primary-foreground';
    case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function Achievements() {
  const [workouts] = useLocalStorage<Workout[]>("workouts", []);
  const [personalBests] = useLocalStorage<PersonalBest[]>("personalBests", []);

  const achievements = useMemo(() => {
    const totalWorkouts = workouts.length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.getMonth() === thisMonth && workoutDate.getFullYear() === thisYear;
    });
    
    const strengthWorkouts = workouts.filter(w => 
      w.exercises.some(e => e.type === 'strength')
    );
    
    const totalVolume = workouts.reduce((sum, workout) => {
      return sum + workout.exercises
        .filter(e => e.type === 'strength')
        .reduce((exerciseSum, exercise) => {
          return exerciseSum + exercise.sets.reduce((setSum, set) => {
            return setSum + ((set.weight || 0) * (set.reps || 0));
          }, 0);
        }, 0);
    }, 0);

    const longestStreak = calculateStreak(workouts);
    const maxPB = personalBests.length > 0 ? Math.max(...personalBests.map(pb => pb.weight)) : 0;

    const achievementsList: Achievement[] = [
      // Milestone Achievements
      {
        id: 'first-workout',
        name: 'Primo Passo',
        description: 'Completa il tuo primo allenamento',
        icon: Star,
        category: 'milestone',
        rarity: 'common',
        requirement: 1,
        current: totalWorkouts,
        unlocked: totalWorkouts >= 1,
        unlockedAt: totalWorkouts >= 1 ? workouts[0]?.date : undefined
      },
      {
        id: 'workout-warrior',
        name: 'Guerriero del Fitness',
        description: 'Completa 10 allenamenti',
        icon: Dumbbell,
        category: 'milestone',
        rarity: 'rare',
        requirement: 10,
        current: totalWorkouts,
        unlocked: totalWorkouts >= 10
      },
      {
        id: 'fitness-master',
        name: 'Maestro del Fitness',
        description: 'Completa 50 allenamenti',
        icon: Trophy,
        category: 'milestone',
        rarity: 'epic',
        requirement: 50,
        current: totalWorkouts,
        unlocked: totalWorkouts >= 50
      },
      {
        id: 'legend',
        name: 'Leggenda Vivente',
        description: 'Completa 100 allenamenti',
        icon: Medal,
        category: 'milestone',
        rarity: 'legendary',
        requirement: 100,
        current: totalWorkouts,
        unlocked: totalWorkouts >= 100
      },

      // Consistency Achievements
      {
        id: 'consistent-week',
        name: 'Settimana Perfetta',
        description: 'Allena per 7 giorni consecutivi',
        icon: Calendar,
        category: 'consistency',
        rarity: 'rare',
        requirement: 7,
        current: longestStreak,
        unlocked: longestStreak >= 7
      },
      {
        id: 'monthly-champion',
        name: 'Campione del Mese',
        description: 'Completa 15 allenamenti in un mese',
        icon: Flame,
        category: 'consistency',
        rarity: 'epic',
        requirement: 15,
        current: thisMonthWorkouts.length,
        unlocked: thisMonthWorkouts.length >= 15
      },

      // Strength Achievements
      {
        id: 'strength-starter',
        name: 'Iniziato della Forza',
        description: 'Solleva 500kg di volume totale',
        icon: Target,
        category: 'strength',
        rarity: 'common',
        requirement: 500,
        current: totalVolume,
        unlocked: totalVolume >= 500
      },
      {
        id: 'iron-warrior',
        name: 'Guerriero di Ferro',
        description: 'Solleva 5000kg di volume totale',
        icon: TrendingUp,
        category: 'strength',
        rarity: 'rare',
        requirement: 5000,
        current: totalVolume,
        unlocked: totalVolume >= 5000
      },
      {
        id: 'strength-monster',
        name: 'Mostro della Forza',
        description: 'Raggiungi un personal best di 100kg',
        icon: Zap,
        category: 'strength',
        rarity: 'epic',
        requirement: 100,
        current: maxPB,
        unlocked: maxPB >= 100
      }
    ];

    return achievementsList.sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      return b.current / b.requirement - a.current / a.requirement;
    });
  }, [workouts, personalBests]);

  const calculateStreak = (workouts: Workout[]) => {
    if (workouts.length === 0) return 0;
    
    const sortedDates = workouts
      .map(w => new Date(w.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let streak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const previous = new Date(sortedDates[i - 1]);
      const diffDays = Math.abs(previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }
    
    return maxStreak;
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievements = achievements.length;
  const completionRate = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Traguardi & Achievement
        </h1>
        <p className="text-muted-foreground">
          I tuoi successi nel percorso fitness
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="gradient-card border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Panoramica Progressi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completamento Achievement</span>
            <span className="text-sm text-muted-foreground">
              {unlockedAchievements.length}/{totalAchievements}
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="text-center">
            <span className="text-2xl font-bold text-primary">{completionRate}%</span>
            <p className="text-sm text-muted-foreground">Completato</p>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      {unlockedAchievements.length > 0 && (
        <Card className="gradient-hero border-0 text-white">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 animate-pulse-soft" />
            <h3 className="text-lg font-semibold mb-2">Ottimo Lavoro!</h3>
            <p className="text-sm opacity-90">
              Hai sbloccato {unlockedAchievements.length} achievement! 
              Continua così per raggiungere nuovi traguardi.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Medal className="h-5 w-5 text-primary" />
            Achievement Sbloccati
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.slice(0, 6).map((achievement) => (
              <Card key={achievement.id} className="group hover:shadow-fitness-lg transition-all duration-300 animate-scale-in">
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div className="relative inline-block">
                      <achievement.icon className="h-8 w-8 text-primary mx-auto animate-float" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                  <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity === 'common' ? 'Comune' :
                     achievement.rarity === 'rare' ? 'Raro' :
                     achievement.rarity === 'epic' ? 'Epico' : 'Leggendario'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Tutti gli Achievement
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`transition-all duration-300 ${achievement.unlocked ? 'gradient-card border-primary/20' : 'bg-muted/30'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                    <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h4>
                      {achievement.unlocked && (
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{achievement.current} / {achievement.requirement}</span>
                          <span>{Math.round((achievement.current / achievement.requirement) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Badge 
                    className={`${getRarityColor(achievement.rarity)} ${achievement.unlocked ? '' : 'opacity-50'}`}
                  >
                    {achievement.rarity === 'common' ? 'Comune' :
                     achievement.rarity === 'rare' ? 'Raro' :
                     achievement.rarity === 'epic' ? 'Epico' : 'Leggendario'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {achievements.filter(a => !a.unlocked).length === 0 && (
        <Card className="text-center py-12 gradient-hero border-0 text-white">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-bold mb-2">Campione Supremo!</h3>
            <p className="opacity-90">
              Hai sbloccato tutti gli achievement! Sei una vera leggenda del fitness!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}