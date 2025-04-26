import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import useApiMutation from '@/utils/usePost';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  setCurrentView: Dispatch<SetStateAction<any>>;
};

const emailFormSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email('Invalid email address'),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

const ChangeEmail = ({ setCurrentView }: Props) => {
  const [updateEmail, { data, isLoading, isSuccess, isError, error }] = useApiMutation<void>(
    `${API_ENDPOINTS.EMAIL_UPDATE}`,
    'PUT'
  );

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: 'user@example.com',
      password: '',
    },
    mode: 'onChange',
  });

  function onEmailSubmit(data: EmailFormValues) {
    updateEmail(data);
  }

  useEffect(() => {
    if (isSuccess) {
      toast('Email has been updated');
    } else if (isError) {
      toast('Password or Email does not match');
    }
  }, [isSuccess, isError]);

  return (
    <>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={() => setCurrentView('main')}>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <h1 className='text-3xl font-bold'>Change Email</h1>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Update Email Address</CardTitle>
          <CardDescription>Change the email address associated with your account.</CardDescription>
        </CardHeader>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className='space-y-6'>
            <CardContent className='space-y-6'>
              {/* Email Field */}
              <FormField
                control={emailForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email</FormLabel>
                    <FormControl>
                      <Input placeholder='your.new.email@example.com' {...field} />
                    </FormControl>
                    <FormDescription>Enter the new email address you want to use.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Password Field */}
              <FormField
                control={emailForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your current password to confirm this change.
                    </FormDescription>
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
                Update Email
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default ChangeEmail;
