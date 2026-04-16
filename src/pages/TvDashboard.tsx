import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Trash2, Terminal, Clock, MoreVertical, ExternalLink, BarChart3, Trophy, Play, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, animate } from "motion/react";

interface Student {
  id: string;
  name: string;
  email: string;
  teacher: string;
  timestamp: string;
}

function AnimatedCounter({ value }: { value: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      const controls = animate(parseFloat(node.textContent || "0"), value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(v) {
          node.textContent = v.toFixed(1) + "%";
        },
      });
      return () => controls.stop();
    }
  }, [value]);

  return <span ref={nodeRef}>0.0%</span>;
}

export default function TvDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [queries, setQueries] = useState<string[]>([
    "-- Sistema inicializado.",
    "-- Aguardando inserções (INSERT)..."
  ]);
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'stats'>('table');
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");

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
          const sql = `INSERT INTO usuarios (id, nome, email, professor) \nVALUES ('${latest.id}', '${latest.name}', '${latest.email}', '${latest.teacher}');`;
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

  const runSimulation = async () => {
    if (isSimulating || students.length === 0) return;
    setIsSimulating(true);
    setViewMode('table');
    setTypedQuery("");

    const targetQuery = "SELECT professor, ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM usuarios), 1) as porcentagem \nFROM usuarios \nGROUP BY professor \nORDER BY porcentagem DESC;";
    
    let currentText = "";
    for (let i = 0; i < targetQuery.length; i++) {
      currentText += targetQuery[i];
      setTypedQuery(currentText);
      await new Promise(r => setTimeout(r, 35)); // Typing speed
    }

    await new Promise(r => setTimeout(r, 600)); // Pause for dramatic effect
    
    setQueries(q => [targetQuery, ...q].slice(0, 5));
    setTypedQuery("");
    setViewMode('stats');
    setIsSimulating(false);
  };

  // Calculate stats
  const totalStudents = students.length || 1;
  const stats = students.reduce((acc, curr) => {
    acc[curr.teacher] = (acc[curr.teacher] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedStats = Object.entries(stats)
    .map(([teacher, count]) => [teacher, (count / totalStudents) * 100] as [string, number])
    .sort((a, b) => b[1] - a[1]);

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
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden md:block">
            <div className="flex items-center justify-end gap-2 text-zinc-500 text-sm font-mono mb-1">
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
            <span className="hidden lg:inline">Truncate</span>
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
                <span className="text-[#00AFF0] group-hover:text-white transition-colors">professor</span>
                <span className="text-zinc-600 text-xs">VARCHAR(50)</span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Live Console
              </h2>
              <button 
                onClick={runSimulation}
                disabled={isSimulating || students.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00AFF0]/10 hover:bg-[#00AFF0]/20 text-[#00AFF0] transition-colors text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                title="Simular Consulta de Agrupamento"
              >
                <Play className="w-3 h-3" /> Executar
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-xs space-y-4 pr-2">
              <AnimatePresence>
                {isSimulating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 whitespace-pre-wrap break-all"
                  >
                    <span className="text-[#00AFF0]/50 select-none mr-2">❯</span>
                    {typedQuery}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-3 bg-green-400 ml-1 align-middle"
                    />
                  </motion.div>
                )}
                {queries.map((query, i) => (
                  <motion.div 
                    key={i + query}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${i === 0 && !isSimulating ? 'text-zinc-300' : 'text-zinc-600'} whitespace-pre-wrap break-all`}
                  >
                    <span className="text-[#00AFF0]/50 select-none mr-2">❯</span>
                    {query}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Column: Data Grid or Stats */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md flex flex-col overflow-hidden">
          
          {viewMode === 'table' ? (
            <>
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
                      <th className="pb-4 font-medium">Professor</th>
                      <th className="pb-4 font-medium text-right">Horário</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-sm">
                    <AnimatePresence>
                      {students.length === 0 && (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td colSpan={5} className="py-12 text-center text-zinc-600 font-sans">
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
                          <td className="py-4 text-zinc-400">
                            {student.email}
                          </td>
                          <td className="py-4 text-[#00AFF0]/80">
                            {student.teacher}
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
            </>
          ) : (
            <>
              <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewMode('table')}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all"
                    title="Voltar para Tabela"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#00AFF0]">Agrupamento de Dados</h2>
                </div>
                <span className="font-mono text-xs text-zinc-600 hidden sm:block">GROUP BY professor</span>
              </div>
              
              <div className="flex-1 overflow-auto p-8 flex flex-col justify-center">
                {students.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-zinc-600">
                    <BarChart3 className="w-12 h-12 opacity-20 mb-2" />
                    <p>Aguardando dados para gerar estatísticas.</p>
                  </div>
                ) : (
                  <div className="space-y-8 max-w-2xl mx-auto w-full">
                    {sortedStats.map(([teacher, percentage], index) => {
                      const isWinner = index === 0 && percentage > 0;
                      
                      return (
                        <div key={teacher} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-lg font-medium text-zinc-200 flex items-center gap-2">
                              {teacher}
                              {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                            </span>
                            <span className="text-2xl font-bold text-white font-mono">
                              <AnimatedCounter value={percentage} />
                            </span>
                          </div>
                          <div className="h-4 w-full bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={`h-full rounded-full ${isWinner ? 'bg-[#00AFF0]' : 'bg-zinc-600'}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
