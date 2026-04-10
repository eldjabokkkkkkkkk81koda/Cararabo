import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { LogIn, CheckCircle2, Smartphone, Tv, User, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsLoading(true);
      try {
        await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Erro ao fazer login", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-zinc-100 flex flex-col justify-center items-center p-4 relative">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center py-12 border-green-200 shadow-2xl shadow-green-100/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Sucesso!</h2>
                <p className="text-zinc-500 text-lg">Seus dados foram enviados para o banco.</p>
              </div>
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-zinc-900 text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg"
              >
                <Smartphone className="w-6 h-6 text-blue-400" />
                <span className="font-medium">Olhe para a tela da TV agora!</span>
              </motion.div>
              <Button variant="ghost" className="mt-4 text-zinc-500 hover:text-zinc-900" onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
              }}>
                Enviar outro registro
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-zinc-100 flex flex-col justify-center items-center p-4 relative">
      {/* Link discreto para o professor abrir a TV */}
      <div className="absolute top-4 right-4">
        <Link to="/tv-login" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm text-zinc-600 hover:text-zinc-900 gap-2 border-zinc-200 shadow-sm">
            <Tv className="w-4 h-4 text-blue-600" />
            Abrir Painel da TV
          </Button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl shadow-zinc-200/50 border-zinc-200/60 bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-8 pt-8">
            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-base font-medium text-zinc-500">
              Insira seus dados para simular uma inserção no banco de dados.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-700 font-semibold">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input 
                    id="name" 
                    className="h-12 text-lg pl-10 bg-white/50 focus:bg-white transition-colors"
                    placeholder="Ex: João Silva" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 font-semibold">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    className="h-12 text-lg pl-10 bg-white/50 focus:bg-white transition-colors"
                    placeholder="joao@exemplo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-lg gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Entrar na Aula"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
