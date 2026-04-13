import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Trash2, Terminal, Activity, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Student {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

export default function TvDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [queries, setQueries] = useState<string[]>([
    "-- Sistema inicializado.",
    "-- Aguardando inserções (INSERT)..."
  ]);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("tv_auth") !== "true") {
      navigate("/tv-login");
      return;
    }

    const timer = setInterval(() => setTime(new Date()), 1000);
    const eventSource = new EventSource('/api/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      setStudents(prev => {
        if (data.length > prev.length) {
          const latest = data[0];
          const timeStr = new Date(latest.timestamp).toLocaleTimeString('pt-BR');
          const sql = `INSERT INTO usuarios (id, nome, email) \nVALUES ('${latest.id}', '${latest.name}', '${latest.email}');`;
          setQueries(q => [sql, ...q].slice(0, 5));
        } else if (data.length === 0 && prev.length > 0) {
          setQueries(q => ["DELETE FROM usuarios; -- Tabela truncada", ...q].slice(0, 5));
        }
        return data;
      });
    };

    return () => {
      clearInterval(timer);
      eventSource.close();
    };
  }, [navigate]);

  const handleClear = async () => {
    await fetch('/api/clear', { method: 'DELETE' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 flex flex-col font-sans relative overflow-hidden selection:bg-[#00AFF0]/30">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#00AFF0]/[0.03] blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AFF0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00AFF0]"></span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Live Database</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white">
            <span className="font-bold">OnlyLove</span> Registros
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono mb-1">
              <Clock className="w-4 h-4" /> {time.toLocaleTimeString('pt-BR')}
            </div>
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              {students.length} {students.length === 1 ? 'Linha' : 'Linhas'}
            </div>
          </div>
          
          <button 
            onClick={handleClear}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.05] hover:border-red-500/20 text-zinc-400 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-wider"
            title="Limpar todos os registros"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Truncate</span>
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Schema & Console */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Schema Panel */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Database className="w-4 h-4" /> Schema
            </h2>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center justify-between group">
                <span className="text-[#00AFF0] group-hover:text-white transition-colors">id</span>
                <span className="text-zinc-600 text-xs">VARCHAR(36) <span className="text-yellow-500/70 ml-1">PK</span></span>
              </div>
              <div className="h-px w-full bg-white/[0.02]"></div>
              <div className="flex items-center justify-between group">
                <span className="text-[#00AFF0] group-hover:text-white transition-colors">nome</span>
                <span className="text-zinc-600 text-xs">VARCHAR(100)</span>
              </div>
              <div className="h-px w-full bg-white/[0.02]"></div>
              <div className="flex items-center justify-between group">
                <span className="text-[#00AFF0] group-hover:text-white transition-colors">email</span>
                <span className="text-zinc-600 text-xs">VARCHAR(255) <span className="text-purple-400/70 ml-1">UQ</span></span>
              </div>
              <div className="h-px w-full bg-white/[0.02]"></div>
              <div className="flex items-center justify-between group">
                <span className="text-[#00AFF0] group-hover:text-white transition-colors">criado_em</span>
                <span className="text-zinc-600 text-xs">TIMESTAMP</span>
              </div>
            </div>
          </div>

          {/* SQL Console */}
          <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md flex flex-col min-h-[250px]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Live Console
            </h2>
            
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-4 pr-2">
              <AnimatePresence>
                {queries.map((query, i) => (
                  <motion.div 
                    key={i + query}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${i === 0 ? 'text-zinc-300' : 'text-zinc-600'} whitespace-pre-wrap break-all`}
                  >
                    <span className="text-[#00AFF0]/50 select-none mr-2">❯</span>
                    {query}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Column: Data Grid */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tabela: usuarios</h2>
            <span className="font-mono text-xs text-zinc-600 hidden sm:block">SELECT * FROM usuarios ORDER BY criado_em DESC</span>
          </div>
          
          <div className="flex-1 overflow-auto p-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-zinc-600 border-b border-white/[0.05]">
                  <th className="pb-4 font-medium w-24">ID</th>
                  <th className="pb-4 font-medium">Nome</th>
                  <th className="pb-4 font-medium">E-mail</th>
                  <th className="pb-4 font-medium text-right">Horário</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                <AnimatePresence>
                  {students.length === 0 && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={4} className="py-12 text-center text-zinc-600 font-sans">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Database className="w-8 h-8 opacity-20" />
                          <p>Nenhum registro encontrado.</p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                  {students.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(0, 175, 240, 0.15)' }}
                      animate={{ opacity: 1, y: 0, backgroundColor: 'transparent' }}
                      transition={{ duration: 1 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 text-zinc-500 truncate max-w-[100px]" title={student.id}>
                        {student.id}
                      </td>
                      <td className="py-4 text-zinc-200">
                        {student.name}
                      </td>
                      <td className="py-4 text-[#00AFF0]/80">
                        {student.email}
                      </td>
                      <td className="py-4 text-zinc-500 text-right">
                        {new Date(student.timestamp).toLocaleTimeString('pt-BR')}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
