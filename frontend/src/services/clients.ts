import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockClients, mockClientSummaries } from '@/data/mockData';
import type { Client, ClientSummary } from '@/types/client';
import type { PaginatedResponse } from '@/types/api';

export interface GetClientsParams {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive' | 'prospect';
    search?: string;
}

export const clientsService = {
    getClients: async (params: GetClientsParams = {}): Promise<PaginatedResponse<Client>> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getClients ---', params);
            await mockApiDelay();

            let filteredClients = [...mockClients];

            if (params.status) {
                filteredClients = filteredClients.filter(client => client.status === params.status);
            }

            if (params.search) {
                const searchTerm = params.search.toLowerCase();
                filteredClients = filteredClients.filter(client => client.name.toLowerCase().includes(searchTerm));
            }

            const page = params.page || 1;
            const limit = params.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            return {
                results: filteredClients.slice(startIndex, endIndex),
                page,
                limit,
                totalPages: Math.ceil(filteredClients.length / limit),
                totalResults: filteredClients.length
            };
        }

        const response = await api.get('/clients', { params });
        return response.data;
    },

    getClientById: async (clientId: string): Promise<Client> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getClientById ---', clientId);
            await mockApiDelay();
            const client = mockClients.find(c => c.id === clientId);
            if (!client) {
                throw new Error(`Client with id ${clientId} not found`);
            }
            return client;
        }
        const response = await api.get(`/clients/${clientId}`);
        return response.data;
    },

    getClientSummaries: async (limit = 5): Promise<ClientSummary[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getClientSummaries ---', limit);
            await mockApiDelay();
            return mockClientSummaries.slice(0, limit);
        }
        const response = await api.get(`/clients/summaries?limit=${limit}`);
        return response.data.results || response.data;
    },

    searchClientHistory: async (
        clientId: string,
        query: string,
        types?: string[],
        startDate?: string,
        endDate?: string,
        limit = 10
    ): Promise<any> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: searchClientHistory ---', { clientId, query, types, startDate, endDate, limit });
            await mockApiDelay();
            // Mock search results
            return {
                query,
                results_count: 2,
                results: [
                    {
                        id: 'interaction-789',
                        type: 'meeting',
                        date: '2024-08-15',
                        relevance_score: 0.92,
                        summary: 'Discussed updating trust to add grandchildren as beneficiaries',
                        snippet:
                            '...client expressed desire to include grandchildren in estate plan. Recommended trust amendment to add per stirpes distribution...',
                        source_system: 'salesforce',
                        deep_link: 'https://salesforce.com/...'
                    },
                    {
                        id: 'doc-456',
                        type: 'document',
                        date: '2024-06-10',
                        relevance_score: 0.87,
                        document_type: 'trust_document',
                        summary: 'Johnson Family Revocable Trust - Original document',
                        source_system: 'sharepoint',
                        deep_link: 'https://sharepoint.com/...'
                    }
                ]
            };
        }

        const params = new URLSearchParams({ q: query, limit: limit.toString() });
        if (types?.length) params.append('types', types.join(','));
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const response = await api.get(`/clients/${clientId}/search?${params.toString()}`);
        return response.data;
    }
};
