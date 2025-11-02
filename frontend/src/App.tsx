import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { MeetingPrepPage } from '@/pages/MeetingPrepPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

export const App = () => {
    return (
        <div className='min-h-screen bg-background font-sans antialiased'>
            <Routes>
                <Route
                    path='/'
                    element={<AppLayout />}
                >
                    <Route
                        index
                        element={<DashboardPage />}
                    />
                    <Route
                        path='meeting-prep/:clientId'
                        element={<MeetingPrepPage />}
                    />
                    <Route
                        path='clients'
                        element={<ClientsPage />}
                    />
                    <Route
                        path='clients/:id'
                        element={
                            <ComingSoonPage
                                title='Client Details'
                                description='Individual client view with complete 360-degree client information.'
                            />
                        }
                    />
                    <Route
                        path='documents'
                        element={
                            <ComingSoonPage
                                title='Document Management'
                                description='Upload, process, and manage client documents with AI-powered classification.'
                            />
                        }
                    />
                    <Route
                        path='integrations'
                        element={
                            <ComingSoonPage
                                title='System Integrations'
                                description='Monitor and manage connections to CRM, portfolio systems, and other platforms.'
                            />
                        }
                    />
                    <Route
                        path='settings'
                        element={
                            <ComingSoonPage
                                title='Settings'
                                description='User preferences, system configuration, and account management.'
                            />
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
};
