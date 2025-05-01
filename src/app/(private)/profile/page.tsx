'use client';

import { ArrowLeft, KeyRound, Loader2, LogOut, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signOut, useSession } from 'next-auth/react';
import ChangeEmail from './_components/ChangeEmail';
import ChangePassword from './_components/ChangePassword';
import ProfileImageUpdate from './_components/ProfileImageUpdate';

type ViewType = 'main' | 'email' | 'password';

export default function ProfilePage() {
  const user = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [currentView, setCurrentView] = useState<ViewType>('main');

  function handleLogout() {
    setIsLoading(true);

    // Simulate logout
    setTimeout(() => {
      setIsLoading(false);
      signOut({ redirectTo: '/login' });
    }, 1000);
  }

  return (
    <div className='container max-w-3xl py-10 mx-auto'>
      <div className='space-y-6'>
        {currentView === 'main' ? (
          <>
            <div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon' onClick={() => router.push('/')}>
                  <ArrowLeft className='h-5 w-5' />
                </Button>
                <h1 className='text-3xl font-bold'>Profile Settings</h1>
              </div>
              <p className='text-muted-foreground'>Manage your account settings and preferences.</p>
            </div>
            <Separator />

            <div className='flex flex-col gap-8'>
              {/* Profile Photo Section */}
              <ProfileImageUpdate />
              {/* Account Settings Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-4'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <Mail className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-medium'>Email Address</h3>
                        <p className='text-sm text-muted-foreground'>{user.data?.user.email}</p>
                      </div>
                    </div>
                    <Button variant='outline' onClick={() => setCurrentView('email')}>
                      Change
                    </Button>
                  </div>

                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-4'>
                      <div className='p-2 bg-primary/10 rounded-full'>
                        <KeyRound className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-medium'>Password</h3>
                        <p className='text-sm text-muted-foreground'>••••••••</p>
                      </div>
                    </div>
                    <Button variant='outline' onClick={() => setCurrentView('password')}>
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Logout Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Session</CardTitle>
                  <CardDescription>Manage your current session.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant='destructive' onClick={handleLogout} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <LogOut className='mr-2 h-4 w-4' />
                    )}
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : currentView === 'email' ? (
          <ChangeEmail setCurrentView={setCurrentView} />
        ) : (
          <ChangePassword setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  );
}
