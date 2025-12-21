
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import AutomationFlow from './components/AutomationFlow';
import LogViewer from './components/LogViewer';
import CodeDiffView from './components/CodeDiffView';
import KnowledgeBase from './components/KnowledgeBase';
import Login from './components/Login';
import AgentManager from './components/AgentManager';
import { 
    TicketStatus, Ticket, ProcessingLog, AppHealth, 
    UserProfile, BotConfig, ZohoConfig, GitLabConfig,
    Agent, AgentStatus
} from './types';
import { MOCK_TICKETS, STATUS_CONFIG } from './constants';
import { 
    Activity, ArrowLeft, CheckCircle2, Code, Database, 
    ExternalLink, GitPullRequest, Search, ShieldAlert, 
    Terminal, Workflow, Zap, Filter, RefreshCcw, 
    User, ShieldCheck, Loader2, Save, Plus, Trash2, Mail, Globe, Brain,
    X, Bot, Smartphone, Building, Timer
} from 'lucide-react';
import { apiService } from './services/apiService';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [health, setHealth] = useState<AppHealth | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [logs, setLogs] = useState<ProcessingLog[]>([]);
    
    const [zohoConfigs, setZohoConfigs] = useState<ZohoConfig[]>([]);
    const [gitlabConfigs, setGitlabConfigs] = useState<GitLabConfig[]>([]);

    // Modais de Configuração
    const [showZohoModal, setShowZohoModal] = useState(false);
    const [showGitLabModal, setShowGitLabModal] = useState(false);
    const [newZoho, setNewZoho] = useState<ZohoConfig>({ configName: '', orgId: '', clientId: '', clientSecret: '', refreshToken: '', webhookSecret: '', isActive: true });
    const [newGitLab, setNewGitLab] = useState<GitLabConfig>({ configName: '', gitlabUrl: 'https://gitlab.com', personalToken: '', username: '', defaultBranch: 'main', isActive: true });

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [p, h, t, a] = await Promise.all([
                apiService.getProfile(),
                apiService.getSystemHealth(),
                apiService.getAllTickets(),
                apiService.getAgents()
            ]);
            setProfile(p);
            setHealth(h);
            setTickets(t);
            setAgents(a);
        } catch (err) {
            console.error("Falha ao carregar dados", err);
            setTickets(MOCK_TICKETS);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadConfigs = useCallback(async () => {
        try {
            const [z, g] = await Promise.all([
                apiService.getZohoConfigs(),
                apiService.getGitLabConfigs()
            ]);
            setZohoConfigs(z);
            setGitlabConfigs(g);
        } catch (err) {
            console.error("Falha ao carregar configurações");
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
            loadConfigs();
        }
    }, [isAuthenticated, loadData, loadConfigs]);

    useEffect(() => {
        let interval: any;
        if (selectedTicket) {
            apiService.getTicketLogs(selectedTicket.id).then(setLogs);
            if ([TicketStatus.PROCESSING, TicketStatus.ANALYZING, TicketStatus.FIXING].includes(selectedTicket.status)) {
                interval = setInterval(async () => {
                    const updated = await apiService.getTicketById(selectedTicket.id);
                    const freshLogs = await apiService.getTicketLogs(selectedTicket.id);
                    setLogs(freshLogs);
                    setSelectedTicket(updated);
                    if (![TicketStatus.PROCESSING, TicketStatus.ANALYZING, TicketStatus.FIXING].includes(updated.status)) clearInterval(interval);
                }, 5000);
            }
        }
        return () => clearInterval(interval);
    }, [selectedTicket]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // Agent Handlers
    const handleToggleAgent = async (agent: Agent) => {
        setIsLoading(true);
        try {
            if (agent.status === AgentStatus.ACTIVE) {
                await apiService.deactivateAgent(agent.id);
            } else {
                await apiService.activateAgent(agent.id);
            }
            await loadData();
        } catch (err) {
            alert("Erro ao alterar status do agente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAgent = async (id: string) => {
        if (!confirm("Remover este agente permanentemente?")) return;
        try {
            await apiService.deleteAgent(id);
            await loadData();
        } catch (err) {
            alert("Erro ao excluir agente.");
        }
    };

    const handleCreateAgent = async (agent: Partial<Agent>) => {
        setIsLoading(true);
        try {
            await apiService.createAgent(agent);
            await loadData();
        } catch (err) {
            alert("Erro ao criar agente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateAgent = async (id: string, agent: Partial<Agent>) => {
        setIsLoading(true);
        try {
            await apiService.updateAgent(id, agent);
            await loadData();
        } catch (err) {
            alert("Erro ao atualizar agente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddZoho = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await apiService.addZohoConfig(newZoho);
            await loadConfigs();
            setShowZohoModal(false);
            setNewZoho({ configName: '', orgId: '', clientId: '', clientSecret: '', refreshToken: '', webhookSecret: '', isActive: true });
        } catch (err) {
            alert("Erro ao adicionar conexão Zoho.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddGitLab = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await apiService.addGitLabConfig(newGitLab);
            await loadConfigs();
            setShowGitLabModal(false);
            setNewGitLab({ configName: '', gitlabUrl: 'https://gitlab.com', personalToken: '', username: '', defaultBranch: 'main', isActive: true });
        } catch (err) {
            alert("Erro ao adicionar conexão GitLab.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!profile) return;
        setIsSaving(true);
        try {
            const updated = await apiService.updateProfile(profile);
            setProfile(updated);
            alert("Perfil atualizado!");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <Sidebar activeTab={activeTab === 'details' ? 'tickets' : activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-16 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                Nó do Cluster: {profile?.username || 'admin'}
                            </h1>
                        </div>
                        <p className="text-4xl font-black tracking-tight">
                            {activeTab === 'dashboard' && "Centro de Comando"}
                            {activeTab === 'agents' && "Orquestração de Agentes"}
                            {activeTab === 'tickets' && "Pipeline de Execução"}
                            {activeTab === 'health' && "Telemetria & Logs"}
                            {activeTab === 'settings' && "Rede de Integrações"}
                            {activeTab === 'profile' && "Perfil Autorizado"}
                            {activeTab === 'details' && "Rastro de Operação"}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={loadData}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                        >
                            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                                {profile?.fullName?.charAt(0) || <User size={20} />}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-900">{profile?.fullName || 'Carregando...'}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sessão Ativa</p>
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <StatCard label="Agentes Ativos" value={health?.activeAgents || agents.filter(a => a.status === AgentStatus.ACTIVE).length} icon={<Bot size={28} />} color="bg-indigo-50 text-indigo-600" />
                            <StatCard label="Tickets Pendentes" value={health?.pending || tickets.filter(t => t.status === TicketStatus.PENDING).length} icon={<Zap size={28} />} color="bg-blue-50 text-blue-600" />
                            <StatCard label="Ciclo Médio (s)" value={health?.averageProcessingTimeMs ? (health.averageProcessingTimeMs / 1000).toFixed(1) : '---'} icon={<Timer size={28} />} color="bg-amber-50 text-amber-600" />
                            <StatCard label="Correções Efetuadas" value={health?.completed || tickets.filter(t => t.status === TicketStatus.COMPLETED).length} icon={<CheckCircle2 size={28} />} color="bg-emerald-50 text-emerald-600" trend="+12%" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/30">
                            <h2 className="text-xl font-black mb-8 flex items-center gap-4"><Workflow size={24} className="text-indigo-600"/> Últimas Atividades</h2>
                            <div className="divide-y divide-slate-100">
                                {tickets.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum ticket processado ainda.</div>
                                ) : tickets.slice(0, 10).map(t => (
                                    <div key={t.id} className="py-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-2xl px-4 transition-all" onClick={() => { setSelectedTicket(t); setActiveTab('details'); }}>
                                        <div className="flex items-center gap-6">
                                            <div className={`p-3 rounded-xl border ${STATUS_CONFIG[t.status].color}`}>{STATUS_CONFIG[t.status].icon}</div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{t.subject}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.ticketNumber} • {t.status}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <span className="text-xs font-black text-slate-900">{new Date(t.createdAt).toLocaleDateString()}</span>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowLeft size={14} className="rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'agents' && (
                    <AgentManager 
                        agents={agents} 
                        onToggle={handleToggleAgent} 
                        onDelete={handleDeleteAgent} 
                        onCreate={handleCreateAgent}
                        onUpdate={handleUpdateAgent}
                        isLoading={isLoading} 
                    />
                )}

                {activeTab === 'tickets' && (
                    <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/30 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black">Fluxo Global de Tickets</h2>
                            <div className="flex gap-2">
                                {Object.values(TicketStatus).map(status => (
                                    <span key={status} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_CONFIG[status].color}`}>
                                        {status.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {tickets.length === 0 ? (
                                <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em]">Fila Vazia</div>
                            ) : tickets.map(t => (
                                <div key={t.id} onClick={() => { setSelectedTicket(t); setActiveTab('details'); }} className="p-8 border border-slate-100 rounded-3xl hover:border-indigo-200 hover:bg-indigo-50/10 cursor-pointer transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl border ${STATUS_CONFIG[t.status].color}`}>{STATUS_CONFIG[t.status].icon}</div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-black text-indigo-600">{t.ticketNumber}</span>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${['HIGH', 'CRITICAL'].includes(t.priority) ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>{t.priority}</span>
                                            </div>
                                            <h3 className="font-black text-lg text-slate-900">{t.subject}</h3>
                                            <p className="text-sm text-slate-400 mt-1">{t.repositoryName || 'Identificação pendente...'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Entrada</p>
                                        <p className="text-sm font-black text-slate-900">{new Date(t.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-10">
                            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-blue-600"><Globe size={32} /> Gateways Zoho Desk</h3>
                                <div className="space-y-4">
                                    {zohoConfigs.map(config => (
                                        <div key={config.id} className={`p-6 bg-slate-50 rounded-2xl border flex items-center justify-between ${config.isActive ? 'border-blue-200' : 'border-slate-200 opacity-60'}`}>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-slate-900">{config.configName}</p>
                                                    {config.isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                                                </div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Org: {config.orgId} • Cliente: {config.clientId}</p>
                                            </div>
                                            <button onClick={() => apiService.deleteZohoConfig(config.id!).then(loadConfigs)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowZohoModal(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Adicionar Gateway Zoho
                                    </button>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-10">
                            <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-orange-600"><GitPullRequest size={32} /> Clusters GitLab</h3>
                                <div className="space-y-4">
                                    {gitlabConfigs.map(config => (
                                        <div key={config.id} className={`p-6 bg-slate-50 rounded-2xl border flex items-center justify-between ${config.isActive ? 'border-orange-200' : 'border-slate-200 opacity-60'}`}>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-slate-900">{config.configName}</p>
                                                    {config.isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>}
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-mono">User: {config.username} • {config.gitlabUrl}</p>
                                            </div>
                                            <button onClick={() => apiService.deleteGitLabConfig(config.id!).then(loadConfigs)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowGitLabModal(true)} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                        <Plus size={18} /> Conectar Cluster GitLab
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && profile && (
                    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in duration-500">
                        <section className="bg-white border border-slate-200 rounded-[3.5rem] p-16 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                                    <div className="w-40 h-40 bg-indigo-600 text-white rounded-[3.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-600/30">
                                        {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover rounded-[3.5rem]" alt="Avatar" /> : profile.fullName.charAt(0)}
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-5xl font-black text-slate-900 mb-2">{profile.fullName}</h2>
                                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Membro de {profile.company || 'Group Debug'}</p>
                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                            <span className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 flex items-center gap-2"><Building size={12}/> {profile.department || 'Operações'}</span>
                                            <span className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 flex items-center gap-2"><Globe size={12}/> {profile.timezone || 'UTC'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nome de Usuário</label>
                                        <input type="text" value={profile.username} disabled className="w-full bg-slate-200/50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-500 cursor-not-allowed" />
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail Corporativo</label>
                                        <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none" />
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Departamento</label>
                                        <input type="text" value={profile.department || ''} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none" />
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Telefone</label>
                                        <input type="text" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 focus:ring-4 focus:ring-indigo-100 outline-none" />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleUpdateProfile}
                                    disabled={isSaving}
                                    className="mt-12 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center mx-auto gap-3"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Preservar Alterações
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'details' && selectedTicket && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] -mr-40 -mt-40"></div>
                                <div className="relative z-10 space-y-10">
                                    <button onClick={() => { setSelectedTicket(null); setActiveTab('tickets'); }} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-[0.3em]"><ArrowLeft size={18} /><span>Voltar à Fila</span></button>
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black tracking-widest border border-indigo-100 uppercase">{selectedTicket.ticketNumber}</span>
                                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[selectedTicket.status].color}`}>{selectedTicket.status.replace(/_/g, ' ')}</div>
                                        </div>
                                        <h1 className="text-5xl font-black text-slate-900 mb-6 leading-[1.1]">{selectedTicket.subject}</h1>
                                        <p className="text-slate-500 leading-relaxed text-xl font-medium">{selectedTicket.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Alvo de Repositório</p>
                                            <p className="font-mono text-indigo-600 font-black">{selectedTicket.repositoryName || 'Em busca...'}</p>
                                        </div>
                                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Zoho Desk Reference</p>
                                            <p className="font-mono text-slate-600 font-black">{selectedTicket.zohoTicketId}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <KnowledgeBase repoName={selectedTicket.repositoryName || 'Análise Central'} />
                            <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50">
                                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="font-black text-xl flex items-center gap-4 text-slate-900"><Terminal size={24} className="text-slate-400" />Logs em Tempo Real</h3>
                                </div>
                                <LogViewer logs={logs} />
                            </div>
                        </div>
                        <div className="space-y-10">
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl shadow-slate-200/50">
                                <h3 className="font-black text-xl mb-12 flex items-center gap-4 text-slate-900"><Zap size={24} className="text-indigo-600" />Pipeline de Corretor</h3>
                                <AutomationFlow logs={logs} currentStatus={selectedTicket.status} />
                            </div>
                            {selectedTicket.pullRequestUrl && (
                                <a href={selectedTicket.pullRequestUrl} target="_blank" rel="noreferrer" className="block w-full p-8 bg-slate-900 text-white rounded-[2.5rem] text-center font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                                    <GitPullRequest size={24} className="inline mr-3" />
                                    Auditar PR no GitLab
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'health' && health && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="bg-white border border-slate-200 rounded-[3.5rem] p-16 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div>
                                <h2 className="text-5xl font-black mb-4 text-slate-900">Telemetria de Rede</h2>
                                <p className="text-slate-500 text-xl font-medium">Status operacional dos recursos e integrações do cluster.</p>
                            </div>
                            <div className="px-10 py-5 bg-emerald-50 text-emerald-600 rounded-[2.5rem] border border-emerald-100 font-black flex items-center gap-4">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                CLUSTER {health.status.toUpperCase()}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-black mb-10 flex items-center gap-4"><Zap size={28} className="text-indigo-600" />Carga de Tickets</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Total Processado</span>
                                        <span className="font-black text-slate-900">{health.totalTickets}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Analisando Agora</span>
                                        <span className="font-black text-indigo-600">{health.analyzing}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Correções em Curso</span>
                                        <span className="font-black text-amber-600">{health.fixing}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-black mb-10 flex items-center gap-4"><CheckCircle2 size={28} className="text-emerald-600" />Taxa de Sucesso</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Concluídos</span>
                                        <span className="font-black text-emerald-600">{health.completed}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Falhas Críticas</span>
                                        <span className="font-black text-rose-600">{health.failed}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Eficiência Global</span>
                                        <span className="font-black text-slate-900">{health.totalTickets ? ((health.completed / health.totalTickets) * 100).toFixed(1) : 0}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-xl shadow-slate-200/50">
                                <h3 className="text-2xl font-black mb-10 flex items-center gap-4"><Activity size={28} className="text-blue-600" />Recursos</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Agentes Ativos</span>
                                        <span className="font-black text-blue-600">{health.activeAgents}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4">
                                        <span className="font-black text-slate-400 text-xs uppercase tracking-widest">Latência Média</span>
                                        <span className="font-black text-slate-900">{(health.averageProcessingTimeMs / 1000).toFixed(1)}s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal Zoho */}
            {showZohoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black">Conexão Zoho Desk</h3>
                            <button onClick={() => setShowZohoModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddZoho} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Identificação do Gateway</label>
                                <input required type="text" value={newZoho.configName} onChange={e => setNewZoho({...newZoho, configName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="Zoho Produção" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Organization ID</label>
                                    <input required type="text" value={newZoho.orgId} onChange={e => setNewZoho({...newZoho, orgId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="123456" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Client ID</label>
                                    <input required type="text" value={newZoho.clientId} onChange={e => setNewZoho({...newZoho, clientId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="1000.xxx" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Client Secret Key</label>
                                <input required type="password" value={newZoho.clientSecret} onChange={e => setNewZoho({...newZoho, clientSecret: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Refresh Token Oauth</label>
                                <input required type="text" value={newZoho.refreshToken} onChange={e => setNewZoho({...newZoho, refreshToken: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="1000.xxx" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Webhook Secret</label>
                                <input type="text" value={newZoho.webhookSecret} onChange={e => setNewZoho({...newZoho, webhookSecret: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="Secret Key" />
                            </div>
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                                {isSaving ? <Loader2 size={18} className="animate-spin inline mr-2" /> : <Plus size={18} className="inline mr-2" />}
                                Sincronizar Gateway
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal GitLab */}
            {showGitLabModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-[3rem] p-12 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black">Cluster de Repositórios</h3>
                            <button onClick={() => setShowGitLabModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleAddGitLab} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Nome do Cluster</label>
                                <input required type="text" value={newGitLab.configName} onChange={e => setNewGitLab({...newGitLab, configName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="GitLab Enterprise" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Instância GitLab (URL)</label>
                                <input required type="url" value={newGitLab.gitlabUrl} onChange={e => setNewGitLab({...newGitLab, gitlabUrl: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="https://gitlab.com" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Bot Username</label>
                                <input required type="text" value={newGitLab.username} onChange={e => setNewGitLab({...newGitLab, username: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="bot-user" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Default Branch</label>
                                    <input required type="text" value={newGitLab.defaultBranch} onChange={e => setNewGitLab({...newGitLab, defaultBranch: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="main" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Personal Token</label>
                                    <input required type="password" value={newGitLab.personalToken} onChange={e => setNewGitLab({...newGitLab, personalToken: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-black text-sm" placeholder="glpat-..." />
                                </div>
                            </div>
                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                                {isSaving ? <Loader2 size={18} className="animate-spin inline mr-2" /> : <Plus size={18} className="inline mr-2" />}
                                Ativar Runner do Cluster
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
