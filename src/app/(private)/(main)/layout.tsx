import { ChatSidebar } from '@/components/ChatSidebar';
import { CustomProvider } from '@/components/client-provider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <CustomProvider>
      <SidebarProvider>
        <div className='h-screen flex border w-full'>
          <ChatSidebar />
          <SidebarTrigger className='lg:hidden' />
          <SidebarInset className='flex flex-col'>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </CustomProvider>
  );
};

export default layout;
