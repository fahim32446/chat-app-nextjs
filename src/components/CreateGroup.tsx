import { useCreateGroupMutation, useGetAllFriendsQuery } from '@/redux/apis/messageEndpoints';
import { ICreateGroup, IFriendList } from '@/types/types';
import { CheckCircle2, PlusCircle, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

export const GroupChatModal = () => {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<IFriendList[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createGroup, { isLoading: groupLoading, isSuccess }] = useCreateGroupMutation();
  const { data, isLoading } = useGetAllFriendsQuery();
  const friendList = data?.data;

  useEffect(() => {
    if (!isModalOpen) {
      setGroupName('');
      setSelectedMembers([]);
    }
  }, [isModalOpen]);

  const toggleMemberSelection = (contact: IFriendList) => {
    if (selectedMembers.some((member) => member.id === contact.id)) {
      setSelectedMembers(selectedMembers.filter((member) => member.id !== contact.id));
    } else {
      setSelectedMembers([...selectedMembers, contact]);
    }
  };

  const removeMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== id));
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!groupName.trim() || selectedMembers.length < 2) {
      return;
    }

    const body: ICreateGroup = {
      name: groupName,
      users: selectedMembers.map((item) => item.id),
    };

    const { data } = await createGroup(body);
    const conversationId = data?.data?.id;

    if (conversationId) {
      router.replace(`/chat/${conversationId}`);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
    }
  }, [isSuccess]);

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        className='flex items-center gap-2 w-full'
        onClick={() => setIsModalOpen(true)}
      >
        <Users className='h-4 w-4' />
        Create Group Chat
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md md:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-xl'>
              <Users className='h-5 w-5' />
              Create Group Chat
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
            {/* Group Name Input */}
            <div className='space-y-2'>
              <Label htmlFor='groupName' className='text-sm font-medium'>
                Group Name
              </Label>
              <Input
                id='groupName'
                placeholder='Enter group name...'
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className='w-full'
                required
              />
            </div>

            {/* Selected Members Display */}
            {selectedMembers.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>
                  Selected Members ({selectedMembers.length})
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant='secondary'
                      className='pl-1 pr-1 py-1 flex items-center gap-1'
                    >
                      <Avatar className='h-5 w-5'>
                        <AvatarImage src={member.imageUrl} />
                        <AvatarFallback className='text-xs'>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className='text-xs'>{member.name}</span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 p-0 ml-1'
                        onClick={() => removeMember(member.id)}
                      >
                        <X className='h-3 w-3' />
                        <span className='sr-only'>Remove {member.name}</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Contacts</Label>
              <ScrollArea className='h-[180px] rounded-md border'>
                {isLoading ? (
                  <div className='flex items-center justify-center h-full'>
                    <p className='text-sm text-muted-foreground'>Loading contacts...</p>
                  </div>
                ) : (
                  <div className='p-1'>
                    {friendList?.map((contact) => {
                      const isSelected = selectedMembers.some((member) => member.id === contact.id);

                      return (
                        <div
                          key={contact.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted/60 ${
                            isSelected ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => toggleMemberSelection(contact)}
                        >
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={contact.imageUrl} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='text-sm font-medium'>{contact.name}</p>
                              <p className='text-xs text-muted-foreground'>{contact.email}</p>
                            </div>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className='h-5 w-5 text-primary' />
                          ) : (
                            <PlusCircle className='h-5 w-5 text-muted-foreground' />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            <DialogFooter className='sm:justify-between flex flex-col-reverse sm:flex-row gap-3'>
              <Button type='button' variant='outline' onClick={() => setIsModalOpen(true)}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!groupName.trim() || selectedMembers.length < 2 || groupLoading}
                className='gap-2'
              >
                <Users className='h-4 w-4' />
                {groupLoading ? 'Please wait' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
