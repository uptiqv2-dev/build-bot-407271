import { useQuery } from '@tanstack/react-query';
import { Calendar, Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '@/services/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const DashboardPage = () => {
    const {
        data: dashboardData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => dashboardService.getDashboardData()
    });

    if (error) {
        return (
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold'>Dashboard</h1>
                    <p className='text-muted-foreground'>Welcome to your Advisor Intelligence Assistant</p>
                </div>
                <Alert variant='destructive'>
                    <AlertTriangle className='size-4' />
                    <AlertDescription>Failed to load dashboard data. Please try again later.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div>
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <p className='text-muted-foreground'>Welcome to your Advisor Intelligence Assistant</p>
            </div>

            {/* Metrics Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='size-4' />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className='h-8 w-16 mb-1' />
                                <Skeleton className='h-3 w-32' />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Total Clients</CardTitle>
                                <Users className='size-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{dashboardData?.metrics.total_clients}</div>
                                <p className='text-xs text-muted-foreground'>Active and prospect clients</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Total AUM</CardTitle>
                                <DollarSign className='size-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>
                                    ${((dashboardData?.metrics.total_aum || 0) / 1000000).toFixed(1)}M
                                </div>
                                <p className='text-xs text-muted-foreground'>Assets under management</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>This Week</CardTitle>
                                <Calendar className='size-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{dashboardData?.metrics.meetings_this_week}</div>
                                <p className='text-xs text-muted-foreground'>Scheduled meetings</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium'>Opportunities</CardTitle>
                                <TrendingUp className='size-4 text-muted-foreground' />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold'>{dashboardData?.metrics.pending_opportunities}</div>
                                <p className='text-xs text-muted-foreground'>Pending opportunities</p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                {/* Upcoming Meetings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Meetings</CardTitle>
                        <CardDescription>Your scheduled client meetings</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='flex items-center gap-3'
                                >
                                    <Skeleton className='size-10 rounded-lg' />
                                    <div className='flex-1 space-y-1'>
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-3 w-24' />
                                    </div>
                                    <Skeleton className='h-8 w-20' />
                                </div>
                            ))
                        ) : dashboardData?.upcoming_meetings.length ? (
                            dashboardData.upcoming_meetings.map(meeting => (
                                <div
                                    key={meeting.id}
                                    className='flex items-center justify-between gap-3'
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                                            <Calendar className='size-4 text-primary' />
                                        </div>
                                        <div>
                                            <div className='font-medium'>{meeting.client_id}</div>
                                            <div className='text-sm text-muted-foreground'>
                                                {new Date(meeting.date).toLocaleDateString()} at{' '}
                                                {new Date(meeting.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size='sm'
                                        asChild
                                    >
                                        <Link to={`/meeting-prep/${meeting.client_id}`}>Prepare</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className='text-center py-8 text-muted-foreground'>No upcoming meetings scheduled</div>
                        )}
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Integration status and data freshness</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className='flex items-center justify-between'
                                  >
                                      <div className='flex items-center gap-3'>
                                          <Skeleton className='size-4' />
                                          <Skeleton className='h-4 w-20' />
                                      </div>
                                      <Skeleton className='h-5 w-16' />
                                  </div>
                              ))
                            : Object.entries(dashboardData?.system_health || {}).map(([system, status]) => (
                                  <div
                                      key={system}
                                      className='flex items-center justify-between'
                                  >
                                      <div className='flex items-center gap-3'>
                                          {status.status === 'healthy' ? (
                                              <CheckCircle className='size-4 text-green-500' />
                                          ) : status.status === 'warning' ? (
                                              <AlertTriangle className='size-4 text-yellow-500' />
                                          ) : (
                                              <AlertTriangle className='size-4 text-red-500' />
                                          )}
                                          <span className='font-medium capitalize'>{system}</span>
                                      </div>
                                      <Badge
                                          variant={
                                              status.status === 'healthy'
                                                  ? 'default'
                                                  : status.status === 'warning'
                                                    ? 'secondary'
                                                    : 'destructive'
                                          }
                                      >
                                          {status.status}
                                      </Badge>
                                  </div>
                              ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activity and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className='space-y-4'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='flex items-start gap-3'
                                >
                                    <Skeleton className='size-8 rounded-lg' />
                                    <div className='flex-1 space-y-1'>
                                        <Skeleton className='h-4 w-48' />
                                        <Skeleton className='h-3 w-64' />
                                        <Skeleton className='h-3 w-24' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : dashboardData?.recent_activity.length ? (
                        <div className='space-y-4'>
                            {dashboardData.recent_activity.map(activity => (
                                <div
                                    key={activity.id}
                                    className='flex items-start gap-3'
                                >
                                    <div className='flex size-8 items-center justify-center rounded-lg bg-muted'>
                                        {activity.type === 'meeting' && <Calendar className='size-4' />}
                                        {activity.type === 'document' && <ExternalLink className='size-4' />}
                                        {activity.type === 'opportunity' && <TrendingUp className='size-4' />}
                                        {activity.type === 'task' && <Clock className='size-4' />}
                                    </div>
                                    <div className='flex-1 space-y-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium'>{activity.title}</span>
                                            {activity.priority && (
                                                <Badge
                                                    variant={
                                                        activity.priority === 'high'
                                                            ? 'destructive'
                                                            : activity.priority === 'medium'
                                                              ? 'secondary'
                                                              : 'outline'
                                                    }
                                                >
                                                    {activity.priority}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className='text-sm text-muted-foreground'>{activity.description}</p>
                                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                            <span>{new Date(activity.timestamp).toLocaleString()}</span>
                                            {activity.client_name && (
                                                <>
                                                    <span>•</span>
                                                    <span>{activity.client_name}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8 text-muted-foreground'>No recent activity</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
