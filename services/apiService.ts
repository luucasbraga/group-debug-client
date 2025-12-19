
import { 
    Ticket, TicketStatus, ProcessingLog, AppHealth, 
    UserProfile, BotConfig, ZohoConfig, GitLabConfig,
    Agent
} from '../types';

const BASE_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const apiService = {
    // --- AUTH ---
    async login(credentials: any) {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!res.ok) throw new Error('Falha na autenticação');
        const data = await res.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    async register(user: any) {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!res.ok) throw new Error('Falha no registro');
        return res.json();
    },

    // --- PROFILE ---
    async getProfile(): Promise<UserProfile> {
        const res = await fetch(`${BASE_URL}/profile`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Não autorizado');
        return res.json();
    },

    async updateProfile(profile: UserProfile): Promise<UserProfile> {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(profile)
        });
        if (!res.ok) throw new Error('Falha na atualização');
        return res.json();
    },

    // --- AGENTS (NEW) ---
    async getAgents(): Promise<Agent[]> {
        const res = await fetch(`${BASE_URL}/agents`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Falha ao listar agentes');
        return res.json();
    },

    async createAgent(agent: Partial<Agent>): Promise<Agent> {
        const res = await fetch(`${BASE_URL}/agents`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(agent)
        });
        if (!res.ok) throw new Error('Falha ao criar agente');
        return res.json();
    },

    async updateAgent(id: string, agent: Partial<Agent>): Promise<Agent> {
        const res = await fetch(`${BASE_URL}/agents/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(agent)
        });
        if (!res.ok) throw new Error('Falha ao atualizar agente');
        return res.json();
    },

    async deleteAgent(id: string) {
        const res = await fetch(`${BASE_URL}/agents/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    },

    async activateAgent(id: string): Promise<Agent> {
        const res = await fetch(`${BASE_URL}/agents/${id}/activate`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Falha ao ativar agente');
        return res.json();
    },

    async deactivateAgent(id: string): Promise<Agent> {
        const res = await fetch(`${BASE_URL}/agents/${id}/deactivate`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Falha ao desativar agente');
        return res.json();
    },

    async getActiveAgentsCount(): Promise<number> {
        const res = await fetch(`${BASE_URL}/agents/count/active`, { headers: getHeaders() });
        return res.json();
    },

    // --- CONFIG ---
    async getBotConfig(): Promise<BotConfig> {
        const res = await fetch(`${BASE_URL}/config/bot`, { headers: getHeaders() });
        if (!res.ok) return { llmProvider: 'anthropic', llmApiKey: '', llmModel: 'claude-3-5-sonnet-20241022' };
        return res.json();
    },

    async saveBotConfig(config: BotConfig) {
        const res = await fetch(`${BASE_URL}/config/bot`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(config)
        });
        return res.json();
    },

    async getZohoConfigs(): Promise<ZohoConfig[]> {
        const res = await fetch(`${BASE_URL}/config/zoho`, { headers: getHeaders() });
        if (!res.ok) return [];
        return res.json();
    },

    async addZohoConfig(config: ZohoConfig) {
        const res = await fetch(`${BASE_URL}/config/zoho`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(config)
        });
        if (!res.ok) throw new Error('Falha ao adicionar configuração Zoho');
        return res.json();
    },

    async deleteZohoConfig(id: number | string) {
        const res = await fetch(`${BASE_URL}/config/zoho/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    },

    async getGitLabConfigs(): Promise<GitLabConfig[]> {
        const res = await fetch(`${BASE_URL}/config/gitlab`, { headers: getHeaders() });
        if (!res.ok) return [];
        return res.json();
    },

    async addGitLabConfig(config: GitLabConfig) {
        const res = await fetch(`${BASE_URL}/config/gitlab`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(config)
        });
        if (!res.ok) throw new Error('Falha ao adicionar configuração GitLab');
        return res.json();
    },

    async deleteGitLabConfig(id: number | string) {
        const res = await fetch(`${BASE_URL}/config/gitlab/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    },

    // --- ADMIN ---
    async getAllTickets(): Promise<Ticket[]> {
        const res = await fetch(`${BASE_URL}/admin/tickets`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Acesso admin negado');
        return res.json();
    },

    async getTicketById(id: string): Promise<Ticket> {
        const res = await fetch(`${BASE_URL}/admin/tickets/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Ticket não encontrado');
        return res.json();
    },

    async getTicketLogs(id: string): Promise<ProcessingLog[]> {
        const res = await fetch(`${BASE_URL}/admin/tickets/${id}/logs`, { headers: getHeaders() });
        if (!res.ok) return [];
        return res.json();
    },

    async getSystemHealth(): Promise<AppHealth> {
        const res = await fetch(`${BASE_URL}/admin/health`, { headers: getHeaders() });
        if (!res.ok) return { status: 'DOWN', database: '?', redis: '?', zohoApi: '?', gitlabApi: '?', uptime: '?' };
        return res.json();
    }
};
