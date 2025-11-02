import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockDashboardData } from '@/data/mockData';
import type { DashboardData } from '@/types/dashboard';

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardData> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getDashboardData ---');
            await mockApiDelay();
            return mockDashboardData;
        }
        const response = await api.get('/dashboard/overview');
        return response.data;
    }
};
