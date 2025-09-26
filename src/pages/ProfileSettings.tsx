import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { profileSchema, ProfileData } from "@/lib/validation";
import { z } from 'zod';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }

        if (profileData) {
          setProfile({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            username: profileData.username || '',
            bio: profileData.bio || '',
            height: profileData.height?.toString() || '',
            weight: profileData.weight?.toString() || '',
            fitnessLevel: profileData.fitness_level || 'beginner'
          });

          if (profileData.date_of_birth) {
            setSelectedDate(new Date(profileData.date_of_birth));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Errore nel caricamento del profilo');
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      // Validate the form data
      const validatedData = profileSchema.parse({
        firstName: profile.firstName || undefined,
        lastName: profile.lastName || undefined,
        username: profile.username || undefined,
        bio: profile.bio || undefined,
        height: profile.height ? parseFloat(profile.height) : undefined,
        weight: profile.weight ? parseFloat(profile.weight) : undefined,
        fitnessLevel: profile.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
        dateOfBirth: selectedDate
      });

      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          username: validatedData.username,
          bio: validatedData.bio,
          height: validatedData.height,
          weight: validatedData.weight,
          fitness_level: validatedData.fitnessLevel,
          date_of_birth: validatedData.dateOfBirth?.toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Errore nel salvataggio del profilo');
        return;
      }

      toast.success("Profilo Beast aggiornato! 💪");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        console.error('Error saving profile:', error);
        toast.error('Errore nel salvataggio del profilo');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Caricamento...</div>
      </div>
    );
  }

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
          disabled={isLoading}
        >
          <Save className="h-5 w-5" />
          {isLoading ? "Salvando..." : "Salva Beast Profile 💪"}
        </Button>
      </div>
    </div>
  );
}