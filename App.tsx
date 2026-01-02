
import React, { useState } from 'react';
import { Pipeline } from './orchestrator/Pipeline';
import { RawProductData } from './types';
import { 
  BeakerIcon, 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  ScaleIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  ExclamationCircleIcon,
  CommandLineIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const DEFAULT_INPUT: RawProductData = {
  "product_name": "GlowBoost Vitamin C Serum",
  "concentration": "10% Vitamin C",
  "skin_type": ["Oily", "Combination"],
  "key_ingredients": ["Vitamin C", "Hyaluronic Acid"],
  "benefits": ["Brightening", "Fades dark spots"],
  "how_to_use": "Apply 2–3 drops in the morning before sunscreen",
  "side_effects": "Mild tingling for sensitive skin",
  "price": "₹699"
};

const App: React.FC = () => {
  const [input, setInput] = useState(JSON.stringify(DEFAULT_INPUT, null, 2));
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<Array<{ step: string; timestamp: string; status: 'success' | 'error' | 'processing' }>>([]);
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState<string>('questions');
  const [error, setError] = useState<string | null>(null);

  const runPipeline = async () => {
    try {
      setError(null);
      setIsRunning(true);
      setLogs([{ step: 'Inference Engine Initialized (LOCAL)', timestamp: new Date().toLocaleTimeString(), status: 'processing' }]);
      setResults({});
      
      const parsedInput = JSON.parse(input);
      const pipeline = new Pipeline(parsedInput, (step, data) => {
        setLogs(prev => [
          ...prev.map(l => l.status === 'processing' ? { ...l, status: 'success' as const } : l),
          { step: `Agent: ${step} validation complete`, timestamp: new Date().toLocaleTimeString(), status: 'processing' as const }
        ]);
        setResults(prev => ({ ...prev, [step]: data }));
      });

      await pipeline.execute();
      setLogs(prev => [
        ...prev.map(l => l.status === 'processing' ? { ...l, status: 'success' as const } : l),
        { step: 'Local Pipeline Finalized', timestamp: new Date().toLocaleTimeString(), status: 'success' }
      ]);
    } catch (err: any) {
      setError(err.message || "Pipeline error.");
      setLogs(prev => [...prev, { step: 'Execution Error', timestamp: new Date().toLocaleTimeString(), status: 'error' }]);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadJson = (key: string) => {
    const data = results[key];
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kasparro_${key}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'questions', label: 'Brainstorm', icon: QuestionMarkCircleIcon },
    { id: 'faq', label: 'FAQ', icon: ChatBubbleLeftRightIcon },
    { id: 'productPage', label: 'Layout', icon: DocumentTextIcon },
    { id: 'comparison', label: 'Market Intel', icon: ScaleIcon }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-100">
              <ShieldCheckIcon className="h-10 w-10 text-white" />
            </div>
            {isRunning && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500"></span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Kasparro Engine</h1>
            <p className="text-slate-500 font-bold text-xs mt-3 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Local Inference Mode (Keyless)
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-xl active:scale-95 ${
              isRunning 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1'
            }`}
          >
            {isRunning ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
            {isRunning ? 'PROCESSING LOCALLY...' : 'EXECUTE SIMULATION'}
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
              <BeakerIcon className="h-4 w-4 text-indigo-500" /> Ground Truth Data
            </h2>
            <div className="relative flex-1">
              <textarea
                className="absolute inset-0 w-full h-full bg-slate-50 p-6 font-mono text-xs leading-relaxed rounded-3xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none text-slate-700 custom-scrollbar"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
              />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200/60 h-80 flex flex-col">
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
              <CommandLineIcon className="h-4 w-4 text-emerald-500" /> Pipeline Logs
            </h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {logs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                  <CommandLineIcon className="h-10 w-10 text-slate-300 mb-4" />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Idle System</p>
                </div>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border animate-fadeIn ${
                  log.status === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 
                  log.status === 'processing' ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                  <div className="mt-0.5">
                    {log.status === 'processing' ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckCircleIcon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-[11px] uppercase tracking-wide">{log.step}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-200/60 flex flex-col min-h-[600px] overflow-hidden">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 mb-2">
                 Output Explorer
              </h2>
              <p className="text-xs font-bold text-slate-500">Validated agent artifacts</p>
            </div>
            <nav className="flex flex-wrap gap-2 bg-slate-100/80 p-2 rounded-[1.5rem] w-full xl:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 xl:flex-none flex items-center justify-center gap-3 px-6 py-3.5 text-xs font-black uppercase tracking-wider rounded-2xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-indigo-600 shadow-xl shadow-slate-200/50 scale-[1.05]' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 bg-[#0F172A] rounded-[2.5rem] overflow-hidden relative border border-slate-800 shadow-2xl">
            {results[activeTab] ? (
              <>
                <div className="absolute top-8 right-8 z-20">
                  <button 
                    onClick={() => downloadJson(activeTab)}
                    className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download
                  </button>
                </div>
                <div className="h-full overflow-auto p-10 custom-scrollbar-dark">
                  <pre className="text-indigo-300 font-mono text-[14px] leading-relaxed">
                    {JSON.stringify(results[activeTab], null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-8">
                <DocumentTextIcon className="h-20 w-20 text-slate-700/50" />
                <p className="text-xs font-bold text-slate-700/40 uppercase tracking-widest">Awaiting Simulation</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=JetBrains+Mono:wght@500&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        pre { font-family: 'JetBrains Mono', monospace; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
