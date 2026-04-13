import { useState } from "react";
import { Link } from "react-router-dom";
import { Tv, CheckCircle2, Twitter, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [randomCat, setRandomCat] = useState("");

  const catImages = [
    "https://i.ibb.co/fGQwCx9k/e9cfc9af23c3541d3d5ee7c9be7e108a.jpg",
    "https://i.ibb.co/dw08KHxd/01b48dedf914ac81b2bee7b972ab916f-1.jpg"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || "Erro ao fazer login.");
          return;
        }
        
        // Select a random cat image
        setRandomCat(catImages[Math.floor(Math.random() * catImages.length)]);
        setSubmitted(true);
      } catch (error) {
        console.error("Erro ao fazer login", error);
        setError("Erro de conexão com o servidor.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] md:bg-pink-50/30 flex flex-col items-center pt-12 md:pt-20 p-4 relative font-sans">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-[400px] bg-white md:shadow-[0_10px_40px_rgba(0,175,240,0.1)] md:border border-zinc-100 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          {/* Cute background decoration */}
          <div className="absolute -top-10 -right-10 text-pink-100/40 rotate-12 pointer-events-none">
            <Heart className="w-40 h-40 fill-current" />
          </div>

          <div className="flex justify-center mb-6 relative z-10">
            <div className="relative">
              <motion.div 
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                className="relative w-40 h-40 rounded-full overflow-hidden border-[6px] border-white shadow-[0_8px_25px_rgba(0,175,240,0.25)]"
              >
                <img 
                  src={randomCat} 
                  alt="Cute kitten" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              {/* Floating heart badge */}
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2.5 shadow-lg border border-pink-50"
              >
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h2 className="text-3xl font-black text-zinc-800 mb-3 tracking-tight">Purr-feito! 🐾</h2>
            <p className="text-zinc-500 mb-8 leading-relaxed font-medium">
              Tudo certo! Um gatinho selvagem apareceu para celebrar seu login.<br/><br/>
              <span className="text-[#00AFF0] font-bold">Olhe para a tela da TV</span> para ver seus dados aparecerem ao vivo!
            </p>
            
            <button 
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
              }}
              className="w-full h-14 rounded-full bg-[#00AFF0] hover:bg-[#0091C7] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(0,175,240,0.3)] hover:shadow-[0_6px_20px_rgba(0,175,240,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Enviar outro
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-zinc-50 flex flex-col items-center pt-8 md:pt-16 p-4 relative font-sans">
      {/* Link super discreto para a TV */}
      <div className="absolute top-4 right-4">
        <Link to="/tv-login" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-zinc-400 transition-colors" title="Painel da TV">
          <Tv className="w-5 h-5" />
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white md:shadow-[0_0_15px_rgba(0,0,0,0.05)] md:border border-zinc-100 rounded-2xl p-6 md:p-8"
      >
        {/* Logo OnlyLove */}
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter flex items-center">
            <span className="text-zinc-900">Only</span>
            <span className="text-[#00AFF0]">Love</span>
          </h1>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 mb-6 text-center">Cadastrar no OnlyLove</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              id="name" 
              type="text"
              className="w-full h-12 px-4 rounded-xl bg-zinc-100 border-transparent focus:bg-white focus:border-[#00AFF0] focus:ring-2 focus:ring-[#00AFF0]/20 transition-all outline-none text-zinc-900 placeholder:text-zinc-500"
              placeholder="Nome" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              id="email" 
              type="email" 
              className="w-full h-12 px-4 rounded-xl bg-zinc-100 border-transparent focus:bg-white focus:border-[#00AFF0] focus:ring-2 focus:ring-[#00AFF0]/20 transition-all outline-none text-zinc-900 placeholder:text-zinc-500"
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="text-[#FF5A5F] text-sm font-medium text-center bg-[#FF5A5F]/10 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full h-12 rounded-full bg-[#00AFF0] hover:bg-[#0091C7] text-white font-bold text-sm uppercase tracking-wide transition-colors mt-2 disabled:opacity-70" 
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <a href="#" className="text-zinc-500 hover:text-zinc-700 text-sm font-medium transition-colors">
            Termos de Serviço
          </a>
          <span className="text-zinc-300 text-xs">•</span>
          <span className="text-zinc-400 text-xs font-medium italic tracking-wide">By kodax</span>
        </div>

        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-zinc-200 flex-1"></div>
          <span className="text-zinc-400 text-sm font-medium uppercase">Ou</span>
          <div className="h-px bg-zinc-200 flex-1"></div>
        </div>

        <div className="space-y-3">
          <button type="button" className="w-full h-12 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-2 text-zinc-700 font-bold text-sm transition-colors">
            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
            Cadastrar com Twitter
          </button>
          <button type="button" className="w-full h-12 rounded-full bg-white border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-2 text-zinc-700 font-bold text-sm transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Cadastrar com Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-900 text-sm">
            Já tem uma conta? <a href="#" className="text-[#00AFF0] hover:text-[#0091C7] font-bold">Entrar</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
