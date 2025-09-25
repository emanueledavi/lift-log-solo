import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useGamification } from "@/hooks/useGamification";
import { Crown, Star, Zap } from "lucide-react";

interface LevelProgressProps {
  compact?: boolean;
}

export function LevelProgress({ compact = false }: LevelProgressProps) {
  const { stats, currentLevel, nextLevel, progressToNextLevel } = useGamification();

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Lv.{currentLevel.level}</span>
        </div>
        <div className="flex-1 space-y-1">
          <Progress value={progressToNextLevel} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {stats.totalXp} / {nextLevel?.minXp || 'MAX'} XP
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-purple-600/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">{currentLevel.name}</div>
              <div className="text-sm text-muted-foreground">Livello {currentLevel.level}</div>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold">{stats.totalXp} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm">{stats.currentStreak} giorni</span>
            </div>
          </div>
        </div>

        {nextLevel && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso al prossimo livello</span>
              <span className="font-semibold">{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="text-xs text-muted-foreground text-center">
              Mancano {nextLevel.minXp - stats.totalXp} XP per diventare {nextLevel.name}
            </div>
          </div>
        )}

        {nextLevel && nextLevel.rewards && (
          <div className="mt-3 space-y-1">
            <div className="text-xs text-muted-foreground">Ricompense prossimo livello:</div>
            <div className="flex flex-wrap gap-1">
              {nextLevel.rewards.map((reward, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {reward}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}