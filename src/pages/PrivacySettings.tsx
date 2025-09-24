import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PrivacySettings() {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataCollection: false,
    analyticsSharing: false,
    locationTracking: false,
    socialSharing: true
  });

  const handleSave = () => {
    toast.success("Impostazioni privacy Beast salvate! 🛡️");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Button>
          <div>
            <h1 className="text-3xl font-black gradient-text">🛡️ Privacy Beast</h1>
            <p className="text-muted-foreground">I tuoi dati Beast sono al sicuro!</p>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Protezione Dati Beast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Raccolta Dati</Label>
                <p className="text-sm text-muted-foreground">Condividi dati per migliorare l'app Beast 📊</p>
              </div>
              <Switch
                checked={privacy.dataCollection}
                onCheckedChange={(checked) => setPrivacy(prev => ({...prev, dataCollection: checked}))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tracking Posizione</Label>
                <p className="text-sm text-muted-foreground">Per workout outdoor Beast 📍</p>
              </div>
              <Switch
                checked={privacy.locationTracking}
                onCheckedChange={(checked) => setPrivacy(prev => ({...prev, locationTracking: checked}))}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} size="lg" className="w-full gap-2">
          <Shield className="h-5 w-5" />
          Salva Privacy Beast 🛡️
        </Button>
      </div>
    </div>
  );
}