import { auth } from '@/auth';
import { handleRequest } from '@/lib/helper';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface IBody {
  url: string;
  key: string;
}

export const PUT = async (req: NextRequest) =>
  handleRequest(async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let body: IBody;

    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const { url, key } = body;

    if (!url || !key) {
      return NextResponse.json({ message: 'Missing image URL or key' }, { status: 400 });
    }

    try {
      const prevImage = await prisma.user.findUnique({
        where: { id: userId },
        select: { imageUrl: true, imageKey: true },
      });

      if (prevImage?.imageKey) {
        await fetch('https://api.uploadthing.com/v6/deleteFiles', {
          method: 'POST',
          headers: {
            'X-Uploadthing-Api-Key': process.env.UPLOADTHING_API_SECRET!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileKeys: [prevImage.imageKey] }),
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          imageUrl: url,
          imageKey: key,
        },
      });

      return NextResponse.json({
        status: 201,
        message: 'Image URL has been updated successfully',
      });
    } catch (error) {
      console.error('[PUT_IMAGE_ERROR]', error);
      return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
  });
