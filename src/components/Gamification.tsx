import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamification } from "@/hooks/useGamification";
import { Badge, Challenge } from "@/types/gamification";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Award, 
  Crown, 
  Camera,
  TrendingUp,
  Zap,
  Calendar
} from "lucide-react";

export function Gamification() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { stats, currentLevel, nextLevel, progressToNextLevel, awardXP } = useGamification();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-orange-400';
      default: return 'border-gray-400';
    }
  };

  const unlockedBadges = stats.badges.filter(badge => badge.unlocked);
  const lockedBadges = stats.badges.filter(badge => !badge.unlocked);
  const activeChallenges = stats.challenges.filter(challenge => !challenge.completed);
  const completedChallenges = stats.challenges.filter(challenge => challenge.completed);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-3xl -z-10" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Beast Gamification
        </h1>
        <p className="text-muted-foreground">
          Sblocca achievements, completa sfide e diventa il Beast definitivo! 🔥
        </p>
      </div>

      {/* Level & XP Overview */}
      <Card className="border-2 border-primary/30 shadow-glow">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center mb-4">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl">
            {currentLevel.name}
          </CardTitle>
          <CardDescription>Livello {currentLevel.level}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              XP: {stats.totalXp} / {nextLevel?.minXp || 'MAX'}
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            {nextLevel && (
              <div className="text-xs text-muted-foreground">
                {nextLevel.minXp - stats.totalXp} XP al prossimo livello: {nextLevel.name}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Workout Totali</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Streak Attuale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{unlockedBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badge Sbloccati</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="h-4 w-4 mr-2" />
            Badge
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Sfide
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="h-4 w-4 mr-2" />
            Progresso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ultimi Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unlockedBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unlockedBadges.slice(-4).map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`p-3 rounded-lg border-2 ${getRarityBorder(badge.rarity)} bg-card hover:shadow-md transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                          <UIBadge variant="secondary" className={`${getRarityColor(badge.rarity)} text-white text-xs mt-1`}>
                            {badge.rarity.toUpperCase()}
                          </UIBadge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nessun achievement ancora! Inizia ad allenarti! 💪</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Challenges Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Sfide Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeChallenges.length > 0 ? (
                <div className="space-y-3">
                  {activeChallenges.slice(0, 2).map((challenge) => (
                    <div key={challenge.id} className="p-3 rounded-lg border bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-sm">{challenge.title}</div>
                          <div className="text-xs text-muted-foreground">{challenge.description}</div>
                        </div>
                        <UIBadge variant="outline" className="text-xs">
                          +{challenge.xpReward} XP
                        </UIBadge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{challenge.progress} / {challenge.target}</span>
                          <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                        </div>
                        <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nessuna sfida attiva. Nuove sfide arriveranno presto!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Badge Sbloccati ({unlockedBadges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedBadges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`p-4 rounded-lg border-2 ${getRarityBorder(badge.rarity)} bg-card shadow-md hover:shadow-lg transition-all animate-fade-in`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="font-bold">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                        <UIBadge className={`${getRarityColor(badge.rarity)} text-white`}>
                          {badge.rarity.toUpperCase()}
                        </UIBadge>
                        {badge.unlockedAt && (
                          <div className="text-xs text-muted-foreground">
                            Sbloccato: {new Date(badge.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locked Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gray-400" />
                Badge da Sbloccare ({lockedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className="p-4 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 opacity-75"
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl grayscale">{badge.icon}</div>
                      <div className="font-bold text-gray-600 dark:text-gray-400">{badge.name}</div>
                      <div className="text-sm text-muted-foreground">{badge.description}</div>
                      <div className="text-xs">
                        Progresso: {badge.requirement.current || 0} / {badge.requirement.target}
                      </div>
                      <Progress 
                        value={((badge.requirement.current || 0) / badge.requirement.target) * 100} 
                        className="h-2" 
                      />
                      <UIBadge variant="secondary" className="text-xs">
                        {badge.rarity.toUpperCase()}
                      </UIBadge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Sfide Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeChallenges.length > 0 ? (
                <div className="space-y-4">
                  {activeChallenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <div className="font-semibold flex items-center gap-2">
                            {challenge.type === 'daily' ? (
                              <Calendar className="h-4 w-4 text-orange-500" />
                            ) : (
                              <Target className="h-4 w-4 text-blue-500" />
                            )}
                            {challenge.title}
                          </div>
                          <div className="text-sm text-muted-foreground">{challenge.description}</div>
                          <div className="text-xs text-muted-foreground">
                            Scade: {new Date(challenge.expiresAt).toLocaleString()}
                          </div>
                        </div>
                        <UIBadge variant="outline">
                          +{challenge.xpReward} XP
                        </UIBadge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso: {challenge.progress} / {challenge.target}</span>
                          <span className="text-primary font-semibold">
                            {Math.round((challenge.progress / challenge.target) * 100)}%
                          </span>
                        </div>
                        <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Nessuna sfida attiva al momento</p>
                  <p className="text-sm text-muted-foreground mt-1">Le nuove sfide vengono generate automaticamente!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-500" />
                  Sfide Completate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedChallenges.slice(-5).map((challenge) => (
                    <div key={challenge.id} className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-sm text-green-700 dark:text-green-400">
                            {challenge.title}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-500">
                            Completata: {challenge.completedAt ? new Date(challenge.completedAt).toLocaleDateString() : ''}
                          </div>
                        </div>
                        <UIBadge className="bg-green-500 text-white">
                          +{challenge.xpReward} XP
                        </UIBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-500" />
                Foto Progresso
              </CardTitle>
              <CardDescription>
                Carica foto per tracciare il tuo progresso fisico nel tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  Funzionalità in arrivo! Presto potrai caricare foto del tuo progresso.
                </p>
                <Button variant="outline" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Carica Foto
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}