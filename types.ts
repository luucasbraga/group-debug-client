
export enum TicketStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PR_CREATED = 'PR_CREATED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export enum ProcessingStep {
    STARTED = 'STARTED',
    KEYWORD_EXTRACTION = 'KEYWORD_EXTRACTION',
    REPOSITORY_IDENTIFICATION = 'REPOSITORY_IDENTIFICATION',
    ORCHESTRATION = 'ORCHESTRATION',
    GIT_CLONE = 'GIT_CLONE',
    BRANCH_CREATION = 'BRANCH_CREATION',
    AI_ANALYSIS = 'AI_ANALYSIS',
    CODE_FIX = 'CODE_FIX',
    GIT_PUSH = 'GIT_PUSH',
    PR_CREATION = 'PR_CREATION',
    ZOHO_UPDATE = 'ZOHO_UPDATE',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR'
}

export interface UserProfile {
    id?: number;
    username: string;
    email: string;
    fullName: string;
}

export interface BotConfig {
    llmProvider: string;
    llmApiKey: string;
    llmModel: string;
}

export interface ZohoConfig {
    id?: number;
    configName: string;
    orgId: string;
    clientId: string;
    clientSecret?: string;
    refreshToken?: string;
}

export interface GitLabConfig {
    id?: number;
    configName: string;
    instanceUrl: string;
    personalAccessToken: string;
}

export interface RiskAnalysis {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    sideEffects: string[];
    recommendation: string;
}

export interface Ticket {
    id: string;
    zohoTicketId: string;
    ticketNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    repositoryName?: string;
    repositoryDocs?: string;
    riskAnalysis?: RiskAnalysis;
    createdAt: string;
    processedAt?: string;
    processingTimeMs?: number;
    prUrl?: string;
}

export interface ProcessingLog {
    id: string;
    ticketId: string;
    step: ProcessingStep;
    status: 'success' | 'failure' | 'warning';
    message: string;
    errorDetails?: string;
    durationMs?: number;
    createdAt: string;
}

export interface AppHealth {
    status: 'UP' | 'DOWN';
    database: string;
    redis: string;
    zohoApi: string;
    gitlabApi: string;
    uptime: string;
}
