
import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 transition-all hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-emerald-600 text-[10px] font-black bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h3>
            <p className="text-4xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
    );
};

export default StatCard;
