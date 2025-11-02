export interface Client {
    id: string;
    name: string;
    type: 'individual' | 'joint' | 'trust' | 'entity';
    household_id: string;
    primary_advisor_id: string;
    status: 'active' | 'inactive' | 'prospect';
    aum: number;
    last_meeting_date?: string;
    next_meeting_date?: string;
    risk_tolerance?: 'conservative' | 'moderate' | 'aggressive';
    created_at: string;
    updated_at: string;
}

export interface ClientSummary {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'prospect';
    aum: number;
    last_meeting_date?: string;
    next_meeting_date?: string;
}
