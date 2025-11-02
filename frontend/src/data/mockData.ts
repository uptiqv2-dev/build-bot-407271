import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { Client, ClientSummary } from '@/types/client';
import type { MeetingBrief, Meeting } from '@/types/meeting';
import type { DashboardData, ActivityItem, SystemHealth } from '@/types/dashboard';

export const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};

// Mock Clients
export const mockClients: Client[] = [
    {
        id: 'client-1',
        name: 'Johnson Family Trust',
        type: 'trust',
        household_id: 'household-1',
        primary_advisor_id: '1',
        status: 'active',
        aum: 2450000,
        last_meeting_date: '2024-08-15',
        next_meeting_date: '2024-11-15',
        risk_tolerance: 'moderate',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-10-01T00:00:00Z'
    },
    {
        id: 'client-2',
        name: 'Michael & Sarah Chen',
        type: 'joint',
        household_id: 'household-2',
        primary_advisor_id: '1',
        status: 'active',
        aum: 1250000,
        last_meeting_date: '2024-09-20',
        next_meeting_date: '2024-12-20',
        risk_tolerance: 'aggressive',
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-09-20T00:00:00Z'
    },
    {
        id: 'client-3',
        name: 'Robert Williams',
        type: 'individual',
        household_id: 'household-3',
        primary_advisor_id: '1',
        status: 'prospect',
        aum: 750000,
        created_at: '2024-10-01T00:00:00Z',
        updated_at: '2024-10-01T00:00:00Z'
    }
];

export const mockClientSummaries: ClientSummary[] = mockClients.map(client => ({
    id: client.id,
    name: client.name,
    status: client.status,
    aum: client.aum,
    last_meeting_date: client.last_meeting_date,
    next_meeting_date: client.next_meeting_date
}));

// Mock Meetings
export const mockMeetings: Meeting[] = [
    {
        id: 'meeting-1',
        client_id: 'client-1',
        date: '2024-11-15T10:00:00Z',
        type: 'review',
        status: 'scheduled',
        duration: 60
    },
    {
        id: 'meeting-2',
        client_id: 'client-2',
        date: '2024-11-18T14:00:00Z',
        type: 'planning',
        status: 'scheduled',
        duration: 90
    },
    {
        id: 'meeting-3',
        client_id: 'client-1',
        date: '2024-08-15T10:00:00Z',
        type: 'review',
        status: 'completed',
        duration: 60,
        summary: 'Discussed Q2 performance and college planning'
    }
];

// Mock Meeting Brief
export const mockMeetingBrief: MeetingBrief = {
    client_id: 'client-1',
    generated_at: '2024-11-14T15:30:00Z',
    data_freshness: {
        portfolio: '2024-11-13T23:59:59Z',
        crm: '2024-11-14T15:29:00Z',
        documents: '2024-11-14T10:00:00Z'
    },
    summary: {
        last_meeting: {
            date: '2024-08-15',
            summary: 'Discussed Q2 performance and college planning',
            action_items_completed: 3,
            action_items_pending: 1
        },
        key_topics: [
            'Review portfolio rebalancing opportunity (10% drift from target)',
            'Follow up on estate planning documents (pending)',
            'Discuss tax-loss harvesting opportunity ($15K potential savings)'
        ],
        questions_to_ask: [
            'Have you completed the trust amendment we discussed?',
            'Any changes to your income or tax situation?',
            'Are you still planning to purchase vacation home next year?'
        ]
    },
    portfolio: {
        total_value: 2450000,
        change_since_last_meeting: {
            absolute: 125000,
            percent: 5.4
        },
        asset_allocation: {
            equity: 0.62,
            fixed_income: 0.25,
            alternatives: 0.08,
            cash: 0.05
        }
    },
    opportunities: [
        {
            type: 'rebalancing',
            priority: 'high',
            priority_score: 85,
            description: 'Portfolio has drifted 10.2% from target allocation',
            recommended_action: 'Schedule rebalancing review'
        },
        {
            type: 'tax_loss_harvesting',
            priority: 'medium',
            priority_score: 72,
            description: '3 securities with unrealized losses totaling $15,200',
            estimated_value: 15200,
            recommended_action: 'Discuss tax-loss harvesting before year-end'
        }
    ],
    pending_action_items: [
        {
            description: 'Send updated trust documents to estate attorney',
            due_date: '2024-09-30',
            days_overdue: 45,
            assigned_to: 'advisor',
            status: 'open'
        }
    ],
    recent_interactions: [
        {
            date: '2024-10-20',
            type: 'email',
            summary: 'Client inquired about mortgage refinancing options',
            action_required: false
        }
    ],
    deep_links: {
        crm_record: 'https://yourcrm.com/clients/12345',
        portfolio: 'https://orion.com/accounts/...',
        documents: 'https://sharepoint.com/clients/...'
    }
};

// Mock Dashboard Data
const mockSystemHealth: SystemHealth = {
    crm: { status: 'healthy', last_sync: '2024-11-14T15:29:00Z' },
    portfolio: { status: 'healthy', last_sync: '2024-11-13T23:59:59Z' },
    custodian: { status: 'warning', last_sync: '2024-11-14T08:00:00Z', message: 'Rate limit exceeded' },
    documents: { status: 'healthy', last_sync: '2024-11-14T10:00:00Z' },
    email: { status: 'healthy', last_sync: '2024-11-14T15:25:00Z' }
};

const mockRecentActivity: ActivityItem[] = [
    {
        id: 'activity-1',
        type: 'opportunity',
        title: 'Rebalancing Opportunity Detected',
        description: 'Johnson Family Trust portfolio has drifted 10.2% from target',
        timestamp: '2024-11-14T09:30:00Z',
        client_name: 'Johnson Family Trust',
        priority: 'high'
    },
    {
        id: 'activity-2',
        type: 'document',
        title: 'New Document Processed',
        description: 'Brokerage statement successfully classified and processed',
        timestamp: '2024-11-14T08:15:00Z',
        client_name: 'Michael & Sarah Chen',
        priority: 'medium'
    },
    {
        id: 'activity-3',
        type: 'meeting',
        title: 'Meeting Completed',
        description: 'Quarterly review meeting completed with action items',
        timestamp: '2024-11-13T16:00:00Z',
        client_name: 'Robert Williams',
        priority: 'low'
    }
];

export const mockDashboardData: DashboardData = {
    upcoming_meetings: mockMeetings.filter(m => m.status === 'scheduled'),
    recent_activity: mockRecentActivity,
    system_health: mockSystemHealth,
    client_summary: mockClientSummaries.slice(0, 5), // Top 5 clients
    metrics: {
        total_clients: mockClients.length,
        total_aum: mockClients.reduce((sum, client) => sum + client.aum, 0),
        meetings_this_week: 3,
        pending_opportunities: 8
    }
};
