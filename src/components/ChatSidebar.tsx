'use client';
import { Label } from '@/components/ui/label';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAppDispatch } from '@/hooks/redux-hooks';
import { formatTimestamp } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { useRecentConversationQuery } from '@/redux/apis/messageEndpoints';
import { setActiveChat } from '@/redux/slice/activeChatSlice';
import {
  MessageSquare,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  User2,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { GroupChatModal } from './CreateGroup';
import SidebarFriendList from './SidebarFriendList';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

export function ChatSidebar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const activeId = useParams().id;
  const { data: session } = useSession();

  const { data, isLoading } = useRecentConversationQuery();

  const recent = data?.data;

  const dispatch = useAppDispatch();

  // Using the complete sidebar state management from your hook
  const { isMobile, open, setOpen, openMobile, setOpenMobile } = useSidebar();

  const isLogin = session?.user.id;
  const { setTheme, theme } = useTheme();
  const isDark = theme === 'dark';

  const filterConversation = recent?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const changeTheme = () => {
    if (isDark) return setTheme('light');
    setTheme('dark');
  };

  // Function to handle toggling sidebar based on device type
  const handleToggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  };

  // Function to close sidebar after selecting chat on mobile
  const handleSelectChat = (conversationId: string, friendId: string) => {
    router.push(`/chat/${conversationId}?e=${friendId}`);
    dispatch(
      setActiveChat({
        conversationId,
        friendId,
      })
    );

    // Close mobile sidebar after selection
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      className={cn(
        'border-r border-border/50 transition-all duration-300',
        // Handle visibility based on state and device type
        isMobile && !openMobile && 'transform -translate-x-full md:translate-x-0'
      )}
    >
      <SidebarHeader className='pb-2 border-b'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5 text-primary' />
            <h2 className='text-xl font-bold'>Chats</h2>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='hidden md:flex rounded-full'
              onClick={handleToggleSidebar}
            >
              {open ? (
                <PanelLeftClose className='h-5 w-5' />
              ) : (
                <PanelLeftOpen className='h-5 w-5' />
              )}
              <span className='sr-only'>Toggle sidebar</span>
            </Button>
          </div>
        </div>

        <SidebarGroup className='py-0 px-3'>
          <SidebarGroupContent className='relative'>
            <Label htmlFor='search' className='sr-only'>
              Search
            </Label>
            <SidebarInput
              id='search'
              placeholder='Search conversations...'
              className='pl-8 h-9 rounded-lg'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 select-none text-muted-foreground' />
          </SidebarGroupContent>
        </SidebarGroup>

        <div className='py-0 px-3'>
          <GroupChatModal />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='px-4 text-xs font-medium text-muted-foreground'>
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index} className='px-2'>
                    <div className='flex items-center gap-3 py-3 px-2 w-full rounded-lg'>
                      <Skeleton className='h-10 w-10 rounded-full' />
                      <div className='flex-1 min-w-0'>
                        <div className='flex justify-between items-center'>
                          <Skeleton className='h-4 w-24' />
                          <Skeleton className='h-3 w-10' />
                        </div>
                        <Skeleton className='h-3 w-full mt-1.5' />
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <SidebarMenu className='px-2 space-y-1 mt-2'>
                {filterConversation?.length ? (
                  filterConversation.map((item) => {
                    const isGroup = item.isGroup;
                    return (
                      <SidebarMenuItem key={item.conversationId}>
                        <SidebarMenuButton
                          isActive={activeId === item.conversationId}
                          onClick={() => handleSelectChat(item.conversationId, item.friendId)}
                          className={cn(
                            'flex items-center gap-3 py-6 px-3 rounded-lg transition-all cursor-pointer',
                            activeId === item.conversationId
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted/60'
                          )}
                        >
                          <div className='relative'>
                            <Avatar className='h-10 w-10 border shadow-sm'>
                              <AvatarImage src={item.friendImage} alt={item.name} />
                              <AvatarFallback
                                className={cn('bg-primary/10', isGroup && 'bg-green-500')}
                              >
                                {isGroup ? (
                                  <span className='text-xs'>Group</span>
                                ) : (
                                  item.name.charAt(0).toUpperCase()
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex justify-between items-center'>
                              <p
                                className={cn(
                                  'font-medium truncate',
                                  activeId === item.conversationId && 'font-semibold'
                                )}
                              >
                                {item.name}
                              </p>
                              <span className='text-xs text-muted-foreground truncate ml-2'>
                                {formatTimestamp(item.timestamp)}
                              </span>
                            </div>
                            <p className='text-sm text-muted-foreground truncate mt-0.5'>
                              {item.lastText}
                            </p>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })
                ) : searchQuery ? (
                  <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
                    <Search className='h-12 w-12 text-muted-foreground mb-3 opacity-20' />
                    <p className='text-muted-foreground'>
                      No conversations found for "{searchQuery}"
                    </p>
                    <Button variant='link' onClick={() => setSearchQuery('')} className='mt-2'>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center py-8 px-4 text-center'>
                    <MessageSquare className='h-12 w-12 text-muted-foreground mb-3 opacity-20' />
                    <p className='text-muted-foreground'>No recent conversations</p>
                  </div>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFriendList recent={recent} handleSelectChat={handleSelectChat} />
      </SidebarContent>

      <SidebarFooter className='border-t'>
        <SidebarMenu className='px-2 py-2'>
          <SidebarMenuItem>
            <SidebarMenuButton className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/60 transition-all w-full'>
              <MessageSquare className='h-4 w-4' />
              <span>All chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Theme toggle button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={changeTheme}
              className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/60 transition-all w-full'
            >
              <div className='relative flex h-6 w-11 items-center rounded-full bg-muted p-1'>
                <div
                  className={cn(
                    'absolute size-4 rounded-full bg-white shadow-sm transition-transform',
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  )}
                >
                  {isDark ? (
                    <Moon className='h-4 w-4 text-indigo-600' />
                  ) : (
                    <Sun className='h-4 w-4 text-amber-500' />
                  )}
                </div>
              </div>
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className='flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/60 transition-all w-full'>
              <User2 className='h-4 w-4' />
              {isLogin ? (
                <Link href='/profile' className='w-full'>
                  Profile
                </Link>
              ) : (
                <Link href='/login' className='w-full'>
                  Login
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {isLogin && (
          <div className='px-3 py-3 mt-2 border-t'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={session?.user.image!} />
                <AvatarFallback>{session?.user.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='font-medium truncate text-sm'>{session?.user.name}</p>
                <p className='text-xs text-muted-foreground truncate'>{session?.user.email}</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>

      {/* Mobile overlay to close sidebar when clicking outside */}

      <SidebarRail />
    </Sidebar>
  );
}
