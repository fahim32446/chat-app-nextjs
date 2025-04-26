import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import useApiMutation from '@/utils/usePost';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = { setCurrentView: Dispatch<SetStateAction<any>> };

// Password change form schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(4, { message: 'Password must be at least 4 characters' }),
    newPassword: z.string().min(4, { message: 'Password must be at least 4 characters' }),
    confirmPassword: z.string().min(4, { message: 'Password must be at least 4 characters' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const ChangePassword = ({ setCurrentView }: Props) => {
  const [updatePassword, { data, isLoading, isSuccess, isError, error }] = useApiMutation<void>(
    `${API_ENDPOINTS.PASSWORD_UPDATE}`,
    'PUT'
  );

  // Default values for the password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  function onPasswordSubmit(data: PasswordFormValues) {
    updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  }

  useEffect(() => {
    if (isSuccess) {
      toast('Password has been changed');
    } else if (isError) {
      toast('Incorrect password !');
    }
  }, [isSuccess, isError]);

  return (
    <>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => setCurrentView('main')}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-3xl font-bold'>Change Password</h1>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>Change your account password.</CardDescription>
        </CardHeader>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className='space-y-6'>
            <CardContent className='space-y-6'>
              {/* Current Password Field */}
              <FormField
                control={passwordForm.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormDescription>Enter your current password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={passwordForm.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormDescription>Enter your new password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={passwordForm.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormDescription>Confirm your new password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline' type='button' onClick={() => setCurrentView('main')}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Update Password
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
