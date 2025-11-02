import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { App } from './App.tsx';
import '@/styles/index.css';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error: any) => {
                // Don't retry on 404s or auth errors
                if (error?.response?.status === 404 || error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 2;
            }
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                >
                    <App />
                    <Toaster />
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
