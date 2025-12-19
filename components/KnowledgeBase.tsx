
import React from 'react';
import { BookOpen, ChevronRight, Hash } from 'lucide-react';

interface KnowledgeBaseProps {
    content?: string;
    repoName: string;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ content, repoName }) => {
    const defaultContent = `# ${repoName}\n\n## Padrões de Implementação\n- Utilize recursos do Java 17\n- Siga os padrões OAuth2\n- Testes unitários são obrigatórios para todas as correções na camada de serviço.\n\n## Lógica de Negócio\nEste repositório gerencia todos os fluxos de autenticação e autorização para o ecossistema Group Debug.`;

    return (
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-900">Base de Conhecimento GitLab</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Contexto de Documentação</p>
                    </div>
                </div>
            </div>
            <div className="p-10 max-h-[500px] overflow-y-auto scrollbar-thin bg-white">
                <div className="prose prose-slate max-w-none">
                    <div className="space-y-8">
                        {(content || defaultContent).split('\n').map((line, idx) => {
                            if (line.startsWith('# ')) {
                                return <h1 key={idx} className="text-3xl font-black text-slate-900 border-b border-slate-100 pb-4">{line.replace('# ', '')}</h1>;
                            }
                            if (line.startsWith('## ')) {
                                return <h2 key={idx} className="text-xl font-black text-indigo-600 mt-12 mb-6 flex items-center gap-3">
                                    <ChevronRight size={22} className="text-indigo-400" />
                                    {line.replace('## ', '')}
                                </h2>;
                            }
                            if (line.startsWith('- ')) {
                                return <div key={idx} className="flex gap-4 items-start ml-2 text-slate-600 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <Hash size={18} className="mt-0.5 text-indigo-300 shrink-0" />
                                    <span>{line.replace('- ', '')}</span>
                                </div>;
                            }
                            return <p key={idx} className="text-slate-500 leading-relaxed font-medium text-lg">{line}</p>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
