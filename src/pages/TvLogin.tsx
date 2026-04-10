import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Lock } from "lucide-react";

export default function TvLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "vitor77z" && password === "vitor777") {
      sessionStorage.setItem("tv_auth", "true");
      navigate("/tv");
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-zinc-400" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acesso Restrito</CardTitle>
          <CardDescription className="text-zinc-400">
            Painel exclusivo do professor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">Usuário</Label>
              <Input 
                id="username" 
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
              Acessar Painel da TV
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
