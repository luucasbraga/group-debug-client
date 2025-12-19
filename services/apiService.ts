
import { 
    Ticket, TicketStatus, ProcessingLog, AppHealth, 
    UserProfile, BotConfig, ZohoConfig, GitLabConfig 
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
        if (!res.ok) throw new Error('Login failed');
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
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
    },

    // --- PROFILE ---
    async getProfile(): Promise<UserProfile> {
        const res = await fetch(`${BASE_URL}/profile`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
    },

    async updateProfile(profile: UserProfile): Promise<UserProfile> {
        const res = await fetch(`${BASE_URL}/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(profile)
        });
        if (!res.ok) throw new Error('Update failed');
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
        if (!res.ok) throw new Error('Failed to add Zoho config');
        return res.json();
    },

    async deleteZohoConfig(id: number) {
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
        if (!res.ok) throw new Error('Failed to add GitLab config');
        return res.json();
    },

    async deleteGitLabConfig(id: number) {
        const res = await fetch(`${BASE_URL}/config/gitlab/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.ok;
    },

    // --- ADMIN ---
    async getAllTickets(): Promise<Ticket[]> {
        const res = await fetch(`${BASE_URL}/admin/tickets`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Admin access denied');
        return res.json();
    },

    async getTicketById(id: string): Promise<Ticket> {
        const res = await fetch(`${BASE_URL}/admin/tickets/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Ticket not found');
        return res.json();
    },

    async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
        const res = await fetch(`${BASE_URL}/admin/tickets/status/${status}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to filter tickets');
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
    },

    async syncZoho(): Promise<{ message: string }> {
        const res = await fetch(`${BASE_URL}/admin/sync/zoho`, { 
            method: 'POST',
            headers: getHeaders() 
        });
        return res.json();
    }
};
