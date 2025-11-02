import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Users, Calendar, DollarSign, Filter } from 'lucide-react';
import { clientsService, type GetClientsParams } from '@/services/clients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ClientsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const queryParams: GetClientsParams = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter as any })
    };

    const { data: clientsData, isLoading } = useQuery({
        queryKey: ['clients', queryParams],
        queryFn: () => clientsService.getClients(queryParams)
    });

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>Clients</h1>
                    <p className='text-muted-foreground'>Manage your client relationships</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground' />
                            <Input
                                placeholder='Search clients...'
                                value={searchTerm}
                                onChange={e => handleSearchChange(e.target.value)}
                                className='pl-9'
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className='w-full sm:w-48'>
                                <Filter className='size-4 mr-2' />
                                <SelectValue placeholder='Filter by status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Clients</SelectItem>
                                <SelectItem value='active'>Active</SelectItem>
                                <SelectItem value='prospect'>Prospects</SelectItem>
                                <SelectItem value='inactive'>Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Users className='size-5' />
                        Client Directory
                    </CardTitle>
                    <CardDescription>
                        {isLoading ? (
                            <Skeleton className='h-4 w-48' />
                        ) : (
                            `Showing ${clientsData?.results.length || 0} of ${clientsData?.totalResults || 0} clients`
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className='space-y-3'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='flex items-center justify-between p-4 border rounded-lg'
                                >
                                    <div className='flex items-center gap-4'>
                                        <Skeleton className='size-10 rounded-full' />
                                        <div className='space-y-1'>
                                            <Skeleton className='h-4 w-32' />
                                            <Skeleton className='h-3 w-24' />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <Skeleton className='h-4 w-20' />
                                        <Skeleton className='h-8 w-16' />
                                        <Skeleton className='h-8 w-20' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : clientsData?.results.length ? (
                        <div className='overflow-x-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>AUM</TableHead>
                                        <TableHead>Last Meeting</TableHead>
                                        <TableHead>Next Meeting</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientsData.results.map(client => (
                                        <TableRow key={client.id}>
                                            <TableCell>
                                                <div className='flex items-center gap-3'>
                                                    <div className='size-8 rounded-full bg-primary/10 flex items-center justify-center'>
                                                        <Users className='size-4 text-primary' />
                                                    </div>
                                                    <div>
                                                        <div className='font-medium'>{client.name}</div>
                                                        <div className='text-sm text-muted-foreground'>
                                                            {client.type}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant='outline'
                                                    className='capitalize'
                                                >
                                                    {client.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        client.status === 'active'
                                                            ? 'default'
                                                            : client.status === 'prospect'
                                                              ? 'secondary'
                                                              : 'outline'
                                                    }
                                                    className='capitalize'
                                                >
                                                    {client.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-1'>
                                                    <DollarSign className='size-3 text-muted-foreground' />
                                                    <span className='font-medium'>
                                                        ${(client.aum / 1000000).toFixed(1)}M
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {client.last_meeting_date ? (
                                                    <div className='text-sm'>
                                                        {new Date(client.last_meeting_date).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className='text-muted-foreground text-sm'>None</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {client.next_meeting_date ? (
                                                    <div className='text-sm'>
                                                        {new Date(client.next_meeting_date).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className='text-muted-foreground text-sm'>Not scheduled</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center gap-2'>
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        asChild
                                                    >
                                                        <Link to={`/clients/${client.id}`}>View</Link>
                                                    </Button>
                                                    {client.status === 'active' && client.next_meeting_date && (
                                                        <Button
                                                            size='sm'
                                                            asChild
                                                        >
                                                            <Link to={`/meeting-prep/${client.id}`}>
                                                                <Calendar className='size-3 mr-1' />
                                                                Prepare
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <Users className='size-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='text-lg font-medium mb-2'>No clients found</h3>
                            <p className='text-muted-foreground mb-4'>
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by adding your first client.'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {clientsData && clientsData.totalPages > 1 && (
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-muted-foreground'>
                        Page {clientsData.page} of {clientsData.totalPages}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            disabled={clientsData.page <= 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            disabled={clientsData.page >= clientsData.totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
