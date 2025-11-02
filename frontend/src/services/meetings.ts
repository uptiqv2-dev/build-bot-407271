import { api } from '@/lib/api';
import { mockApiDelay } from '@/lib/utils';
import { mockMeetingBrief, mockMeetings } from '@/data/mockData';
import type { MeetingBrief, Meeting } from '@/types/meeting';

export interface GenerateMeetingBriefRequest {
    meeting_date: string;
    force_refresh?: boolean;
}

export const meetingsService = {
    generateMeetingBrief: async (clientId: string, request: GenerateMeetingBriefRequest): Promise<MeetingBrief> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: generateMeetingBrief ---', clientId, request);
            await mockApiDelay();
            return { ...mockMeetingBrief, client_id: clientId };
        }
        const response = await api.post(`/clients/${clientId}/meeting-brief`, request);
        return response.data;
    },

    getUpcomingMeetings: async (): Promise<Meeting[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getUpcomingMeetings ---');
            await mockApiDelay();
            return mockMeetings.filter(meeting => meeting.status === 'scheduled');
        }
        const response = await api.get('/meetings/upcoming');
        return response.data.results || response.data;
    },

    getMeetingById: async (meetingId: string): Promise<Meeting> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getMeetingById ---', meetingId);
            await mockApiDelay();
            const meeting = mockMeetings.find(m => m.id === meetingId);
            if (!meeting) {
                throw new Error(`Meeting with id ${meetingId} not found`);
            }
            return meeting;
        }
        const response = await api.get(`/meetings/${meetingId}`);
        return response.data;
    },

    getMeetingsByClient: async (clientId: string): Promise<Meeting[]> => {
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            console.log('--- MOCK API: getMeetingsByClient ---', clientId);
            await mockApiDelay();
            return mockMeetings.filter(meeting => meeting.client_id === clientId);
        }
        const response = await api.get(`/clients/${clientId}/meetings`);
        return response.data.results || response.data;
    }
};
