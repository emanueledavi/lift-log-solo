import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bell, Mail, Smartphone, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: false,
    workoutReminders: true,
    achievementAlerts: true,
    progressUpdates: true,
    socialNotifications: false,
    restTimerAlerts: true,
    weeklyReports: true,
    motivationalMessages: true
  });

  const handleSave = () => {
    toast.success("Impostazioni notifiche Beast salvate! 🔔");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Button>
          <div>
            <h1 className="text-3xl font-black gradient-text">
              🔔 Notifiche Beast
            </h1>
            <p className="text-muted-foreground">
              Resta sempre connesso con il tuo Beast!
            </p>
          </div>
        </div>

        {/* Push Notifications */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Notifiche Push Beast
            </CardTitle>
            <CardDescription>
              Ricevi notifiche istantanee sul tuo dispositivo! 📱
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notifiche Push</Label>
                <p className="text-sm text-muted-foreground">
                  Attiva le notifiche push Beast! 🚀
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, pushNotifications: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Promemoria Allenamento</Label>
                <p className="text-sm text-muted-foreground">
                  Non saltare mai un workout Beast! 💪
                </p>
              </div>
              <Switch
                checked={notifications.workoutReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, workoutReminders: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Timer di Riposo</Label>
                <p className="text-sm text-muted-foreground">
                  Avvisi per il riposo Beast! ⏱️
                </p>
              </div>
              <Switch
                checked={notifications.restTimerAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, restTimerAlerts: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Achievement Notifications */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Notifiche Obiettivi Beast
            </CardTitle>
            <CardDescription>
              Celebra ogni vittoria Beast! 🏆
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Avvisi Obiettivi</Label>
                <p className="text-sm text-muted-foreground">
                  Festeggia i tuoi successi Beast! 🎉
                </p>
              </div>
              <Switch
                checked={notifications.achievementAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, achievementAlerts: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Aggiornamenti Progresso</Label>
                <p className="text-sm text-muted-foreground">
                  Traccia la tua crescita Beast! 📈
                </p>
              </div>
              <Switch
                checked={notifications.progressUpdates}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, progressUpdates: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Messaggi Motivazionali</Label>
                <p className="text-sm text-muted-foreground">
                  Carica Beast quotidiana! 💯
                </p>
              </div>
              <Switch
                checked={notifications.motivationalMessages}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, motivationalMessages: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifiche Email Beast
            </CardTitle>
            <CardDescription>
              Ricevi aggiornamenti via email! 📧
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifiche</Label>
                <p className="text-sm text-muted-foreground">
                  Ricevi email Beast periodiche! 📬
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailNotifications: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Report Settimanali</Label>
                <p className="text-sm text-muted-foreground">
                  Riassunto settimanale Beast! 📊
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, weeklyReports: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Notifications */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifiche Social Beast
            </CardTitle>
            <CardDescription>
              Connettiti con la community Beast! 👥
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notifiche Social</Label>
                <p className="text-sm text-muted-foreground">
                  Interazioni con altri Beast! 🤝
                </p>
              </div>
              <Switch
                checked={notifications.socialNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, socialNotifications: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="w-full gap-2"
        >
          <Bell className="h-5 w-5" />
          Salva Impostazioni Notifiche 🔔
        </Button>
      </div>
    </div>
  );
}