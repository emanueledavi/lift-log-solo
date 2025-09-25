import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Settings, Volume2, Zap, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function GeneralSettings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [settings, setSettings] = useState({
    autoStartWorkout: true,
    workoutReminders: true,
    soundEffects: true,
    hapticFeedback: true,
    language: 'it',
    dataSync: true,
    volume: [80]
  });

  useEffect(() => {
    // Load theme from localStorage and apply it immediately
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    }
  }, []);

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    toast.success(`Modalità ${newTheme === 'dark' ? 'Scura' : 'Chiara'} Beast attivata! ${newTheme === 'dark' ? '🌙' : '☀️'}`);
  };

  const handleSave = () => {
    toast.success("Impostazioni Beast salvate! ⚙️");
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
              ⚙️ Impostazioni Beast
            </h1>
            <p className="text-muted-foreground">
              Personalizza la tua esperienza Beast!
            </p>
          </div>
        </div>

        {/* Appearance */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Aspetto Beast
            </CardTitle>
            <CardDescription>
              Personalizza l'aspetto dell'app 🎨
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Modalità Scura Beast</Label>
                <p className="text-sm text-muted-foreground">
                  Attiva il lato dark del Beast 🌙
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="space-y-2">
              <Label>Lingua Beast</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings(prev => ({...prev, language: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">🇮🇹 Italiano Beast</SelectItem>
                  <SelectItem value="en">🇺🇸 English Beast</SelectItem>
                  <SelectItem value="es">🇪🇸 Español Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Workout Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Impostazioni Allenamento
            </CardTitle>
            <CardDescription>
              Ottimizza i tuoi workout Beast! 💪
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Avvio Automatico</Label>
                <p className="text-sm text-muted-foreground">
                  Inizia subito a bruciare Beast! 🔥
                </p>
              </div>
              <Switch
                checked={settings.autoStartWorkout}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, autoStartWorkout: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Promemoria Allenamento</Label>
                <p className="text-sm text-muted-foreground">
                  Non perdere mai un workout Beast! ⏰
                </p>
              </div>
              <Switch
                checked={settings.workoutReminders}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, workoutReminders: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio & Feedback */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio & Feedback Beast
            </CardTitle>
            <CardDescription>
              Senti il ritmo Beast! 🎵
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Effetti Sonori</Label>
                <p className="text-sm text-muted-foreground">
                  Suoni epici per workout epici! 🔊
                </p>
              </div>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, soundEffects: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Feedback Aptico</Label>
                <p className="text-sm text-muted-foreground">
                  Senti la vibrazione Beast! 📳
                </p>
              </div>
              <Switch
                checked={settings.hapticFeedback}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, hapticFeedback: checked}))}
              />
            </div>

            <div className="space-y-3">
              <Label>Volume Beast</Label>
              <Slider
                value={settings.volume}
                onValueChange={(value) => setSettings(prev => ({...prev, volume: value}))}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-center text-muted-foreground">
                {settings.volume[0]}% 🔊
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Sync */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dati & Sincronizzazione
            </CardTitle>
            <CardDescription>
              Mantieni i tuoi dati Beast al sicuro! 🛡️
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sincronizzazione Automatica</Label>
                <p className="text-sm text-muted-foreground">
                  I tuoi dati Beast sempre aggiornati! ☁️
                </p>
              </div>
              <Switch
                checked={settings.dataSync}
                onCheckedChange={(checked) => setSettings(prev => ({...prev, dataSync: checked}))}
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
          <Settings className="h-5 w-5" />
          Salva Impostazioni Beast ⚙️
        </Button>
      </div>
    </div>
  );
}