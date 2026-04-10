import { useEffect, useState } from "react";
import { Database, Users, Activity, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Student {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

export default function TvDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Clock interval
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Connect to the Server-Sent Events endpoint
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStudents(data);
    };

    return () => {
      clearInterval(timer);
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8 flex flex-col relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="relative flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-8 bg-zinc-950/50 backdrop-blur-md z-10 rounded-2xl px-6 pt-6">
        <div className="flex items-center gap-5">
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Database className="w-12 h-12 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Live Database Monitor</h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-blue-400 text-lg flex items-center gap-2 font-medium">
                <Activity className="w-5 h-5 animate-pulse" />
                Conexão Ativa
              </p>
              <div className="w-1 h-1 rounded-full bg-zinc-700"></div>
              <p className="text-zinc-400 text-lg flex items-center gap-2 font-mono">
                <Clock className="w-5 h-5" />
                {time.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700/50 px-8 py-4 rounded-2xl flex items-center gap-5 shadow-xl">
          <Users className="w-10 h-10 text-zinc-400" />
          <div className="text-5xl font-mono font-bold text-white">{students.length}</div>
          <div className="text-zinc-500 uppercase tracking-widest text-sm font-bold leading-tight">Registros<br/>Recebidos</div>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden flex flex-col z-10 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-zinc-800/80 text-zinc-400 uppercase tracking-widest font-bold text-sm bg-zinc-950/50">
          <div className="col-span-4">Nome do Usuário</div>
          <div className="col-span-5">E-mail</div>
          <div className="col-span-3 text-right">Horário de Inserção</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {students.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-6"
              >
                <div className="relative">
                  <Database className="w-24 h-24 opacity-20" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-medium text-zinc-400">Aguardando dados...</p>
                  <p className="text-xl">Peça para os alunos fazerem login pelo celular.</p>
                </div>
              </motion.div>
            )}
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: Math.min(index * 0.05, 0.5) }}
                className="grid grid-cols-12 gap-4 px-8 py-6 bg-zinc-900/80 border border-zinc-700/50 rounded-2xl items-center shadow-lg hover:border-blue-500/50 transition-colors group relative overflow-hidden"
              >
                {/* Highlight bar for the newest item */}
                {index === 0 && (
                  <motion.div 
                    layoutId="newest-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  />
                )}
                
                <div className="col-span-4 font-medium text-2xl text-zinc-100 truncate group-hover:text-white transition-colors">{student.name}</div>
                <div className="col-span-5 text-zinc-400 text-xl font-mono truncate">{student.email}</div>
                <div className="col-span-3 text-right text-blue-400/80 font-mono text-xl">
                  {new Date(student.timestamp).toLocaleTimeString('pt-BR')}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
