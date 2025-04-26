import { ChatMessages } from '@/components/ChatMessages';
import { MessageInput } from '@/components/MessageInput';
import ChatParticipant from '../_components/ChatParticipant';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ e: string }> };

const page = async ({ params, searchParams }: Props) => {
  const data_1 = await params;
  const data_2 = await searchParams;
  const conversationId = data_1.id;
  const friendId = data_2.e;

  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='flex-grow flex flex-col w-full lg:max-w-[65%] border-r  '>
        <ChatMessages conversationId={conversationId} />
        <MessageInput conversationId={conversationId} friendId={friendId} />
      </div>

      <div className='hidden lg:block w-[35%] h-full p-5  shadow-sm'>
        <div className='sticky top-0'>
          <ChatParticipant />
        </div>
      </div>
    </div>
  );
};

export default page;
