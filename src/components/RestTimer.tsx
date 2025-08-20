import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

export function RestTimer() {
  const [seconds, setSeconds] = useState(90); // Default 90 seconds
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for timer finish sound
    audioRef.current = new Audio();
    // Simple beep sound using data URL
    audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LGdCUFLYPO8tiJOQgZZ7ztz55NEAxPqOPvt2McBzuP2fLIcyUELYPO8tiIOQgZaLvt0J1NEAxPpuTwuGMcBzyP2vLHdCUELYPO8tiIOQgZaLvt0J1NEAxPpuTwuGMcBzyP2vLHdCUELYPO8tiIOQgZaLvt0J1NEAxPpuTwuGMcBz2M2vLPciMELoPN9tiKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY7zxzqBQEglOouzwvGMaBDyN2vLPciMGLoLN9diKOwkZY";

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // Play sound notification
            if (audioRef.current) {
              audioRef.current.play().catch(console.error);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(seconds);
      setIsFinished(false);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(seconds);
    setIsFinished(false);
  };

  const setPresetTime = (presetSeconds: number) => {
    setSeconds(presetSeconds);
    setTimeLeft(presetSeconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timer Recupero</h1>
        <p className="text-muted-foreground">Gestisci i tempi di riposo tra le serie</p>
      </div>

      {/* Main Timer */}
      <Card className={`gradient-card border-0 shadow-fitness ${isFinished ? 'animate-pulse-soft' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Timer className="h-5 w-5 mr-2 text-primary" />
            Timer Recupero
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 pb-6">
          {/* Timer Display */}
          <div className="relative flex items-center justify-center py-4">
            <div className={`text-4xl sm:text-5xl md:text-6xl font-bold transition-colors z-10 relative ${
              isFinished ? 'text-success' : 
              timeLeft <= 10 && isRunning ? 'text-warning' :
              'text-primary'
            }`}>
              {formatTime(timeLeft)}
            </div>
            
            {/* Progress Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="hsl(var(--muted))"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={isFinished ? "hsl(var(--success))" : "hsl(var(--primary))"}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
            </div>
          </div>

          {/* Status Message */}
          {isFinished && (
            <div className="text-success font-semibold text-lg animate-bounce px-4">
              ⏰ Tempo scaduto! Pronto per la prossima serie?
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls - Separate card for better mobile accessibility */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardContent className="pt-6">
          <div className="flex justify-center gap-3 flex-wrap">
            {!isRunning ? (
              <Button 
                onClick={startTimer}
                size="lg"
                className="gradient-primary text-primary-foreground min-w-[120px] touch-manipulation"
              >
                <Play className="h-5 w-5 mr-2" />
                {timeLeft === seconds ? 'Start' : 'Riprendi'}
              </Button>
            ) : (
              <Button 
                onClick={pauseTimer}
                size="lg"
                variant="outline"
                className="min-w-[120px] touch-manipulation"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pausa
              </Button>
            )}
            
            <Button 
              onClick={resetTimer}
              size="lg"
              variant="outline"
              className="min-w-[120px] touch-manipulation"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Settings */}
      <Card className="gradient-card border-0 shadow-fitness">
        <CardHeader>
          <CardTitle>Imposta Tempo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Custom Time Input */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Secondi:</label>
            <Input
              type="number"
              min="1"
              max="600"
              value={seconds}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setSeconds(value);
                if (!isRunning) {
                  setTimeLeft(value);
                  setIsFinished(false);
                }
              }}
              className="w-20"
            />
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tempi preimpostati:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[30, 60, 90, 120, 180, 300].map(preset => (
                <Button
                  key={preset}
                  variant={seconds === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPresetTime(preset)}
                  disabled={isRunning}
                >
                  {preset >= 60 ? `${Math.floor(preset/60)}:${(preset%60).toString().padStart(2,'0')}` : `${preset}s`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}