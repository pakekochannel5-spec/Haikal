import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }

      toast({
        title: "Login Berhasil",
        description: "Selamat datang, Admin!",
      });
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground">
            Masuk untuk mengelola kuis
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Masuk sebagai Admin</CardTitle>
            <CardDescription>
              Masukkan kredensial admin untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
