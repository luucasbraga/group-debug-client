
import React from 'react';
import { FileCode } from 'lucide-react';

interface CodeDiffViewProps {
    filename: string;
    diff: Array<{ line: number; type: 'added' | 'removed' | 'neutral'; content: string }>;
}

const CodeDiffView: React.FC<CodeDiffViewProps> = ({ filename, diff }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden font-mono text-sm shadow-xl shadow-slate-200/50">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                    <FileCode size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">{filename}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">AI Correction Applied</span>
            </div>
            <div className="p-0 overflow-x-auto max-h-[400px]">
                <table className="w-full border-collapse">
                    <tbody>
                        {diff.map((line, idx) => (
                            <tr key={idx} className={`${
                                line.type === 'added' ? 'bg-emerald-50 text-emerald-700 font-bold' :
                                line.type === 'removed' ? 'bg-rose-50 text-rose-700 line-through opacity-60' :
                                'text-slate-400'
                            }`}>
                                <td className="w-14 text-right px-4 py-1.5 border-r border-slate-100 select-none opacity-40 text-[10px] font-black">
                                    {line.line}
                                </td>
                                <td className="w-8 text-center py-1.5 select-none font-black opacity-60">
                                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                </td>
                                <td className="px-6 py-1.5 whitespace-pre font-medium text-xs">
                                    {line.content}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CodeDiffView;
