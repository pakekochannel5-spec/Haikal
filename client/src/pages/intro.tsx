import { useLocation } from "wouter";
import { GraduationCap, ArrowRight, BookOpen, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Intro() {
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation("/home");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4"
      data-testid="intro-screen"
    >
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Kuis Ketenagakerjaan
          </h1>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            Uji pengetahuanmu tentang dunia kerja dan ketenagakerjaan Indonesia
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg text-center mb-4">Fitur Kuis</h2>
            
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">10 Soal Pilihan Ganda</p>
                  <p className="text-xs text-muted-foreground">Pertanyaan seputar ketenagakerjaan</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Sistem Skor</p>
                  <p className="text-xs text-muted-foreground">Lihat hasil dan peringkatmu</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Papan Skor</p>
                  <p className="text-xs text-muted-foreground">Bandingkan dengan peserta lain</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button 
            onClick={handleStart} 
            size="lg" 
            className="w-full max-w-xs gap-2"
            data-testid="button-start"
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Dibuat oleh
            </p>
            <p className="text-base font-semibold text-primary" data-testid="text-creator">
              Haikal Joanelman
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
