import { cn } from '@/lib/utils';
import { useGetAllFriendsQuery } from '@/redux/apis/messageEndpoints';
import { IRecentConversation } from '@/types/types';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Skeleton } from './ui/skeleton';

interface IProps {
  recent: IRecentConversation[] | undefined;
  handleSelectChat: (conversationId: string, friendId: string) => void;
}
const SidebarFriendList = ({ recent, handleSelectChat }: IProps) => {
  const activeId = useParams().id;

  const { data, isLoading } = useGetAllFriendsQuery();
  const friendList = data?.data;

  const filteredFriends = friendList?.filter(
    (friend) => !recent?.some((r) => r.friendId === friend.id)
  );

  if (filteredFriends)
    return (
      <SidebarGroup>
        <SidebarGroupLabel className='px-4 text-xs font-medium text-muted-foreground'>
          Start a Conversation
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
            <SidebarMenu className='px-2 space-y-1 mt-2 '>
              {filteredFriends?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeId === item.id}
                    onClick={() => handleSelectChat('new-conversation', item.id)}
                    className={cn(
                      'flex items-center gap-3 py-3 px-3 rounded-lg transition-all cursor-pointer',
                      activeId === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60'
                    )}
                  >
                    <div className='relative'>
                      <Avatar className='h-5 w-5 border shadow-sm'>
                        <AvatarImage src={item.imageUrl} alt={item.name} />
                        <AvatarFallback className='bg-primary/10'>
                          {item.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between items-center'>
                        <p
                          className={cn(
                            'font-medium truncate',
                            activeId === item.id && 'font-semibold'
                          )}
                        >
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    );
};

export default SidebarFriendList;
