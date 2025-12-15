import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Home, Users, Star, Award, Medal } from "lucide-react";

interface QuizResult {
  studentName: string;
  score: number;
  totalQuestions: number;
}

export default function Result() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("quizResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      setLocation("/home");
    }
  }, [setLocation]);

  if (!result) {
    return null;
  }

  const { studentName, score, totalQuestions } = result;
  const maxScore = totalQuestions * 10;
  const percentage = (score / maxScore) * 100;

  const getMessage = () => {
    if (percentage === 100) {
      return { text: "Sempurna! Kamu menguasai materi dengan sangat baik!", icon: Trophy, color: "text-yellow-500" };
    } else if (percentage >= 80) {
      return { text: "Luar Biasa! Pemahaman yang sangat baik!", icon: Award, color: "text-primary" };
    } else if (percentage >= 60) {
      return { text: "Bagus! Terus tingkatkan pemahamanmu!", icon: Medal, color: "text-green-500" };
    } else if (percentage >= 40) {
      return { text: "Cukup baik! Ayo pelajari materi lebih dalam lagi.", icon: Star, color: "text-orange-500" };
    } else {
      return { text: "Tetap semangat! Jangan menyerah untuk terus belajar.", icon: Star, color: "text-muted-foreground" };
    }
  };

  const message = getMessage();
  const MessageIcon = message.icon;

  const handlePlayAgain = () => {
    sessionStorage.removeItem("quizResult");
    setLocation("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        <Card className="overflow-hidden">
          <div className="bg-primary/10 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background mb-4">
              <MessageIcon className={`w-10 h-10 ${message.color}`} />
            </div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-congratulations">
              Kuis Selesai!
            </h1>
          </div>

          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg" data-testid="text-student-name">
              {studentName}
            </CardTitle>
            <CardDescription>{message.text}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary mb-2" data-testid="text-score">
                {score}
              </div>
              <div className="text-muted-foreground">
                dari {maxScore} poin
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm text-muted-foreground">Persentase</div>
              </div>
              <div className="bg-muted/50 rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  {score / 10}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Benar</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handlePlayAgain}
                className="w-full"
                size="lg"
                data-testid="button-play-again"
              >
                <Home className="w-4 h-4 mr-2" />
                Kuis Baru
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/scores")}
                className="w-full"
                size="lg"
                data-testid="button-view-scores"
              >
                <Users className="w-4 h-4 mr-2" />
                Lihat Semua Skor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
