
export enum TicketStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    ANALYZING = 'ANALYZING',
    FIXING = 'FIXING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum ProcessingStep {
    TICKET_RECEIVED = 'TICKET_RECEIVED',
    EXTRACTING_KEYWORDS = 'EXTRACTING_KEYWORDS',
    IDENTIFYING_REPOSITORY = 'IDENTIFYING_REPOSITORY',
    ANALYZING_DOCUMENTATION = 'ANALYZING_DOCUMENTATION',
    CLONING_REPOSITORY = 'CLONING_REPOSITORY',
    CREATING_BRANCH = 'CREATING_BRANCH',
    ANALYZING_CODE = 'ANALYZING_CODE',
    APPLYING_CHANGES = 'APPLYING_CHANGES',
    COMMITTING = 'COMMITTING',
    PUSHING = 'PUSHING',
    CREATING_PR = 'CREATING_PR',
    UPDATING_TICKET = 'UPDATING_TICKET',
    CLEANUP = 'CLEANUP',
    FAILED = 'FAILED'
}

export enum AgentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface UserProfile {
    username: string;
    email: string;
    fullName: string;
    company?: string;
    department?: string;
    phone?: string;
    avatarUrl?: string;
    timezone?: string;
    language?: string;
    role: string;
}

export interface Agent {
    id: string;
    agentName: string;
    agentDescription: string;
    prePrompts?: string;
    botEmail?: string;
    llmProvider: string;
    llmApiKey: string;
    llmModel: string;
    llmMaxTokens: number;
    llmTemperature: number;
    status: AgentStatus;
    autoProcessTickets: boolean;
    maxConcurrentTickets: number;
    gitWorkspaceDir: string;
    createdAt?: string;
    updatedAt?: string;
    lastActiveAt?: string;
}

export interface BotConfig {
    botName: string;
    botEmail: string;
    llmProvider: string;
    llmApiKey: string;
    llmModel: string;
    llmMaxTokens: number;
    llmTemperature: number;
    autoProcessTickets: boolean;
    maxConcurrentTickets: number;
    gitWorkspaceDir: string;
}

export interface ZohoConfig {
    id?: string;
    configName: string;
    orgId: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    webhookSecret?: string;
    isActive: boolean;
}

export interface GitLabConfig {
    id?: string;
    configName: string;
    gitlabUrl: string;
    personalToken: string;
    username: string;
    defaultBranch: string;
    isActive: boolean;
}

export interface Ticket {
    id: string;
    zohoTicketId: string;
    ticketNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    repositoryName?: string;
    branchName?: string;
    pullRequestUrl?: string;
    createdAt: string;
    completedAt?: string;
    processingTimeMs?: number;
}

export interface ProcessingLog {
    step: ProcessingStep;
    status: 'success' | 'failure' | 'warning' | 'in_progress';
    message: string;
    createdAt: string;
}

export interface AppHealth {
    status: string;
    totalTickets: number;
    pending: number;
    processing: number;
    analyzing: number;
    fixing: number;
    completed: number;
    failed: number;
    averageProcessingTimeMs: number;
    activeAgents: number;
    // Campos legados para compatibilidade se necessário
    database?: string;
    redis?: string;
    zohoApi?: string;
    gitlabApi?: string;
    uptime?: string;
}
