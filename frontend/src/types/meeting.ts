export interface MeetingBrief {
    client_id: string;
    generated_at: string;
    data_freshness: {
        portfolio: string;
        crm: string;
        documents: string;
    };
    summary: {
        last_meeting: {
            date: string;
            summary: string;
            action_items_completed: number;
            action_items_pending: number;
        };
        key_topics: string[];
        questions_to_ask: string[];
    };
    portfolio: PortfolioSnapshot;
    opportunities: Opportunity[];
    pending_action_items: ActionItem[];
    recent_interactions: Interaction[];
    deep_links: {
        crm_record: string;
        portfolio: string;
        documents: string;
    };
}

export interface PortfolioSnapshot {
    total_value: number;
    change_since_last_meeting: {
        absolute: number;
        percent: number;
    };
    asset_allocation: {
        equity: number;
        fixed_income: number;
        alternatives: number;
        cash: number;
    };
}

export interface Opportunity {
    type: 'rebalancing' | 'tax_loss_harvesting' | 'lending' | 'insurance_gap';
    priority: 'high' | 'medium' | 'low';
    priority_score: number;
    description: string;
    estimated_value?: number;
    recommended_action: string;
}

export interface ActionItem {
    description: string;
    due_date: string;
    days_overdue?: number;
    assigned_to: string;
    status?: 'open' | 'completed' | 'cancelled';
}

export interface Interaction {
    date: string;
    type: 'email' | 'call' | 'meeting' | 'note';
    summary: string;
    action_required: boolean;
}

export interface Meeting {
    id: string;
    client_id: string;
    date: string;
    type: 'initial' | 'review' | 'planning' | 'emergency';
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    duration?: number;
    summary?: string;
    action_items?: ActionItem[];
}
