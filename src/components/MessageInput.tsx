'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch } from '@/hooks/redux-hooks';
import {
  useJoinConversationMutation,
  useNewConversationMutation,
} from '@/redux/apis/messageEndpoints';
import { addMessage, updateMessageStatus } from '@/redux/slice/messagesSlice';
import { IPostChat, Message } from '@/types/types';
import { useUploadThing } from '@/utils/uploadthing';
import { ImageIcon, Loader2, Send, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';

interface MessageInputProps {
  conversationId: string | 'new-conversation';
  friendId: string;
}

export function MessageInput({ conversationId, friendId }: MessageInputProps) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [images, setImages] = useState<ImageListType>([]);
  const [file, setFile] = useState<File | null>(null);

  const maxNumber = 1;
  const maxFileSize = 1024 * 1024;

  const lastScrollRef = useRef<HTMLDivElement>(null);
  const { startUpload, isUploading: uploadLoading } = useUploadThing('imageUploader');

  const [joinConversation] = useJoinConversationMutation();
  const [newConversation, { isLoading }] = useNewConversationMutation();

  const { data: session } = useSession();
  const userId = session?.user.id;

  const dispatch = useAppDispatch();

  const handleSendMessage = async () => {
    let imageUrl: string | undefined;

    if (file) {
      if (file.size > maxFileSize) {
        alert('Image size must be 1MB or less.');
        return;
      }

      try {
        const res = await startUpload([file]);
        if (res && res[0]?.url) {
          imageUrl = res[0].url;
        } else {
          alert('Image upload failed.');
          return;
        }
      } catch (error) {
        console.error('Upload error:', error);
        return;
      }
    }

    const newMessage: Message = {
      senderId: userId!,
      text: text.trim(),
      timestamp: new Date(),
      name: session?.user.name || 'Unknown',
      fileUrl: imageUrl || '',
      status: 'pending',
    };

    dispatch(addMessage(newMessage));

    setText('');
    setFile(null);
    setImages([]);

    const body: IPostChat = {
      conversationId: conversationId,
      senderId: userId!,
      receiverId: friendId,
      text: text.trim() || undefined,
      image: imageUrl,
    };

    if (conversationId === 'new-conversation') {
      const { data } = await newConversation(body);
      const conversationId = data?.data?.conversationId;

      if (conversationId) {
        router.replace(`/chat/${conversationId}?e=${friendId}`);
        return;
      }

      return;
    }

    try {
      await joinConversation(body);
      dispatch(updateMessageStatus({ timestamp: newMessage.timestamp, status: 'sent' }));
    } catch (error) {
      dispatch(updateMessageStatus({ timestamp: newMessage.timestamp, status: 'failed' }));
      console.error('Message send failed', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    await handleSendMessage();
  };

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    setFile(imageList[0]?.file || null);
  };

  useEffect(() => {
    lastScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [images]);

  return (
    <div className='border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4'>
      <ImageUploading
        multiple={false}
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey='data_url'
        maxFileSize={maxFileSize}
        acceptType={['jpg', 'jpeg', 'png', 'gif']}
      >
        {({ imageList, onImageUpload, onImageRemove, errors }) => (
          <>
            {errors && (
              <div className='mb-2'>
                {errors.maxNumber && (
                  <p className='text-sm text-red-500'>Only one image can be uploaded at a time</p>
                )}
                {errors.maxFileSize && (
                  <p className='text-sm text-red-500'>File size exceeds 1MB limit</p>
                )}
              </div>
            )}

            {imageList.map((image, index) => (
              <div key={index} className='relative mb-4 inline-block'>
                <img
                  src={image.data_url}
                  alt='Preview'
                  className='max-w-xs max-h-40 rounded-lg object-contain shadow-sm border border-slate-200 dark:border-slate-700'
                />
                <button
                  type='button'
                  onClick={() => {
                    onImageRemove(index);
                    setFile(null);
                  }}
                  className='absolute -top-2 -right-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 shadow-md p-1'
                  aria-label='Remove image'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ))}

            <form onSubmit={handleSubmit} className='flex items-end gap-2'>
              <div className='flex gap-1'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        type='button'
                        className='rounded-full h-10 w-10 shrink-0 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        onClick={onImageUpload}
                      >
                        <ImageIcon className='h-5 w-5' />
                        <span className='sr-only'>Attach image</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>Attach image (max 1MB)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className='relative flex-1'>
                <Textarea
                  placeholder='Type a message...'
                  className='min-h-[80px] max-h-[200px] resize-none pl-3 pr-3 py-3 rounded-lg border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              <Button
                type='submit'
                size='icon'
                className='rounded-full h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700 transition-colors'
                disabled={uploadLoading || (!text.trim() && !file)}
              >
                {uploadLoading || isLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <Send className='h-5 w-5' />
                )}
                <span className='sr-only'>Send message</span>
              </Button>
            </form>
          </>
        )}
      </ImageUploading>
      <div ref={lastScrollRef} />
    </div>
  );
}
