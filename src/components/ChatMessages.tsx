'use client';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { getMessageDate } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { useGetConversationDetailsQuery } from '@/redux/apis/messageEndpoints';
import { addMessage, setMessages, setParticipant } from '@/redux/slice/messagesSlice';
import { Message } from '@/types/types';
import { pusherClient } from '@/utils/pusher';
import { format } from 'date-fns';
import { LoaderCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ChatMessagesProps {
  conversationId: string | 'new-conversation';
}

export const ChatMessages = ({ conversationId }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useAppSelector((state) => state.messages.messages);

  const dispatch = useAppDispatch();

  const { data: loginData } = useSession();
  const userId = loginData?.user.id;

  const { data, isLoading, isSuccess } = useGetConversationDetailsQuery(
    { chatId: conversationId },
    { skip: conversationId === 'new-conversation' }
  );

  const isGroup = (data?.data?.ConversationParticipant?.length ?? 0) > 2;

  useEffect(() => {
    if (isSuccess && data?.data?.Messages) {
      dispatch(setMessages(data?.data?.Messages));
      dispatch(setParticipant(data?.data?.ConversationParticipant));
    }
  }, [isSuccess]);

  useEffect(() => {
    pusherClient.subscribe(`conversation-${conversationId}`);

    pusherClient.bind('new-message', (data: { message: Message }) => {
      if (data.message?.senderId !== userId) {
        dispatch(addMessage(data.message));
      }
    });

    return () => {
      pusherClient.unbind_all();
      pusherClient.unsubscribe('new-message');
    };
  }, [conversationId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className='flex flex-col h-full justify-center items-center'>
        <LoaderCircle className='animate-spin' />
      </div>
    );
  }

  if (conversationId === 'new-conversation')
    return <div className='h-full flex justify-center items-center'>Say hello to your friend</div>;
  return (
    <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700'>
      <div className='flex flex-col p-4 space-y-6'>
        {messages.map((message, index) => {
          const me = message.senderId === userId;
          return (
            <div key={index}>
              {getMessageDate(message.timestamp, index, messages) && (
                <div className='flex justify-center my-4'>
                  <span className='px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full'>
                    {format(new Date(message.timestamp), 'MMMM d, yyyy')}
                  </span>
                </div>
              )}

              <div
                className={cn(
                  'flex items-end gap-2 max-w-[80%]',
                  me ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <Avatar className='h-8 w-8 border shadow-sm flex-shrink-0'>
                  <AvatarFallback className='text-xs font-semibold bg-gradient-to-br from-indigo-500 to-purple-500 text-white'>
                    {message.senderId === userId ? 'You' : message.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='flex flex-col'>
                  <div
                    className={cn(
                      'rounded-t-lg p-3 shadow-sm',
                      me
                        ? 'bg-indigo-600 text-white rounded-bl-lg rounded-br-none'
                        : 'bg-white dark:bg-slate-800 dark:text-slate-100 rounded-br-lg rounded-bl-none border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    <p className='whitespace-pre-wrap break-words'>{message.text}</p>
                  </div>

                  {message.fileUrl && (
                    <div
                      className={cn(
                        'mt-1 rounded overflow-hidden border shadow-sm',
                        me ? 'border-indigo-300' : 'border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <img
                        src={message.fileUrl}
                        alt='Attachment'
                        className='max-h-60 w-auto object-contain'
                        loading='lazy'
                      />
                    </div>
                  )}

                  <span
                    className={cn(
                      'text-xs mt-1',
                      me ? 'text-right text-slate-500' : 'text-slate-500'
                    )}
                  >
                    {format(new Date(message.timestamp), 'h:mm a')}{' '}
                    {!me && isGroup ? `-${message.name}` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
