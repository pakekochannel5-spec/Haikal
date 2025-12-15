import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Timer, Trophy, Rocket } from "lucide-react";

type ChallengeState = "intro" | "countdown" | "waiting" | "ready" | "success" | "failed";

export default function Challenge() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<ChallengeState>("intro");
  const [countdown, setCountdown] = useState(3);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const studentName = sessionStorage.getItem("studentName");

  useEffect(() => {
    if (!studentName) {
      setLocation("/home");
    }
  }, [studentName, setLocation]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startChallenge = () => {
    setState("countdown");
    setCountdown(3);
  };

  useEffect(() => {
    if (state === "countdown") {
      if (countdown > 0) {
        timerRef.current = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        setState("waiting");
        const randomDelay = Math.floor(Math.random() * 2000) + 1000;
        timerRef.current = setTimeout(() => {
          startTimeRef.current = Date.now();
          setState("ready");
        }, randomDelay);
      }
    }
  }, [state, countdown]);

  const handleAreaClick = () => {
    if (state === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("failed");
    } else if (state === "ready") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      setState("success");
    }
  };

  const getReactionRating = (time: number) => {
    if (time < 200) return { label: "LUAR BIASA!", color: "text-yellow-500" };
    if (time < 300) return { label: "Sangat Cepat!", color: "text-green-500" };
    if (time < 400) return { label: "Cepat!", color: "text-blue-500" };
    if (time < 500) return { label: "Bagus!", color: "text-purple-500" };
    return { label: "Bisa Lebih Cepat!", color: "text-orange-500" };
  };

  const handleContinue = () => {
    setLocation("/quiz");
  };

  const handleRetry = () => {
    setState("intro");
    setReactionTime(0);
    setCountdown(3);
  };

  if (!studentName) return null;

  if (state === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Tantangan Refleks!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                Sebelum memulai kuis, uji kecepatan refleksmu!
              </p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Cara bermain:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Tunggu layar berubah menjadi <span className="text-green-500 font-bold">HIJAU</span></li>
                  <li>Tekan area hijau secepat mungkin</li>
                  <li>Jangan tekan sebelum layar hijau!</li>
                </ol>
              </div>
              <Button onClick={startChallenge} className="w-full" size="lg">
                <Target className="w-4 h-4 mr-2" />
                Mulai Tantangan
              </Button>
              <Button variant="ghost" onClick={handleContinue} className="w-full">
                Lewati Tantangan
              </Button>
            </CardContent>
          </Card>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Selamat datang, <span className="font-medium text-foreground">{studentName}</span>!
          </p>
        </div>
      </div>
    );
  }

  if (state === "countdown") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md text-center">
          <Card className="border-2 border-primary">
            <CardContent className="py-16">
              <div className="text-8xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
              <p className="mt-4 text-muted-foreground">Bersiap-siap...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state === "waiting") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-red-500 cursor-pointer select-none"
        onClick={handleAreaClick}
      >
        <div className="text-center text-white">
          <div className="text-5xl font-bold animate-pulse">TUNGGU...</div>
          <p className="mt-4 text-xl">Jangan tekan dulu!</p>
        </div>
      </div>
    );
  }

  if (state === "ready") {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-green-500 cursor-pointer select-none"
        onClick={handleAreaClick}
      >
        <div className="text-center text-white">
          <div className="text-6xl font-bold animate-bounce">TEKAN!</div>
          <p className="mt-4 text-xl">Sekarang!</p>
        </div>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Card className="border-2 border-destructive">
            <CardContent className="py-12 text-center space-y-4">
              <div className="text-6xl">😅</div>
              <p className="text-2xl font-bold text-destructive">Terlalu Cepat!</p>
              <p className="text-muted-foreground">
                Kamu menekan sebelum layar berubah hijau
              </p>
              <div className="pt-4 space-y-2">
                <Button onClick={handleRetry} className="w-full">
                  Coba Lagi
                </Button>
                <Button variant="ghost" onClick={handleContinue} className="w-full">
                  Lanjut ke Kuis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state === "success") {
    const rating = getReactionRating(reactionTime);
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <Card className="border-2 border-green-500">
            <CardContent className="py-8 text-center space-y-4">
              <div className={`${rating.color}`}>
                <Trophy className="w-12 h-12 mx-auto" />
              </div>
              <p className={`text-2xl font-bold ${rating.color}`}>
                {rating.label}
              </p>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Waktu Reaksi</p>
                <p className="text-4xl font-bold text-primary">{reactionTime} ms</p>
              </div>
              {bestTime && bestTime !== reactionTime && (
                <p className="text-sm text-muted-foreground">
                  Waktu terbaik: <span className="font-bold text-primary">{bestTime} ms</span>
                </p>
              )}
              <div className="pt-4 space-y-2">
                <Button onClick={handleContinue} className="w-full" size="lg">
                  <Rocket className="w-4 h-4 mr-2" />
                  Mulai Kuis Sekarang!
                </Button>
                <Button variant="outline" onClick={handleRetry} className="w-full">
                  Coba Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
