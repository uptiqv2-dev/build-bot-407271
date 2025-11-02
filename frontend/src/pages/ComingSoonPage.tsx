import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ComingSoonPageProps {
    title: string;
    description: string;
}

export const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
    return (
        <div className='container max-w-2xl mx-auto py-12'>
            <div className='mb-6'>
                <Button
                    variant='ghost'
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

            <Card className='text-center'>
                <CardHeader className='pb-6'>
                    <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted'>
                        <Construction className='size-8 text-muted-foreground' />
                    </div>
                    <CardTitle className='text-2xl'>{title}</CardTitle>
                    <CardDescription className='text-base'>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-6'>
                        This feature is currently under development and will be available in a future release.
                    </p>
                    <Button asChild>
                        <Link to='/'>Return to Dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
