import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const AppHeader = () => {
    const { setTheme } = useTheme();

    return (
        <header className='flex h-16 items-center gap-4 border-b px-6'>
            <SidebarTrigger className='-ml-1' />

            <div className='flex-1' />

            <div className='flex items-center gap-2'>
                {/* Notifications */}
                <Button
                    variant='ghost'
                    size='icon'
                    className='relative'
                >
                    <Bell className='size-4' />
                    <span className='absolute -top-1 -right-1 size-2 rounded-full bg-red-500' />
                </Button>

                {/* Theme Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                        >
                            <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                            <span className='sr-only'>Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
