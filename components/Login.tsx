
import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2, UserPlus, LogIn, Mail, User, Lock } from 'lucide-react';
import Logo from './Logo';
import { apiService } from '../services/apiService';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            if (isRegister) {
                await apiService.register(formData);
                setIsRegister(false);
                setError("Conta criada! Por favor, faça o login.");
            } else {
                await apiService.login({ username: formData.username, password: formData.password });
                onLogin();
            }
        } catch (err: any) {
            setError(err.message || "A operação falhou");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50">
            <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex p-8 bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 mb-8 border border-slate-100 text-indigo-600">
                        <Logo size={120} />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">Group Debug</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        Cluster de Agentes Autônomos
                    </p>
                </div>

                <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/5">
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                        <button 
                            onClick={() => setIsRegister(false)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isRegister ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            Entrar
                        </button>
                        <button 
                            onClick={() => setIsRegister(true)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isRegister ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            Registrar
                        </button>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 rounded-xl text-xs font-bold ${error.includes('criada') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {isRegister && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="text" required
                                            value={formData.fullName}
                                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                            placeholder="João da Silva"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">E-mail Corporativo</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                            type="email" required
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                            placeholder="joao@empresa.com"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuário</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" required
                                    value={formData.username}
                                    onChange={e => setFormData({...formData, username: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                    placeholder="joaosilva"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="password" required
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <button 
                            disabled={isLoading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-widest mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                            {isLoading ? "Sincronizando..." : isRegister ? "Criar Perfil" : "Autenticar Acesso"}
                        </button>
                    </form>
                </div>
                
                <p className="mt-8 text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    Debugger Cloud Native v4.1.0<br/>Conformidade SOC2 Criptografia Ponta-a-Ponta
                </p>
            </div>
        </div>
    );
};

export default Login;
