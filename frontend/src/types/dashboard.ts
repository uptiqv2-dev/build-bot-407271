import type { Meeting } from './meeting';
import type { ClientSummary } from './client';

export interface DashboardData {
    upcoming_meetings: Meeting[];
    recent_activity: ActivityItem[];
    system_health: SystemHealth;
    client_summary: ClientSummary[];
    metrics: DashboardMetrics;
}

export interface ActivityItem {
    id: string;
    type: 'meeting' | 'document' | 'opportunity' | 'task';
    title: string;
    description: string;
    timestamp: string;
    client_name?: string;
    priority?: 'high' | 'medium' | 'low';
}

export interface SystemHealth {
    crm: IntegrationStatus;
    portfolio: IntegrationStatus;
    custodian: IntegrationStatus;
    documents: IntegrationStatus;
    email: IntegrationStatus;
}

export interface IntegrationStatus {
    status: 'healthy' | 'warning' | 'error';
    last_sync: string;
    message?: string;
}

export interface DashboardMetrics {
    total_clients: number;
    total_aum: number;
    meetings_this_week: number;
    pending_opportunities: number;
}
