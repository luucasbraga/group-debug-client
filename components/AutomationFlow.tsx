
import React from 'react';
import { FLOW_STEPS } from '../constants';
import { ProcessingLog, ProcessingStep } from '../types';
import { Check, Loader2, X } from 'lucide-react';

interface AutomationFlowProps {
    logs: ProcessingLog[];
    currentStatus: string;
}

const AutomationFlow: React.FC<AutomationFlowProps> = ({ logs, currentStatus }) => {
    return (
        <div className="relative">
            <div className="absolute left-[31px] top-6 bottom-6 w-1 bg-slate-100"></div>
            <div className="space-y-12 relative">
                {FLOW_STEPS.map((stepConfig, index) => {
                    const stepLog = logs.find(l => l.step === stepConfig.step);
                    const isProcessing = currentStatus === 'PROCESSING' && !stepLog && (index > 0 && logs.some(l => l.step === FLOW_STEPS[index-1].step));
                    const isCompleted = !!stepLog && stepLog.status === 'success';
                    const isFailed = !!stepLog && stepLog.status === 'failure';
                    
                    return (
                        <div key={index} className="flex gap-8 items-start group">
                            <div className={`relative z-10 w-[64px] h-[64px] rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                isCompleted ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl shadow-emerald-500/20' :
                                isFailed ? 'bg-rose-500 text-white border-rose-400 shadow-xl shadow-rose-500/20' :
                                isProcessing ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20 animate-pulse' :
                                'bg-white text-slate-300 border-slate-100'
                            }`}>
                                {isCompleted ? <Check size={32} strokeWidth={3} /> : 
                                 isFailed ? <X size={32} strokeWidth={3} /> :
                                 isProcessing ? <Loader2 size={32} className="animate-spin" strokeWidth={3} /> : 
                                 stepConfig.icon}
                            </div>
                            <div className="flex-1 pt-3">
                                <h4 className={`text-sm font-black uppercase tracking-widest ${
                                    isCompleted ? 'text-emerald-600' : 
                                    isFailed ? 'text-rose-600' :
                                    isProcessing ? 'text-indigo-600' : 
                                    'text-slate-400'
                                }`}>
                                    {stepConfig.label}
                                </h4>
                                {stepLog && (
                                    <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                                        {stepLog.message}
                                    </p>
                                )}
                                {isProcessing && (
                                    <p className="text-sm text-indigo-400 mt-2 font-black uppercase tracking-widest animate-pulse">
                                        Ativando agente...
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AutomationFlow;
