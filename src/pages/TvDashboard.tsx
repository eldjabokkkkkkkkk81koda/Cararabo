import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Trash2, Key, Terminal, Table as TableIcon, Clock, Activity, AlignLeft, Calendar } from "lucide-react";
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
    "-- Sistema de Banco de Dados inicializado.",
    "-- Aguardando instruções SQL (INSERT)..."
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
          const sql = `INSERT INTO usuarios (id, nome, email, criado_em) \nVALUES ('${latest.id}', '${latest.name}', '${latest.email}', '${timeStr}');`;
          setQueries(q => [sql, ...q].slice(0, 6));
        } else if (data.length === 0 && prev.length > 0) {
          setQueries(q => ["DELETE FROM usuarios; -- Tabela truncada", ...q].slice(0, 6));
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
    <div className="min-h-screen bg-[#0D1117] text-zinc-300 p-6 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg">
            <Database className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Demonstração: Modelagem de Dados</h1>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="text-green-400 flex items-center gap-1.5 font-medium">
                <Activity className="w-4 h-4 animate-pulse" /> Conectado ao Servidor
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4" /> {time.toLocaleTimeString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <div className="text-3xl font-mono font-bold text-zinc-100 leading-none">{students.length}</div>
            <div className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold mt-1">Tuplas (Linhas)</div>
          </div>
          <button 
            onClick={handleClear}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-bold uppercase text-xs tracking-wider"
          >
            <Trash2 className="w-4 h-4" />
            Truncate Table
          </button>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Panel: Schema Definition */}
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-[#161B22] border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Esquema Lógico (Schema)</h2>
            </div>
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">TABLE</span>
                <span className="font-mono font-bold text-zinc-100">usuarios</span>
              </div>
              
              <div className="space-y-2">
                {/* ID Column */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-800/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="font-mono text-sm text-zinc-200">id</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-purple-400">VARCHAR(36)</div>
                    <div className="font-mono text-[10px] text-yellow-500/80">PRIMARY KEY</div>
                  </div>
                </div>

                {/* Name Column */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-800/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-sm text-zinc-200">nome</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-purple-400">VARCHAR(100)</div>
                    <div className="font-mono text-[10px] text-zinc-500">NOT NULL</div>
                  </div>
                </div>

                {/* Email Column */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-800/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-sm text-zinc-200">email</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-purple-400">VARCHAR(255)</div>
                    <div className="font-mono text-[10px] text-blue-400/80">UNIQUE</div>
                  </div>
                </div>

                {/* Timestamp Column */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-800/30 border border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-sm text-zinc-200">criado_em</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-purple-400">TIMESTAMP</div>
                    <div className="font-mono text-[10px] text-zinc-500">DEFAULT NOW()</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SQL Console */}
          <div className="flex-1 bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
            <div className="bg-zinc-900/80 border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Console SQL</h2>
            </div>
            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3">
              <AnimatePresence>
                {queries.map((query, i) => (
                  <motion.div 
                    key={i + query}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${i === 0 ? 'text-green-400' : 'text-zinc-600'} whitespace-pre-wrap break-all`}
                  >
                    <span className="text-zinc-700 select-none">{"> "}</span>
                    {query}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Panel: Data Grid */}
        <div className="flex-1 bg-[#161B22] border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
          <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">Registros (Data Grid)</h2>
            </div>
            <div className="font-mono text-xs text-zinc-500">
              SELECT * FROM usuarios ORDER BY criado_em DESC;
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left font-mono text-xs font-semibold text-zinc-400 w-24">id (PK)</th>
                  <th className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left font-mono text-xs font-semibold text-zinc-400">nome</th>
                  <th className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left font-mono text-xs font-semibold text-zinc-400">email</th>
                  <th className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-left font-mono text-xs font-semibold text-zinc-400 w-32">criado_em</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} className="border border-zinc-800 px-3 py-8 text-center text-zinc-600 font-mono text-sm">
                        0 rows returned
                      </td>
                    </tr>
                  )}
                  {students.map((student, index) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      transition={{ duration: 1.5 }}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="border border-zinc-800 px-3 py-2 font-mono text-xs text-yellow-500/80 truncate max-w-[100px]" title={student.id}>
                        {student.id}
                      </td>
                      <td className="border border-zinc-800 px-3 py-2 font-mono text-sm text-zinc-300">
                        {student.name}
                      </td>
                      <td className="border border-zinc-800 px-3 py-2 font-mono text-sm text-blue-300">
                        {student.email}
                      </td>
                      <td className="border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-500">
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
