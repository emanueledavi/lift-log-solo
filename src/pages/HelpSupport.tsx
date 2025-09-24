import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Button>
          <div>
            <h1 className="text-3xl font-black gradient-text">💬 Aiuto & Support Beast</h1>
            <p className="text-muted-foreground">Siamo qui per aiutarti Beast!</p>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Centro Aiuto Beast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="lg" className="w-full justify-start gap-3">
              <Book className="h-5 w-5" />
              Guida Beast 📖
            </Button>
            <Button variant="outline" size="lg" className="w-full justify-start gap-3">
              <MessageCircle className="h-5 w-5" />
              Chat Support Beast 💬
            </Button>
            <Button variant="outline" size="lg" className="w-full justify-start gap-3">
              <Mail className="h-5 w-5" />
              Email Support Beast 📧
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}