import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import { useUploadThing } from '@/utils/uploadthing';
import useApiMutation from '@/utils/usePost';
import { Loader2, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {};

const ProfileImageUpdate = (props: Props) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: session, update } = useSession();
  const imageURL = session?.user.image;

  const { startUpload, isUploading: uploadLoading } = useUploadThing('imageUploader');
  const [updateImage, { isLoading }] = useApiMutation<void>(`${API_ENDPOINTS.IMAGE_UPDATE}`, 'PUT');

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      alert('Please select a valid image (JPEG, PNG, WEBP, GIF)');
      return;
    }

    // Validate file size (max 3MB)
    const maxSizeInMB = 3;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert('File size must be less than 3MB');
      return;
    }

    // Set the file and preview if valid
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // handle file uploading
    const res = await startUpload([file]);

    if (res?.length) await update({ updateImageUrl: res[0].url });

    if (res) {
      updateImage({ key: res[0].key, url: res[0].url });
    } else {
      toast('Please try again letter');
    }
  }

  const isSubmitting = uploadLoading || isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>Update your profile picture. Recommended size: 300x300px.</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col items-center sm:flex-row sm:items-start gap-6'>
        <Avatar className='h-24 w-24'>
          {imageURL ? (
            <AvatarImage src={imageURL} alt='Profile' />
          ) : (
            <AvatarFallback>UN</AvatarFallback>
          )}
        </Avatar>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='avatar-upload'
              className={cn(
                'cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-fit',
                isSubmitting && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Upload new photo
                </>
              )}
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='sr-only'
                onChange={handleAvatarChange}
                disabled={isSubmitting}
              />
            </label>
            {avatarFile && <p className='text-sm text-muted-foreground'>{avatarFile.name}</p>}
          </div>
          <p className='text-sm text-muted-foreground'>JPG, GIF or PNG. Max size 2MB.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpdate;
