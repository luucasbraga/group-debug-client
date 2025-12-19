
import React, { useState } from 'react';
import { Agent, AgentStatus } from '../types';
import { 
    Plus, Bot, Shield, Trash2, Power, 
    Settings2, Cpu, Database, Network, 
    Loader2, X, Brain, Terminal, Info
} from 'lucide-react';

interface AgentManagerProps {
    agents: Agent[];
    onToggle: (agent: Agent) => void;
    onDelete: (id: string) => void;
    onCreate: (agent: Partial<Agent>) => void;
    isLoading?: boolean;
}

const AgentManager: React.FC<AgentManagerProps> = ({ agents, onToggle, onDelete, onCreate, isLoading }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAgent, setNewAgent] = useState<Partial<Agent>>({
        agentName: '',
        agentDescription: '',
        llmProvider: 'anthropic',
        llmModel: 'claude-3-5-sonnet-20241022',
        llmMaxTokens: 4096,
        llmTemperature: 0.3,
        autoProcessTickets: true,
        maxConcurrentTickets: 5,
        gitWorkspaceDir: '/tmp/repos'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newAgent);
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <header className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/30">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1">Meus Operadores</h2>
                    <p className="text-slate-500 font-medium">Gerencie sua força de trabalho autônoma.</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} /> Instanciar Agente
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {agents.length === 0 && !isLoading && (
                    <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
                            <Bot size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Nenhum agente ativo no cluster</h3>
                        <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Instancie seu primeiro agente para começar a processar tickets do Zoho automaticamente.</p>
                    </div>
                )}

                {agents.map((agent) => (
                    <div key={agent.id} className={`bg-white border p-1 rounded-[3rem] transition-all duration-300 shadow-xl shadow-slate-200/20 group relative ${
                        agent.status === AgentStatus.ACTIVE ? 'border-indigo-500/30' : 'border-slate-100'
                    }`}>
                        <div className="p-10 space-y-8">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-6 items-center">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${
                                        agent.status === AgentStatus.ACTIVE ? 'bg-indigo-600 shadow-indigo-500/40 rotate-12 scale-110' : 'bg-slate-300 shadow-slate-200/40 grayscale'
                                    }`}>
                                        <Bot size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900">{agent.agentName}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`w-2 h-2 rounded-full ${agent.status === AgentStatus.ACTIVE ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{agent.status === AgentStatus.ACTIVE ? 'Ativo & Operante' : 'Desativado'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onToggle(agent)}
                                        className={`p-4 rounded-2xl transition-all border ${
                                            agent.status === AgentStatus.ACTIVE 
                                            ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100' 
                                            : 'bg-emerald-50 border-emerald-100 text-emerald-500 hover:bg-emerald-100'
                                        }`}
                                    >
                                        <Power size={22} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(agent.id)}
                                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm font-medium leading-relaxed bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                {agent.agentDescription || "Sem descrição definida para este operador."}
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                                    <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Provedor IA</label>
                                    <p className="text-xs font-black text-indigo-600 uppercase">{agent.llmProvider}</p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                                    <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Tickets/Hora</label>
                                    <p className="text-xs font-black text-slate-900">{agent.maxConcurrentTickets}</p>
                                </div>
                                <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                                    <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Workspace</label>
                                    <p className="text-xs font-mono text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">{agent.gitWorkspaceDir}</p>
                                </div>
                            </div>

                            {agent.lastActiveAt && (
                                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <Network size={12} /> Última atividade em: {new Date(agent.lastActiveAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Criação */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 overflow-y-auto">
                    <div className="bg-white rounded-[3.5rem] p-12 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 relative my-auto">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex gap-4 items-center">
                                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <Brain size={28} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900">Novo Operador</h3>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Defina os parâmetros do agente</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Codinome do Agente</label>
                                        <input required type="text" value={newAgent.agentName} onChange={e => setNewAgent({...newAgent, agentName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm text-slate-900" placeholder="Ex: Agente Produção" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Descrição Operacional</label>
                                        <textarea value={newAgent.agentDescription} onChange={e => setNewAgent({...newAgent, agentDescription: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-medium text-sm text-slate-600 h-24" placeholder="Para que este agente serve?" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Provedor LLM</label>
                                        <select value={newAgent.llmProvider} onChange={e => setNewAgent({...newAgent, llmProvider: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-xs uppercase tracking-widest">
                                            <option value="anthropic">Anthropic Claude</option>
                                            <option value="google">Google Gemini</option>
                                            <option value="openai">OpenAI GPT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Modelo de IA</label>
                                        <input type="text" value={newAgent.llmModel} onChange={e => setNewAgent({...newAgent, llmModel: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-mono text-xs" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">API Key</label>
                                            <input required type="password" value={newAgent.llmApiKey} onChange={e => setNewAgent({...newAgent, llmApiKey: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-mono text-xs" placeholder="sk-..." />
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Max Concorrente</label>
                                            <input type="number" value={newAgent.maxConcurrentTickets} onChange={e => setNewAgent({...newAgent, maxConcurrentTickets: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                                <Info className="text-indigo-600 shrink-0 mt-1" size={20} />
                                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                                    Ao instanciar este agente, ele ficará inicialmente em estado <strong className="font-black">INATIVO</strong>. Ative-o no painel para iniciar o processamento de tickets pendentes.
                                </p>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Terminal size={20} />}
                                Implantar Agente no Cluster
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentManager;
