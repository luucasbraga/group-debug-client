
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
    GitPullRequest, 
    Search, 
    Terminal, 
    Workflow,
    Database,
    FileText,
    GitBranch,
    UploadCloud,
    Trash2,
    RefreshCw
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
    [TicketStatus.ANALYZING]: {
        color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-pulse',
        icon: <Search size={16} />
    },
    [TicketStatus.FIXING]: {
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse',
        icon: <Code size={16} />
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
    { step: ProcessingStep.TICKET_RECEIVED, label: 'Ticket Recebido', icon: <Terminal size={20} /> },
    { step: ProcessingStep.EXTRACTING_KEYWORDS, label: 'Extração de Keywords', icon: <Search size={20} /> },
    { step: ProcessingStep.IDENTIFYING_REPOSITORY, label: 'Busca de Repositório', icon: <Database size={20} /> },
    { step: ProcessingStep.ANALYZING_DOCUMENTATION, label: 'Análise de Docs', icon: <FileText size={20} /> },
    { step: ProcessingStep.CLONING_REPOSITORY, label: 'Clone de Repositório', icon: <Terminal size={20} /> },
    { step: ProcessingStep.CREATING_BRANCH, label: 'Criação de Branch', icon: <GitBranch size={20} /> },
    { step: ProcessingStep.ANALYZING_CODE, label: 'Análise por IA', icon: <Workflow size={20} /> },
    { step: ProcessingStep.APPLYING_CHANGES, label: 'Aplicando Correção', icon: <Code size={20} /> },
    { step: ProcessingStep.COMMITTING, label: 'Commitando', icon: <Terminal size={20} /> },
    { step: ProcessingStep.PUSHING, label: 'Push para Origin', icon: <UploadCloud size={20} /> },
    { step: ProcessingStep.CREATING_PR, label: 'Abertura de PR', icon: <GitPullRequest size={20} /> },
    { step: ProcessingStep.UPDATING_TICKET, label: 'Atualização Zoho', icon: <RefreshCw size={20} /> },
    { step: ProcessingStep.CLEANUP, label: 'Limpeza de Workspace', icon: <Trash2 size={20} /> },
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
        completedAt: '2024-12-20T10:04:00Z',
        processingTimeMs: 240000,
        pullRequestUrl: 'https://gitlab.com/org/auth-service/merge_requests/45'
    }
];
