'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppSelector } from '@/hooks/redux-hooks';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

type Props = {};

const ChatParticipant = (props: Props) => {
  const conversationParticipant = useAppSelector((state) => state.messages.ConversationParticipant);
  const { data: loginData } = useSession();
  const message = useAppSelector((state) => state.messages.messages);
  const images = message.filter((item) => item.fileUrl);
  const userId = loginData?.user?.id;
  const chatParticipants = conversationParticipant?.filter((item) => item.id !== userId);

  return (
    <div className='p-5 space-y-6 bg-background rounded-lg shadow-sm'>
      {/* Participants Section */}
      <div>
        <h2 className='text-lg font-semibold pb-2 mb-3 text-primary'>Participants</h2>

        {chatParticipants?.length ? (
          chatParticipants?.map((item, index) => (
            <div key={index} className='flex items-center mb-3 p-2 rounded'>
              <div className='relative mr-3'>
                <Avatar className='h-10 w-10 border'>
                  <AvatarFallback className='bg-blue-100 text-blue-600'>
                    {item?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className='absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border '></span>
              </div>
              <div>
                <h3 className='font-medium text-primary'>{item?.name}</h3>
                <p className='text-xs text-gray-500'>Online</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500 italic'>No other participants</p>
        )}
      </div>

      {/* Shared Media Section */}
      <div>
        <h2 className='text-lg font-semibold pb-2 mb-3 text-primary'>Shared Media</h2>

        {images?.length > 0 ? (
          <div className='grid grid-cols-3 gap-2 mt-3'>
            {images.map((item, index) => (
              <div key={index} className='relative group cursor-pointer'>
                <Image
                  src={item.fileUrl}
                  alt='Shared image'
                  className='rounded-md object-cover  w-full transition-all duration-300 group-hover:opacity-90'
                  height={150}
                  width={150}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-4 rounded-lg'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              className='text-gray-400 mb-2'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
              <circle cx='8.5' cy='8.5' r='1.5'></circle>
              <polyline points='21 15 16 10 5 21'></polyline>
            </svg>
            <p className='text-sm text-gray-500'>No images shared yet</p>
          </div>
        )}
      </div>

      {/* Location Section */}
      {/* <div>
        <h2 className='text-lg font-semibold border-b pb-2 mb-3 text-primary'>Location Sharing</h2>
        <div className='flex flex-col items-center justify-center p-4 bg-background rounded-lg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            className='text-gray-400 mb-2'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
            <circle cx='12' cy='10' r='3'></circle>
          </svg>
          <p className='text-sm text-gray-500'>No active location sharing</p>
        </div>
      </div> */}
    </div>
  );
};
export default ChatParticipant;
