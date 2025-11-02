import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Zap, UserCheck, TrendingUp } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Menu items
const menuItems = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard
    },
    {
        title: 'Clients',
        url: '/clients',
        icon: Users
    },
    {
        title: 'Documents',
        url: '/documents',
        icon: FileText
    },
    {
        title: 'Integrations',
        url: '/integrations',
        icon: Zap
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings
    }
];

export const AppSidebar = () => {
    const location = useLocation();

    return (
        <Sidebar className='border-r'>
            <SidebarHeader>
                <div className='flex items-center gap-2 px-4 py-2'>
                    <div className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                        <TrendingUp className='size-4' />
                    </div>
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>Advisor Intelligence</span>
                        <span className='truncate text-xs text-muted-foreground'>Assistant</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                    >
                                        <Link to={item.url}>
                                            <item.icon className='size-4' />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size='lg'
                            asChild
                        >
                            <div className='flex items-center gap-3 p-3'>
                                <Avatar className='size-8'>
                                    <AvatarImage
                                        src='/placeholder-avatar.jpg'
                                        alt='User'
                                    />
                                    <AvatarFallback>
                                        <UserCheck className='size-4' />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>John Doe</span>
                                    <span className='truncate text-xs text-muted-foreground'>Financial Advisor</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};
