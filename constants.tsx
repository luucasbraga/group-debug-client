
import React from 'react';
import { 
    TicketStatus, 
    ProcessingStep,
    Ticket
} from './types';
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Code, 
    GitBranch, 
    GitPullRequest, 
    Search, 
    Terminal, 
    Workflow 
} from 'lucide-react';

export const STATUS_CONFIG = {
    [TicketStatus.PENDING]: {
        color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        icon: <Clock size={16} />
    },
    [TicketStatus.PROCESSING]: {
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse',
        icon: <Workflow size={16} />
    },
    [TicketStatus.PR_CREATED]: {
        color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        icon: <GitPullRequest size={16} />
    },
    [TicketStatus.COMPLETED]: {
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: <CheckCircle2 size={16} />
    },
    [TicketStatus.FAILED]: {
        color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        icon: <AlertCircle size={16} />
    },
};

export const FLOW_STEPS = [
    { step: ProcessingStep.STARTED, label: 'Início', icon: <Terminal size={20} /> },
    { step: ProcessingStep.KEYWORD_EXTRACTION, label: 'Extração de Keywords', icon: <Search size={20} /> },
    { step: ProcessingStep.REPOSITORY_IDENTIFICATION, label: 'Busca de Repositório', icon: <Code size={20} /> },
    { step: ProcessingStep.GIT_CLONE, label: 'Clone de Repositório', icon: <Terminal size={20} /> },
    { step: ProcessingStep.AI_ANALYSIS, label: 'Análise por IA', icon: <Workflow size={20} /> },
    { step: ProcessingStep.CODE_FIX, label: 'Aplicando Correção', icon: <Code size={20} /> },
    { step: ProcessingStep.PR_CREATION, label: 'Abertura de PR', icon: <GitPullRequest size={20} /> },
    { step: ProcessingStep.ZOHO_UPDATE, label: 'Atualização Zoho', icon: <CheckCircle2 size={20} /> },
];

export const MOCK_TICKETS: Ticket[] = [
    {
        id: '1',
        zohoTicketId: 'Z-1001',
        ticketNumber: '#1001',
        subject: 'Erro 500 ao fazer login com email maiúsculo',
        description: 'Usuários estão relatando que ao digitar o e-mail com letras maiúsculas no login, o sistema retorna erro 500.',
        status: TicketStatus.COMPLETED,
        priority: 'HIGH',
        repositoryName: 'backend-auth-service',
        createdAt: '2024-12-20T10:00:00Z',
        processedAt: '2024-12-20T10:04:00Z',
        processingTimeMs: 240000,
        prUrl: 'https://gitlab.com/org/auth-service/merge_requests/45'
    }
];
