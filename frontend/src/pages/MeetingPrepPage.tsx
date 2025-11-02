import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowLeft,
    RefreshCw,
    DollarSign,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    ExternalLink,
    Clock,
    Target,
    MessageSquare
} from 'lucide-react';
import { meetingsService } from '@/services/meetings';
import { clientsService } from '@/services/clients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export const MeetingPrepPage = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const [forceRefresh, setForceRefresh] = useState(false);

    // Fetch client information
    const { data: client, isLoading: clientLoading } = useQuery({
        queryKey: ['client', clientId],
        queryFn: () => clientsService.getClientById(clientId!),
        enabled: !!clientId
    });

    // Fetch meeting brief
    const {
        data: meetingBrief,
        isLoading: briefLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['meeting-brief', clientId, forceRefresh],
        queryFn: () =>
            meetingsService.generateMeetingBrief(clientId!, {
                meeting_date: new Date().toISOString(),
                force_refresh: forceRefresh
            }),
        enabled: !!clientId,
        staleTime: forceRefresh ? 0 : 5 * 60 * 1000 // 5 minutes unless force refresh
    });

    const handleRefresh = () => {
        setForceRefresh(true);
        refetch().finally(() => setForceRefresh(false));
    };

    const isLoading = clientLoading || briefLoading;

    if (error) {
        return (
            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Button
                        variant='ghost'
                        size='sm'
                        asChild
                    >
                        <Link
                            to='/'
                            className='gap-2'
                        >
                            <ArrowLeft className='size-4' />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
                <Alert variant='destructive'>
                    <AlertTriangle className='size-4' />
                    <AlertDescription>
                        Failed to load meeting preparation data. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Button
                        variant='ghost'
                        size='sm'
                        asChild
                    >
                        <Link
                            to='/'
                            className='gap-2'
                        >
                            <ArrowLeft className='size-4' />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div>
                        {isLoading ? (
                            <Skeleton className='h-8 w-64' />
                        ) : (
                            <h1 className='text-3xl font-bold'>Meeting Preparation</h1>
                        )}
                        {isLoading ? (
                            <Skeleton className='h-4 w-48 mt-1' />
                        ) : (
                            <p className='text-muted-foreground'>{client?.name}</p>
                        )}
                    </div>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    variant='outline'
                    size='sm'
                    className='gap-2'
                >
                    <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </Button>
            </div>

            {/* Data Freshness */}
            {meetingBrief && !isLoading && (
                <Card className='border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50'>
                    <CardContent className='pt-4'>
                        <div className='flex items-center gap-2 text-sm'>
                            <Clock className='size-4 text-amber-600' />
                            <span className='font-medium'>Data Freshness:</span>
                            <span>Portfolio: {new Date(meetingBrief.data_freshness.portfolio).toLocaleString()}</span>
                            <span>•</span>
                            <span>CRM: {new Date(meetingBrief.data_freshness.crm).toLocaleString()}</span>
                            <span>•</span>
                            <span>Documents: {new Date(meetingBrief.data_freshness.documents).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Main Content */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Meeting Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <MessageSquare className='size-5' />
                                Meeting Brief
                            </CardTitle>
                            <CardDescription>AI-generated preparation summary</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {isLoading ? (
                                <div className='space-y-4'>
                                    <Skeleton className='h-4 w-full' />
                                    <Skeleton className='h-4 w-3/4' />
                                    <Skeleton className='h-4 w-full' />
                                </div>
                            ) : meetingBrief ? (
                                <>
                                    {/* Last Meeting */}
                                    <div>
                                        <h4 className='font-semibold mb-2'>
                                            Last Meeting ({meetingBrief.summary.last_meeting.date})
                                        </h4>
                                        <p className='text-sm text-muted-foreground mb-2'>
                                            {meetingBrief.summary.last_meeting.summary}
                                        </p>
                                        <div className='flex gap-4 text-sm'>
                                            <div className='flex items-center gap-1'>
                                                <CheckCircle className='size-4 text-green-500' />
                                                <span>
                                                    {meetingBrief.summary.last_meeting.action_items_completed} completed
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                                <Clock className='size-4 text-amber-500' />
                                                <span>
                                                    {meetingBrief.summary.last_meeting.action_items_pending} pending
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Key Topics */}
                                    <div>
                                        <h4 className='font-semibold mb-3'>Key Discussion Topics</h4>
                                        <ul className='space-y-2'>
                                            {meetingBrief.summary.key_topics.map((topic, index) => (
                                                <li
                                                    key={index}
                                                    className='flex items-start gap-3 text-sm'
                                                >
                                                    <div className='size-2 rounded-full bg-primary mt-2 flex-shrink-0' />
                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Separator />

                                    {/* Questions to Ask */}
                                    <div>
                                        <h4 className='font-semibold mb-3'>Questions to Ask</h4>
                                        <ul className='space-y-2'>
                                            {meetingBrief.summary.questions_to_ask.map((question, index) => (
                                                <li
                                                    key={index}
                                                    className='flex items-start gap-3 text-sm'
                                                >
                                                    <div className='size-2 rounded-full bg-blue-500 mt-2 flex-shrink-0' />
                                                    <span>{question}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Opportunities */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Target className='size-5' />
                                Detected Opportunities
                            </CardTitle>
                            <CardDescription>AI-identified client opportunities with priority scoring</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className='space-y-4'>
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className='flex items-start gap-3'
                                        >
                                            <Skeleton className='size-8 rounded' />
                                            <div className='flex-1 space-y-2'>
                                                <Skeleton className='h-4 w-3/4' />
                                                <Skeleton className='h-3 w-1/2' />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : meetingBrief?.opportunities.length ? (
                                <div className='space-y-4'>
                                    {meetingBrief.opportunities.map((opportunity, index) => (
                                        <div
                                            key={index}
                                            className='flex items-start gap-3 p-3 border rounded-lg'
                                        >
                                            <div className='flex size-8 items-center justify-center rounded bg-primary/10'>
                                                <TrendingUp className='size-4 text-primary' />
                                            </div>
                                            <div className='flex-1 space-y-2'>
                                                <div className='flex items-center gap-2'>
                                                    <Badge
                                                        variant={
                                                            opportunity.priority === 'high'
                                                                ? 'destructive'
                                                                : opportunity.priority === 'medium'
                                                                  ? 'default'
                                                                  : 'secondary'
                                                        }
                                                        className='text-xs'
                                                    >
                                                        {opportunity.priority} priority
                                                    </Badge>
                                                    <span className='text-xs text-muted-foreground'>
                                                        Score: {opportunity.priority_score}
                                                    </span>
                                                </div>
                                                <p className='font-medium text-sm'>{opportunity.description}</p>
                                                {opportunity.estimated_value && (
                                                    <p className='text-xs text-green-600 font-medium'>
                                                        Estimated value: ${opportunity.estimated_value.toLocaleString()}
                                                    </p>
                                                )}
                                                <p className='text-xs text-muted-foreground'>
                                                    Recommended: {opportunity.recommended_action}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-8 text-muted-foreground'>No opportunities detected</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className='space-y-6'>
                    {/* Portfolio Snapshot */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <DollarSign className='size-5' />
                                Portfolio Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {isLoading ? (
                                <div className='space-y-3'>
                                    <Skeleton className='h-8 w-24' />
                                    <Skeleton className='h-4 w-32' />
                                    <div className='space-y-2'>
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className='flex justify-between'
                                            >
                                                <Skeleton className='h-3 w-16' />
                                                <Skeleton className='h-3 w-12' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : meetingBrief ? (
                                <>
                                    <div>
                                        <div className='text-2xl font-bold'>
                                            ${(meetingBrief.portfolio.total_value / 1000000).toFixed(2)}M
                                        </div>
                                        <div className='flex items-center gap-1 text-sm'>
                                            {meetingBrief.portfolio.change_since_last_meeting.percent >= 0 ? (
                                                <TrendingUp className='size-4 text-green-500' />
                                            ) : (
                                                <TrendingDown className='size-4 text-red-500' />
                                            )}
                                            <span
                                                className={
                                                    meetingBrief.portfolio.change_since_last_meeting.percent >= 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }
                                            >
                                                {meetingBrief.portfolio.change_since_last_meeting.percent > 0
                                                    ? '+'
                                                    : ''}
                                                {meetingBrief.portfolio.change_since_last_meeting.percent}%
                                            </span>
                                            <span className='text-muted-foreground'>since last meeting</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className='font-medium mb-2'>Asset Allocation</h5>
                                        <div className='space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span>Equity</span>
                                                <span>
                                                    {(meetingBrief.portfolio.asset_allocation.equity * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Fixed Income</span>
                                                <span>
                                                    {(
                                                        meetingBrief.portfolio.asset_allocation.fixed_income * 100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Alternatives</span>
                                                <span>
                                                    {(
                                                        meetingBrief.portfolio.asset_allocation.alternatives * 100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span>Cash</span>
                                                <span>
                                                    {(meetingBrief.portfolio.asset_allocation.cash * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Action Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <AlertTriangle className='size-5' />
                                Pending Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className='space-y-3'>
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i}>
                                            <Skeleton className='h-4 w-full mb-2' />
                                            <Skeleton className='h-3 w-24' />
                                        </div>
                                    ))}
                                </div>
                            ) : meetingBrief?.pending_action_items.length ? (
                                <div className='space-y-3'>
                                    {meetingBrief.pending_action_items.map((item, index) => (
                                        <div
                                            key={index}
                                            className='p-3 border rounded-lg'
                                        >
                                            <p className='text-sm font-medium mb-1'>{item.description}</p>
                                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                                <span>Due: {item.due_date}</span>
                                                {item.days_overdue && (
                                                    <Badge
                                                        variant='destructive'
                                                        className='text-xs'
                                                    >
                                                        {item.days_overdue} days overdue
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-8 text-muted-foreground text-sm'>
                                    No pending action items
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Deep Links */}
                    {meetingBrief && !isLoading && (
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <ExternalLink className='size-5' />
                                    Quick Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full justify-start gap-2'
                                    asChild
                                >
                                    <a
                                        href={meetingBrief.deep_links.crm_record}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <ExternalLink className='size-4' />
                                        View in CRM
                                    </a>
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full justify-start gap-2'
                                    asChild
                                >
                                    <a
                                        href={meetingBrief.deep_links.portfolio}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <ExternalLink className='size-4' />
                                        Portfolio Details
                                    </a>
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full justify-start gap-2'
                                    asChild
                                >
                                    <a
                                        href={meetingBrief.deep_links.documents}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <ExternalLink className='size-4' />
                                        Documents
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
