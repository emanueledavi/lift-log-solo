import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, User, Save, ArrowLeft, Camera } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner'
  });

  const handleSave = () => {
    toast.success("Profilo Beast aggiornato! 💪");
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
              💪 Beast Profile
            </h1>
            <p className="text-muted-foreground">
              Personalizza il tuo profilo Beast!
            </p>
          </div>
        </div>

        {/* Avatar Section */}
        <Card className="glass">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl font-bold gradient-primary text-white">
                    BM
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  variant="secondary"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="gradient-text">La tua Avatar Beast</CardTitle>
            <CardDescription>
              Mostra al mondo il tuo lato Beast! 🔥
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Personal Info */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Info Personali Beast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome Beast</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({...prev, firstName: e.target.value}))}
                  placeholder="Il tuo nome da Beast"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Cognome Beast</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({...prev, lastName: e.target.value}))}
                  placeholder="Il tuo cognome da Beast"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username Beast</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({...prev, username: e.target.value}))}
                placeholder="@iltuobeastname"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio Beast</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({...prev, bio: e.target.value}))}
                placeholder="Racconta la tua storia Beast! 💪🔥"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Data di Nascita</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Stats Fisici Beast 📊</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile(prev => ({...prev, height: e.target.value}))}
                  placeholder="180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={profile.weight}
                  onChange={(e) => setProfile(prev => ({...prev, weight: e.target.value}))}
                  placeholder="75.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fitnessLevel">Livello Beast</Label>
              <Select 
                value={profile.fitnessLevel} 
                onValueChange={(value) => setProfile(prev => ({...prev, fitnessLevel: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Scegli il tuo livello Beast" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">🌱 Rookie Beast</SelectItem>
                  <SelectItem value="intermediate">🔥 Intermediate Beast</SelectItem>
                  <SelectItem value="advanced">💪 Advanced Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="w-full gap-2"
        >
          <Save className="h-5 w-5" />
          Salva Beast Profile 💪
        </Button>
      </div>
    </div>
  );
}