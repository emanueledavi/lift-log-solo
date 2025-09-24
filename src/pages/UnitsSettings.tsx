import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale, Ruler, Thermometer, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UnitsSettings() {
  const navigate = useNavigate();
  const [units, setUnits] = useState({
    weightUnit: 'kg',
    lengthUnit: 'cm',
    distanceUnit: 'km',
    temperatureUnit: 'celsius',
    timeFormat: '24h'
  });

  const handleSave = () => {
    toast.success("Unità di misura Beast salvate! 📏");
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
              📏 Unità di Misura Beast
            </h1>
            <p className="text-muted-foreground">
              Scegli le tue unità Beast preferite!
            </p>
          </div>
        </div>

        {/* Weight Units */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Unità Peso Beast
            </CardTitle>
            <CardDescription>
              Come vuoi misurare la tua forza Beast! 💪
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unità Peso</Label>
              <Select 
                value={units.weightUnit} 
                onValueChange={(value) => setUnits(prev => ({...prev, weightUnit: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">🏋️ Chilogrammi (kg) - Stile Europeo Beast</SelectItem>
                  <SelectItem value="lbs">💪 Libbre (lbs) - Stile Americano Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Esempio:</strong> {units.weightUnit === 'kg' ? '80 kg Beast Power! 🔥' : '176 lbs Beast Power! 🔥'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Length & Height Units */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Unità Lunghezza Beast
            </CardTitle>
            <CardDescription>
              Misura la tua grandezza Beast! 📐
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unità Altezza/Lunghezza</Label>
              <Select 
                value={units.lengthUnit} 
                onValueChange={(value) => setUnits(prev => ({...prev, lengthUnit: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">📏 Centimetri (cm) - Precisione Beast</SelectItem>
                  <SelectItem value="ft">📐 Piedi & Pollici (ft/in) - Stile USA Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Esempio:</strong> {units.lengthUnit === 'cm' ? '180 cm di pura altezza Beast! 📏' : '5\'11" di pura altezza Beast! 📐'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Distance Units */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 rotate-45" />
              Unità Distanza Beast
            </CardTitle>
            <CardDescription>
              Per i tuoi workout cardio Beast! 🏃‍♂️
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unità Distanza</Label>
              <Select 
                value={units.distanceUnit} 
                onValueChange={(value) => setUnits(prev => ({...prev, distanceUnit: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">🏃 Chilometri (km) - Distanze Beast Europee</SelectItem>
                  <SelectItem value="miles">🏃‍♂️ Miglia (mi) - Distanze Beast USA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Esempio:</strong> {units.distanceUnit === 'km' ? '5 km di corsa Beast! 🏃' : '3.1 mi di corsa Beast! 🏃‍♂️'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Format */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Formato Ora Beast
            </CardTitle>
            <CardDescription>
              Come vuoi vedere l'ora Beast! ⏰
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Formato Ora</Label>
              <Select 
                value={units.timeFormat} 
                onValueChange={(value) => setUnits(prev => ({...prev, timeFormat: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">🕐 24 ore (14:30) - Stile Militare Beast</SelectItem>
                  <SelectItem value="12h">🕑 12 ore (2:30 PM) - Stile Classico Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Esempio:</strong> {units.timeFormat === '24h' ? 'Allenamento alle 14:30 Beast! 🕐' : 'Allenamento alle 2:30 PM Beast! 🕑'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Temperature (bonus) */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Unità Temperatura Beast
            </CardTitle>
            <CardDescription>
              Per il clima dei tuoi workout Beast! 🌡️
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unità Temperatura</Label>
              <Select 
                value={units.temperatureUnit} 
                onValueChange={(value) => setUnits(prev => ({...prev, temperatureUnit: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="celsius">🌡️ Celsius (°C) - Stile Europeo Beast</SelectItem>
                  <SelectItem value="fahrenheit">🌡️ Fahrenheit (°F) - Stile USA Beast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Esempio:</strong> {units.temperatureUnit === 'celsius' ? '25°C perfetti per il workout Beast! 🌡️' : '77°F perfetti per il workout Beast! 🌡️'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          size="lg"
          className="w-full gap-2"
        >
          <Scale className="h-5 w-5" />
          Salva Unità Beast 📏
        </Button>
      </div>
    </div>
  );
}