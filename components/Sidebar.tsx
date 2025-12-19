
import React from 'react';
import { LayoutDashboard, Ticket, Activity, Settings, User, LogOut } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Painel Geral', icon: <LayoutDashboard size={20} /> },
        { id: 'tickets', label: 'Agente de Tickets', icon: <Ticket size={20} /> },
        { id: 'health', label: 'Saúde do Sistema', icon: <Activity size={20} /> },
        { id: 'settings', label: 'IA & Integrações', icon: <Settings size={20} /> },
        { id: 'profile', label: 'Meu Perfil', icon: <User size={20} /> },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
            <div className="p-8 flex items-center gap-3">
                <div className="text-indigo-600">
                    <Logo size={48} />
                </div>
                <div>
                    <h1 className="font-black text-xl tracking-tight text-slate-900">Group Debug</h1>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Multi-Agente</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${
                            activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                        }`}
                    >
                        {item.icon}
                        <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-100">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all"
                >
                    <LogOut size={18} />
                    Encerrar Sessão
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
