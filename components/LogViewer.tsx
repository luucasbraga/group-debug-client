
import React from 'react';
import { ProcessingLog } from '../types';

interface LogViewerProps {
    logs: ProcessingLog[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">Saída da Pipeline</span>
            </div>
            <div className="p-8 h-[500px] overflow-y-auto font-mono text-sm space-y-3 bg-slate-50/50">
                {logs.length === 0 && (
                    <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase tracking-widest text-xs italic">
                        Nó ocioso. Aguardando entrada de tickets...
                    </div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-6 group hover:bg-white p-3 rounded-xl transition-all border border-transparent hover:border-slate-100">
                        <span className="text-slate-400 shrink-0 select-none font-bold">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}
                        </span>
                        <div className="flex-1">
                            <span className={`font-black mr-3 text-xs uppercase tracking-widest ${
                                log.status === 'success' ? 'text-emerald-600' : 
                                log.status === 'failure' ? 'text-rose-600' : 
                                'text-amber-600'
                            }`}>
                                [{log.step}]
                            </span>
                            <span className="text-slate-700 font-medium">{log.message}</span>
                            {log.errorDetails && (
                                <div className="mt-3 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-xs font-bold">
                                    <span className="block mb-1 uppercase tracking-widest text-[10px] opacity-60">Descrição do Erro do Sistema</span>
                                    {log.errorDetails}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogViewer;
